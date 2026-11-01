from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import config   
from routes import status, repos, files, assistant

app = FastAPI(title="CodeLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (status, repos, files, assistant):
    app.include_router(module.router, prefix="/api")
