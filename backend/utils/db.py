import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise RuntimeError("MONGO_URL is not set. Copy backend/.env.example to .env and paste your Atlas URL.")

client = MongoClient(MONGO_URL, tz_aware=True, serverSelectionTimeoutMS=8000)
db = client["codelens"]

repos_col = db["repos"]
files_col = db["files"]
feedback_col = db["feedback"]
