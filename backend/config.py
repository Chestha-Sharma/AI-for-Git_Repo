import os
from dotenv import load_dotenv

# .env sabse pehle yahin load hoti hai, baaki files isse import karti hain
load_dotenv()

PORT = int(os.getenv("PORT", "4000"))
FRONTEND_ORIGIN = [o.strip() for o in os.getenv("FRONTEND_ORIGIN", "http://localhost:5173").split(",")]
