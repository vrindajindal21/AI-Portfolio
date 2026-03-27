from fastapi import FastAPI, HTTPException, UploadFile, File
import logging
import traceback
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
from pathlib import Path
import asyncio
import io
from pypdf import PdfReader

from resume_data import SAMPLE_RESUME
from chat_engine import ask_question, OPENROUTER_API_KEY, OPENROUTER_MODEL
import httpx

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
    # Check if we already have data
    c.execute("SELECT COUNT(*) FROM resume")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO resume (id, content) VALUES (1, ?)", (json.dumps(SAMPLE_RESUME),))
    conn.commit()
    conn.close()


def get_resume_text() -> str:
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT content FROM resume WHERE id = 1")
    row = c.fetchone()
    conn.close()
    if row:
        return row[0]
    return json.dumps(SAMPLE_RESUME)


def save_resume_data(data: dict):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE resume SET content = ? WHERE id = 1", (json.dumps(data),))
    conn.commit()
    conn.close()


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


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    logging.info(f"Received upload request for file: {file.filename}")
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        contents = await file.read()
        logging.info(f"Read {len(contents)} bytes from file")
        f = io.BytesIO(contents)
        reader = PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        
        logging.info(f"Extracted {len(text)} characters of text")
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # Use LLM to parse text into JSON
        prompt = f"""
        Extract professional information from the following resume text and format it into a JSON object.
        The JSON MUST follow this structure exactly:
        {{
            "personal_info": {{
                "name": "...",
                "email": "...",
                "phone": "...",
                "linkedin": "...",
                "github": "..."
            }},
            "profile": "...",
            "education": [
                {{
                    "degree": "...",
                    "institution": "...",
                    "period": "...",
                    "score": "..."
                }}
            ],
            "projects": [
                {{
                    "title": "...",
                    "tech_stack": ["...", "..."],
                    "year": "...",
                    "description": "...",
                    "github": "...",
                    "demo": "..."
                }}
            ],
            "certifications": ["...", "..."],
            "skills": {{
                "Languages": ["...", "..."],
                "Frameworks": ["...", "..."],
                "AI": ["...", "..."],
                "Technical Skills": ["...", "..."],
                "Soft Skills": ["...", "..."]
            }},
            "hobbies": ["...", "..."],
            "positions_of_responsibility": ["...", "..."]
        }}

        Resume Text:
        {text}
        
        Return ONLY valid JSON.
        """

        logging.info(f"Using model: {OPENROUTER_MODEL}")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vrinda-portfolio.com",
                    "X-Title": "Vrinda AI Portfolio",
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            
            logging.info(f"OpenRouter response status: {response.status_code}")
            if response.status_code != 200:
                logging.error(f"OpenRouter Error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail=f"AI Parsing Error: {response.status_code}")
            
            data = response.json()
            logging.info("Successfully received LLM response")
            llm_reply = data["choices"][0]["message"]["content"]
            # Clean up potential markdown formatting
            if llm_reply.startswith("```json"):
                llm_reply = llm_reply.split("```json")[1].split("```")[0].strip()
            elif llm_reply.startswith("```"):
                llm_reply = llm_reply.split("```")[1].split("```")[0].strip()
            
            parsed_data = json.loads(llm_reply)
            save_resume_data(parsed_data)
            return {"message": "Resume uploaded and parsed successfully", "data": parsed_data}

    except Exception as e:
        logging.error(f"Upload error: {e}")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
