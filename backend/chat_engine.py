import os
import httpx
import json
import logging
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.0-flash-exp:free")

async def ask_question(question: str, resume_context: str) -> str:
    """
    Vrinda Jindal's AI Portfolio Assistant.
    Professionally represents Vrinda (BCA AI student) to recruiters and HR.
    """
    q = question.lower().strip()
    
    # --- VRINDA'S FULL PROFESSIONAL PROFILE ---
    profile = {
        "name": "Vrinda Jindal",
        "education": "BCA (AI Specialization) student at Bennett University (2023–2026), CGPA: 8.82",
        "foundations": ["Practical AI/ML Implementation", "Software Development", "Python Ecosystem", "Full-stack Web Development", "Data Analytics"],
        "projects": [
            "Resume Analyzer (Practical NLP for Recruitment)",
            "Wild Animal Detection (Real-time Vision using YOLO)",
            "Human vs Animal Image Classifier (Multi-architecture CNN)",
            "Fraud Detection (ML Classification System)",
            "Daily Buddy (Full-stack Productivity Solution)",
            "Health Tracker (Personalized Monitoring Dashboards)",
            "Scientific Calculator (Python GUI Engineering)",
            "Restaurant Website (Modern UI/UX Implementation)"
        ],
        "certifications": ["IBM", "UC San Diego", "Infosys", "Coursera"],
        "leadership": [
            "Batch Representative (BR) at Bennett University (Elected Leader)",
            "Team Leader for multiple project development groups"
        ],
        "interests": ["AI/ML Internship", "Python Developer Internship", "Software Developer Intern"],
        "hobbies": ["Reading", "Traveling", "Exploring AI Trends", "Music"],
        "awards": ["Dean's List Award for Academic Excellence"]
    }

    # 1. INSTANT PROFESSIONAL RESPONSES (Rule-Based)
    
    # Career Interests & Hiring
    if any(k in q for k in ["seeking", "opportunity", "opening", "career", "job", "internship", "role", "hire", "value", "interest"]):
        return (
            f"Vrinda is a highly motivated **AI & Software Developer** and a **BCA (AI Specialization)** student. "
            f"She translates complex AI/ML concepts into practical project implementation. "
            f"Currently, she is actively seeking **AI/ML, Python Developer, or Software Developer Internships** for 2026 where she can bring immediate value to innovative teams."
        )

    # Education & Achievements
    if any(k in q for k in ["edu", "cgpa", "university", "college", "school", "grade", "study", "dean", "award", "list"]):
        return (
            f"Vrinda is pursuing her **{profile['education']}**. "
            f"She is a top-performing student with an impressive **8.82 CGPA** and has been recognized on the **Dean's List Award** for her academic excellence."
        )

    # Skills & Tech Stack
    if any(k in q for k in ["skill", "tech", "stack", "know", "language", "python", "java", "c++", "ml", "ai", "deep learning", "dl", "nlp", "vision", "dsa", "web"]):
        return f"Vrinda possesses advanced foundations in: **{', '.join(profile['foundations'])}**. She is proficient in bridging the gap between AI research and production-ready code."

    # Projects
    if any(k in q for k in ["project", "build", "work", "analyzer", "wild animal", "animal", "human", "classifier", "fraud", "buddy", "health"]):
        p_list = "\n- ".join(profile['projects'])
        return f"Vrinda has spearheaded over 8 technical projects, including:\n- {p_list}\nHer work focuses on real-time detection and NLP solutions."

    # Leadership
    if any(k in q for k in ["leader", "role", "responsibility", "br", "batch", "representative", "team"]):
        return (
            "Vrinda demonstrates exceptional leadership through her roles as:\n\n"
            "1. **Batch Representative (BR)**: An elected position at Bennett University where she manages peer-faculty coordination.\n"
            "2. **Team Leader**: Successfully steering development teams through high-pressure academic projects with a focus on delivery and collaboration."
        )

    # 2. AI FALLBACK (OpenRouter) - For any complex HR questions
    if not OPENROUTER_API_KEY:
        return "Vrinda is a dedicated BCA AI student with an 8.82 CGPA and a strong portfolio in AI/ML. She is available for 2026 internships."

    prompt = f"""
    You are the AI Recruiter/Assistant for Vrinda Jindal. 
    A recruiter or HR professional is asking about her. 
    
    YOUR MISSION: 
    - Be extremely positive, professional, and highlight her strengths.
    - Focus on her BCA (AI Specialization) and her strong 8.82 CGPA.
    - Use the provided context to answer specifically.
    - If you don't know something, suggest they check her LinkedIn (in the footer) or email her.
    
    Resume Context: 
    {resume_context}
    
    Question: {question}
    
    Rules:
    - Use Markdown for bolding and lists.
    - Keep it concise (max 2-3 sentences).
    - Avoid generic AI talk. Speak as her professional representative.
    """

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://vrinda-portfolio.com",
                },
                json={
                    "model": OPENROUTER_MODEL,
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if "choices" in data and len(data["choices"]) > 0:
                    return data["choices"][0]["message"]["content"]
            
            logging.error(f"OpenRouter Error: {response.status_code} - {response.text}")

    except Exception as e:
        logging.error(f"AI Chat Exception: {e}")
         
    return f"Vrinda is a **BCA AI student** at Bennett University with an **8.82 CGPA**. She is currently seeking software and AI/ML internships for 2026."

