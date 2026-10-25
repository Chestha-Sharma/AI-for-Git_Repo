import os
import chromadb
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import Language, RecursiveCharacterTextSplitter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_DIR = os.path.join(BASE_DIR, "vector_db")
EMBEDDING_MODEL = "all-MiniLM-L6-v2"

# in languages ke liye splitter function/class boundaries par todta hai
SPLIT_LANG = {
    "Python": Language.PYTHON, "JavaScript": Language.JS, "TypeScript": Language.TS, "Java": Language.JAVA,
    "Go": Language.GO, "Rust": Language.RUST, "C++": Language.CPP, "C": Language.C, "C#": Language.CSHARP,
    "Ruby": Language.RUBY, "PHP": Language.PHP, "Markdown": Language.MARKDOWN, "HTML": Language.HTML,
}

_embeddings = None


def get_embeddings():
    global _embeddings
    if _embeddings is None:  # model ek baar hi load hota hai
        _embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
    return _embeddings


def get_splitter(language: str):
    if language in SPLIT_LANG:
        return RecursiveCharacterTextSplitter.from_language(
            SPLIT_LANG[language], chunk_size=1000, chunk_overlap=100, add_start_index=True)
    return RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100, add_start_index=True)


def chunk_files(files: list) -> list:
    docs = []
    for f in files:
        for d in get_splitter(f["language"]).create_documents([f["content"]]):
            start = f["content"].count("\n", 0, d.metadata["start_index"]) + 1
            docs.append(Document(page_content=d.page_content, metadata={
                "path": f["path"], "language": f["language"],
                "start_line": start, "end_line": start + d.page_content.count("\n")}))
    return docs


def delete_vector_store(repo: str) -> None:
    try:
        chromadb.PersistentClient(path=CHROMA_DIR).delete_collection(repo)
    except Exception:
        pass


def build_vector_store(repo: str, files: list) -> int:
    docs = chunk_files(files)
    delete_vector_store(repo)  # dobara index karne par duplicate chunks na bane
    Chroma.from_documents(docs, embedding=get_embeddings(), collection_name=repo,
                          persist_directory=CHROMA_DIR, collection_metadata={"hnsw:space": "cosine"})
    return len(docs)


def get_vector_store(repo: str) -> Chroma:
    # har request par fresh handle: re-index ke baad purani collection id nahi atakti
    return Chroma(persist_directory=CHROMA_DIR, embedding_function=get_embeddings(), collection_name=repo)


def get_retriever(vector_store: Chroma, k: int = 6):
    return vector_store.as_retriever(search_type="similarity", search_kwargs={"k": k})
