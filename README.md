# CodeLens

Codebase Q&A: index a public GitHub repo and ask questions about it. Answers cite the exact files and lines.
`client/` is React (JavaScript) + Vite + Tailwind + DaisyUI, `backend/` is Python (FastAPI + LangChain RAG) with MongoDB Atlas.

## 1. MongoDB Atlas
1. Create a free cluster at cloud.mongodb.com.
2. Database Access: add a user with a password.
3. Network Access: add your IP address (or 0.0.0.0/0 for testing only).
4. Connect > Drivers: copy the connection string.

## 2. Install everything
Windows: run `install.bat`. Mac/Linux: `./install.sh`.
It installs the root, client and Python packages and creates `backend/.env` and `client/.env`.
(Python 3.10+ and Node 18+ needed. Use a virtual env and keep it activated for every command below.)

## 3. Configure and run
Open `backend/.env` and paste `MONGO_URL` (and optionally `MISTRAL_API_KEY`), then:

    npm run seed        # indexes a small sample repo (pallets/itsdangerous)
    npm run dev         # backend :4000, client :5173

Index any other public repo from the UI (Add repo) or: `npm run seed -- https://github.com/owner/repo`.
First run downloads the `all-MiniLM-L6-v2` embedding model (about 90 MB).

## How it works
| Part | What it does |
|---|---|
| Storage | MongoDB Atlas: repos, files (with content + resolved imports), feedback |
| Structure | `CORE/repo_analyzer.py`: files are grouped into modules, imports between them become the graph. Most imported files ("hubs") go into the LLM context |
| Parsing | `CORE/code_parser.py`: downloads the repo zip, detects languages, resolves Python/JS imports |
| RAG | Code is split on function/class boundaries (language-aware), embedded with HuggingFace MiniLM and stored in ChromaDB (one collection per repo). The question fetches the 6 most similar chunks |
| LLM | LangChain LCEL chain: `prompt \| Mistral \| StrOutputParser` answers from the repo overview + chunks |
| Real time | Socket.io sends indexing progress and the assistant steps to the UI |

Without `MISTRAL_API_KEY` (or if the LLM call fails) the assistant still returns the best matching files and lines.
The confidence shown in the UI is the similarity score of the best matching chunk.

## Pages
| Page | Route | What it does |
|---|---|---|
| Dashboard | `/` | Totals (repos, files, lines, chunks), lines of code by language, repository cards |
| Files | `/files` | Search and filter files by path, language and repo. Click a row to read the code |
| Repositories | `/repos` | All indexed repos. "Browse files", "Ask AI" and delete |
| Structure | `/structure` | Module import graph and table. Click a module to see its files |
| AI Assistant | `/assistant` | Chat with the RAG assistant. Shows live steps, citations and confidence |

## Project structure
    backend/
      app.py            FastAPI routes + socket.io
      main.py           pipeline: index repo, and find repo -> analyse -> RAG answer
      seed.py           indexes a sample repo
      CORE/
        vector_store.py   chunking, embeddings, ChromaDB
        rag_engine.py     LLM + prompt + RAG chain
        repo_analyzer.py  module graph + repo overview
        code_parser.py    GitHub download, languages, import resolution
      utils/db.py       MongoDB collections
    client/src/
      pages/            one file per page
      components/       small reusable pieces (Navbar, Sidebar, FileTable, ChatWindow ...)
      store/            zustand stores (files, repos, structure, chat, theme)
      lib/              axios + socket.io setup, helper functions
      hooks/            custom hooks
      constants/        nav links, sample questions
