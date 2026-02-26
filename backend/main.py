from fastapi import FastAPI, HTTPException
import logging
import traceback
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
from pathlib import Path
import asyncio

from resume_data import SAMPLE_RESUME
from chat_engine import ask_question

DB_PATH = Path(__file__).parent / "data.db"

app = FastAPI()
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
    # Bypass DB cache to ensure latest data is always used
    return json.dumps(SAMPLE_RESUME)


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
        # Log full traceback for debugging
        logging.error("Error in /api/chat: %s", str(e))
        logging.error(traceback.format_exc())
        # Return a helpful error message to the client without leaking secrets
        raise HTTPException(status_code=500, detail=f"Chat backend error: {str(e)}")
    return {"reply": reply}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
