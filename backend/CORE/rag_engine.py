import os
import re
import asyncio
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser
from CORE.vector_store import get_vector_store
from utils.db import files_col

TOP_K = 6          # kitne chunks LLM ko jaate hain
CANDIDATES = 18    # pehle itne dhoondho, phir kaam ke chunks chhaanto
MIN_RELEVANCE = 0.30   # isse kam match ho to fallback me code nahi dikhate

# in files me aksar kaam ka code nahi hota (CI, templates, license). Sawal inke baare me na ho to inhe peeche rakho
NOISE = re.compile(r"(^|/)(\.github|\.vscode|\.idea|docs?)/|(^|/)(LICENSE|CHANGES|CHANGELOG|CODE_OF_CONDUCT)[^/]*$|\.lock$|-lock\.json$", re.I)
NOISE_WORDS = ("github", "workflow", "template", "license", "changelog", "ci ", "docs")

SMALL_TALK = re.compile(
    r"^\s*(hi+|hello+|hey+|hola|namaste|yo|sup|good\s+(morning|afternoon|evening)|thanks?|thank\s+you|ok(ay)?|cool|bye|help|who\s+are\s+you|what\s+can\s+you\s+do)\W*\s*$",
    re.I)


OVERVIEW = re.compile(r"\b(what\s+(does|is)\s+(this|the)\s+(project|repo|repository|codebase|app)|what\s+is\s+this|overview|summar(y|ize)|purpose|about\s+this)\b", re.I)


def readme_context(repo: str) -> str:
    # "project kya karta hai" jaise sawal ka jawab README me hota hai, embeddings se wo hamesha upar nahi aata
    # README kisi folder ke andar bhi ho sakti hai (jaise currency/README.md), isliye sabse chhota path chuno
    found = list(files_col.find({"repo": repo, "path": re.compile(r"(^|/)readme(\.\w+)?$", re.I)}, {"path": 1, "content": 1}))
    if not found:
        return ""
    f = min(found, key=lambda x: len(x["path"]))
    return f"### {f['path']}\n{f['content'][:3500]}"


def llm_provider() -> str:
    # LLM_PROVIDER set ho to wahi, warna jis ki key mili wo
    wanted = os.getenv("LLM_PROVIDER", "").strip().lower()
    if wanted in ("mistral", "groq"):
        return wanted
    if not os.getenv("MISTRAL_API_KEY", "").strip() and os.getenv("GROQ_API_KEY", "").strip():
        return "groq"
    return "mistral"


def llm_enabled() -> bool:
    key = "GROQ_API_KEY" if llm_provider() == "groq" else "MISTRAL_API_KEY"
    return bool(os.getenv(key, "").strip())


def get_llm():
    if llm_provider() == "groq":
        from langchain_groq import ChatGroq  # sirf tab import jab Groq use ho
        return ChatGroq(model=os.getenv("GROQ_MODEL", "openai/gpt-oss-120b"), api_key=os.getenv("GROQ_API_KEY"), temperature=0.1, max_retries=1)
    return ChatMistralAI(model=os.getenv("MISTRAL_MODEL", "mistral-small-latest"), api_key=os.getenv("MISTRAL_API_KEY"), temperature=0.1, max_retries=1)


def format_docs(docs):
    return "\n\n".join(
        f'### {d.metadata["path"]}:{d.metadata["start_line"]}-{d.metadata["end_line"]}\n{d.page_content}' for d in docs)


def build_rag_chain():
    prompt = ChatPromptTemplate.from_messages([
        ("system",
         """You are CodeLens, a friendly senior engineer who explains the codebase below.
Answer the user's question using the repo overview and code excerpts provided.

Rules:
- Be direct and specific. Name the files, classes and functions involved.
- Cite code as `path:start-end`.
- Use short markdown: a one-line answer first, then a few bullets if needed.
- Add a small code snippet only when it really helps.
- If the message is a greeting or chit-chat (not about the code), reply briefly and warmly, then invite a question about the repo. Ignore the excerpts in that case.
- If it is a code question and the excerpts do not contain the answer, say "I could not find this in the indexed code" and suggest what to ask instead.
- Keep it under 180 words. Never invent files or functions.

Repository: {repo}

Main modules:
{modules}

Most imported files:
{hubs}

Code excerpts:
{context}"""),
        MessagesPlaceholder("history"),
        ("human", "{question}"),
    ])
    # simple LCEL chain: prompt -> llm -> text
    return prompt | get_llm() | StrOutputParser()


def to_messages(history: list) -> list:
    msgs = []
    for h in (history or [])[-6:]:
        text = str(h.get("content", ""))[:800]
        msgs.append(HumanMessage(text) if h.get("role") == "user" else AIMessage(text))
    return msgs


def small_talk_answer(llm_on: bool, repo_name: str) -> str:
    tip = "" if llm_on else "\n\n_Heads up: the AI model is not connected yet, so I can only point to the most relevant code. Add `MISTRAL_API_KEY` or `GROQ_API_KEY` in `backend/.env` for full written answers._"
    return (f"Hi! I'm CodeLens. I've read **{repo_name}** and can explain how it works.\n\n"
            "Try asking:\n- What does this project do?\n- Where is the main logic?\n- How does `<function name>` work?" + tip)


def pick_docs(results: list, question: str) -> list:
    asks_noise = any(w in question.lower() for w in NOISE_WORDS)
    good = [d for d, _ in results if asks_noise or not NOISE.search(d.metadata["path"])]
    rest = [d for d, _ in results if d not in good]
    return (good + rest)[:TOP_K]


def fallback_answer(docs: list, note: str) -> str:
    # LLM na chale (key nahi / error) to sabse milta-julta code dikha do
    if not docs:
        return (f"{note}\n\n" if note else "") + "I could not find code that closely matches this. Try rephrasing, or mention a file or function name."
    top = docs[0]
    m = top.metadata
    lang = m.get("language", "").lower().replace("c++", "cpp").replace("c#", "csharp")
    snippet = "\n".join(top.page_content.strip().splitlines()[:22])
    others = sorted({d.metadata["path"] for d in docs[1:4] if d.metadata["path"] != m["path"]})
    out = [f"{note}\n", f"The most relevant code is in `{m['path']}` (lines {m['start_line']}-{m['end_line']}):",
           f"```{lang}\n{snippet}\n```"]
    if others:
        out.append("Also related: " + ", ".join(f"`{p}`" for p in others))
    return "\n".join(out)


def explain_error(e: Exception) -> str:
    s = str(e)
    if "401" in s or "Unauthorized" in s:
        return "The API key was rejected (401). Check the key in backend/.env."
    if "429" in s:
        return f"{llm_provider().title()} rate limit or quota reached (429). Wait a minute, check your {llm_provider().title()} dashboard quota, or switch provider in backend/.env."
    if isinstance(e, asyncio.TimeoutError):
        return "The AI model took too long to answer."
    return f"The AI model call failed: {s[:120]}"


async def ask_question(repo: str, question: str, analysis: dict, history: list = None, repo_name: str = "") -> dict:
    print(f"Question: {question}")
    llm_on = llm_enabled()

    # hi / thanks jaise messages par code search karna bekaar hai
    if SMALL_TALK.match(question):
        return {"content": small_talk_answer(llm_on, repo_name or repo), "citations": [], "confidence": 1.0,
                "source": "llm" if llm_on else "extractive", "note": None if llm_on else "llm_off"}

    vector_store = get_vector_store(repo)
    if vector_store._collection.count() == 0:
        # Chroma missing collection ko chupchap khaali bana deta hai -> search [] deta hai
        return {"content": "This repo is indexed in MongoDB but its code chunks are missing from the local vector DB "
                           "(`backend/vector_db`). Delete the repo and add it again to re-index.",
                "citations": [], "confidence": 0.0, "source": "extractive", "note": "index_empty"}
    results = await asyncio.to_thread(vector_store.similarity_search_with_relevance_scores, question, CANDIDATES)
    docs = pick_docs(results, question)
    confidence = round(max(0.0, min(1.0, results[0][1])), 2) if results else 0.0

    modules = "\n".join(f'- {m["module"]}: {m["files"]} files, {m["lines"]} lines' for m in analysis["modules"]) or "none"
    hubs = "\n".join(f'- {h["path"]} (imported by {h["importedBy"]} files)' for h in analysis["hubs"]) or "none"

    source, note = "llm", None
    try:
        if not llm_on:
            raise ValueError("no LLM API key set")
        answer = await asyncio.wait_for(
            build_rag_chain().ainvoke({"repo": repo_name or repo, "question": question, "modules": modules, "hubs": hubs,
                                       "context": (readme_context(repo) + "\n\n" if OVERVIEW.search(question) else "") + format_docs(docs), "history": to_messages(history)}),
            timeout=40,
        )
    except Exception as e:
        import traceback; traceback.print_exc()
        print(f"LLM unavailable, using fallback: {e!r}")
        source = "extractive"
        note = "llm_off" if not llm_on else "llm_error"
        msg = ("The AI model is not connected, so I can only show the closest code. "
               "Add `MISTRAL_API_KEY` or `GROQ_API_KEY` to `backend/.env` and restart for written answers."
               if not llm_on else explain_error(e) + " Showing the closest code instead.")
        overview = bool(OVERVIEW.search(question))
        answer = fallback_answer(docs if (confidence >= MIN_RELEVANCE or overview) else [], msg)
        readme = readme_context(repo) if overview else ""
        if readme:
            answer = f"{msg}\n\nFrom the README:\n\n{readme.split(chr(10), 1)[1][:1200]}"

    citations = [
        {"kind": "code", "path": d.metadata["path"], "start": d.metadata["start_line"], "end": d.metadata["end_line"],
         "ref": f'{d.metadata["path"]}:{d.metadata["start_line"]}-{d.metadata["end_line"]}',
         "snippet": " ".join(d.page_content.split())[:180]}
        for d in docs[:4]
    ]
    return {"content": answer.strip(), "citations": citations, "confidence": confidence, "source": source, "note": note}