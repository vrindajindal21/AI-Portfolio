import os
import logging
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")

async def ask_question(question: str, resume_context: str) -> str:
    """
    Vrinda Jindal's AI Portfolio Assistant using OpenRouter.
    Provides intelligent responses based on the provided resume context.
    """
    if not OPENROUTER_API_KEY:
        return "Assistant is in offline mode. Please configure OPENROUTER_API_KEY."

    prompt = f"""
    You are the personal AI Assistant for Vrinda Jindal. 
    Your goal is to represent Vrinda professionally to recruiters and HR professionals.
    
    CRITICAL INFO ABOUT VRINDA (RESUME CONTEXT):
    {resume_context}
    
    GUIDELINES:
    1. Answer questions accurately based ONLY on the provided context.
    2. If you don't know the answer, say you're not sure but offer to connect them with Vrinda.
    3. Maintain a professional, helpful, and enthusiastic tone.
    4. Format your responses using Markdown (bolding, lists) for readability.
    5. Be concise but informative.
    6. Always frame Vrinda as a top-tier candidate for AI/ML and Software Engineering roles.

    USER QUESTION: {question}
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vrinda-portfolio.vercel.app", # Placeholder
                    "X-Title": "Vrinda AI Portfolio",
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": [{"role": "user", "content": prompt}],
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                data = response.json()
                return data['choices'][0]['message']['content']
            else:
                logging.error(f"OpenRouter Error: {response.status_code} - {response.text}")
                return "I'm having a bit of trouble connecting to my AI brain right now. Please try again in a moment!"

    except Exception as e:
        logging.error(f"Chat Engine Exception: {str(e)}")
        return "My backend is undergoing a quick update. Let's try that again in a second!"
    
    return "I'm here to help, but I seem to have lost my train of thought. Could you ask that again?"
