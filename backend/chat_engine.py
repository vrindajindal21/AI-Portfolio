import os
import logging
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")

async def ask_question(question: str, resume_context: str) -> str:
    """
    Vrinda Jindal's AI Portfolio Assistant.
    Uses OpenRouter for smart responses, with a local fallback for common questions.
    """
    question_lower = question.lower()
    
    # --- LOCAL FALLBACK LOGIC (Requires no API) ---
    if "hobby" in question_lower or "hobbies" in question_lower:
        return "Vrinda loves **reading**, **traveling**, and staying updated with the latest **AI trends**! 📚✈️"
    
    if "project" in question_lower:
        return "Vrinda has built several impressive projects including a **Resume Analyzer**, a **Wild Animal Detection System** (YOLO-based), and a **Daily Buddy App** for scheduling. Which one would you like to hear more about? 🚀"
        
    if "skill" in question_lower or "tech" in question_lower:
        return "Vrinda is proficient in **C++, Python, Java, and SQL**. Her AI toolkit includes **Machine Learning, Deep Learning, and NLP** using frameworks like TensorFlow and Scikit-learn. 💻"

    if "intern" in question_lower or "available" in question_lower or "hiring" in question_lower:
        return "Vrinda is an ambitious BCA (AI Specialization) student from Bennett University, graduating in 2026. She is **actively looking for internships** and opportunities to contribute to AI/Software Engineering teams! 🤝"

    # --- AI BRAIN LOGIC (Requires API Key) ---
    if not OPENROUTER_API_KEY or OPENROUTER_API_KEY == "":
        return "I'm Vrinda's Assistant! Currently, I'm in **offline mode**, but I can tell you that Vrinda is a skilled AI developer specializing in Machine Learning and Python. Feel free to ask about her **projects** or **skills**!"

    prompt = f"""
    You are the personal AI Assistant for Vrinda Jindal (BCA AI student at Bennett University).
    Answer based on this context: {resume_context}
    Keep it professional, concise, and enthusiastic. Use Markdown formatting.
    USER QUESTION: {question}
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vrinda-portfolio.vercel.app",
                    "X-Title": "Vrinda AI Portfolio",
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=15.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return data['choices'][0]['message']['content']
            
            # If API fails (e.g., 401, 429), return a friendly generic message instead of an error
            return "Vrinda is a dedicated AI student with a 8.82 CGPA, skilled in Python and Deep Learning. She has built projects like a YOLO Animal Detection system and a Resume Analyzer using NLP. You can reach out to her at e23bcau0076@bennett.edu.in!"

    except Exception:
        return "I'm currently operating in basic mode. Vrinda is a talented developer with expertise in **Python, Machine Learning, and React Native**. She's built several AI-driven projects and is ready for new challenges! 🌟"
