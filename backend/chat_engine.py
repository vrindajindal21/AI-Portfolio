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
    
    # --- DYNAMIC DATA PARSING ---
    try:
        data = json.loads(resume_context)
    except Exception:
        # Fallback to a basic structure if parsing fails
        data = {
            "personal_info": {"name": "Vrinda Jindal"},
            "education": [{"degree": "BCA (AI Specialization)", "institution": "Bennett University", "score": "8.82"}],
            "projects": [],
            "skills": {}
        }

    personal = data.get("personal_info", {})
    name = personal.get("name", "Vrinda Jindal")
    education_list = data.get("education", [{}])
    education_info = education_list[0] if isinstance(education_list, list) and education_list else {}
    if not isinstance(education_info, dict):
        education_info = {}
        
    edu_str = f"{education_info.get('degree', 'BCA (AI)')} student at {education_info.get('institution', 'Bennett University')}, {education_info.get('score', 'CGPA: 8.82')}"
    
    projects = data.get("projects", [])
    project_titles = [str(p.get("title")) for p in projects if p.get("title")]
    
    skills_dict = data.get("skills", {})
    all_skills: list[str] = []
    if isinstance(skills_dict, dict):
        for category_items in skills_dict.values():
            if isinstance(category_items, list):
                for item in category_items:
                    if isinstance(item, str):
                        all_skills.append(item)

    # 1. INSTANT PROFESSIONAL RESPONSES (Rule-Based)
    
    # Career Interests & Hiring
    if any(k in q for k in ["seeking", "opportunity", "opening", "career", "job", "internship", "role", "hire", "value", "interest"]):
        return (
            f"{name} is a highly motivated **AI & Software Developer** and a **BCA (AI Specialization)** student. "
            f"She translates complex AI/ML concepts into practical project implementation. "
            f"Currently, she is actively seeking **AI/ML, Python Developer, or Software Developer Internships** for 2026 where she can bring immediate value to innovative teams."
        )

    # Education & Achievements
    if any(k in q for k in ["edu", "cgpa", "university", "college", "school", "grade", "study", "dean", "award", "list"]):
        return (
            f"{name} is pursuing her **{edu_str}**. "
            f"She is a top-performing student with an impressive **8.82 CGPA** and is dedicated to academic and technical excellence."
        )

    # Skills & Tech Stack
    if any(k in q for k in ["skill", "tech", "stack", "know", "language", "python", "java", "c++", "ml", "ai", "deep learning", "dl", "nlp", "vision", "dsa", "web"]):
        skills_str = ", ".join(all_skills[:12]) + ("..." if len(all_skills) > 12 else "")
        return f"{name} possesses strong foundations in: **{skills_str}**. She is proficient in bridging the gap between AI research and production-ready code."

    # Projects
    if any(k in q for k in ["project", "build", "work", "analyzer", "wild animal", "animal", "human", "classifier", "fraud", "buddy", "health", "booking", "titanic", "expert"]):
        p_list = "\n- ".join(project_titles)
        return (
            f"{name} has spearheaded {len(projects)} technical projects, including:\n\n"
            f"- {p_list}\n\n"
            f"Her work spans across Real-time systems, Computer Vision, and NLP solutions."
        )

    # Leadership
    if any(k in q for k in ["leader", "role", "responsibility", "br", "batch", "representative", "team"]):
        responsibilities = data.get("positions_of_responsibility", [])
        resp_str = "\n- ".join([f"**{r}**" for r in responsibilities]) if responsibilities else "leading various technical teams."
        return (
            f"{name} demonstrates exceptional leadership through her roles as:\n\n"
            f"{resp_str}\n\n"
            f"She focuses on delivery, collaboration, and steering teams through high-pressure development projects."
        )

    # 2. AI FALLBACK (OpenRouter) - For any complex HR questions
    if not OPENROUTER_API_KEY:
        return f"{name} is a dedicated BCA AI student with an 8.82 CGPA and a strong portfolio in AI/ML. She is available for 2026 internships."

    prompt = f"""
    You are the AI Recruiter/Assistant for {name}. 
    A recruiter or HR professional is asking about her. 
    
    YOUR MISSION: 
    - Be extremely positive, professional, and highlight her strengths.
    - Focus on her BCA (AI Specialization) and her strong academic performance.
    - Use the provided context to answer specifically based on her latest resume data.
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
         
    return f"{name} is a **BCA AI student** at Bennett University with an **8.82 CGPA**. She is currently seeking software and AI/ML internships for 2026."

