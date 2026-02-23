from fastapi import FastAPI, HTTPException
import logging
import traceback
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import sqlite3
import json
from pathlib import Path
import os

from resume_data import SAMPLE_RESUME
from chat_engine import ask_question

DB_PATH = Path(__file__).parent / "data.db"
# Path to the frontend build artifacts
FRONTEND_PATH = Path(__file__).parent.parent / "frontend" / "dist"

app = FastAPI()

# Only keep CORS for local development; in production, 
# the frontend is served from the same origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS resume (
            id INTEGER PRIMARY KEY,
            content TEXT NOT NULL
        )
        """
    )
    # Always refresh with latest SAMPLE_RESUME for development
    c.execute("DELETE FROM resume")
    c.execute("INSERT INTO resume (id, content) VALUES (1, ?)", (json.dumps(SAMPLE_RESUME),))
    conn.commit()
    conn.close()


def get_resume_text() -> str:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT content FROM resume ORDER BY id DESC LIMIT 1")
    row = c.fetchone()
    conn.close()
    if not row:
        return json.dumps(SAMPLE_RESUME)
    return row[0]


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/api/resume")
async def read_resume():
    raw = get_resume_text()
    try:
        return json.loads(raw)
    except Exception:
        return {"raw": raw}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    context = get_resume_text()
    try:
        reply = await ask_question(req.message, context)
    except Exception as e:
        logging.error("Error in /api/chat: %s", str(e))
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Chat backend error: {str(e)}")
    return {"reply": reply}


# Serve Frontend Static Files
if FRONTEND_PATH.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_PATH / "assets"), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # API requests should already be handled above
        # If it's not an API request, serve the index.html for SPA routing
        if full_path.startswith("api/"):
             raise HTTPException(status_code=404, detail="API route not found")
        
        file_path = FRONTEND_PATH / full_path
        if full_path != "" and file_path.exists():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_PATH / "index.html")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
