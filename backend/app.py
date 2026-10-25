from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config  # first, so that .env gets loaded
from routes import status, repos, files, structure, assistant

app = FastAPI(title="CodeLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (status, repos, files, structure, assistant):
    app.include_router(module.router, prefix="/api")
