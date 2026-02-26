import os
import httpx
import json
import logging
from typing import List, Any
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

    if not isinstance(data, dict):
        data = {
            "personal_info": {"name": "Vrinda Jindal"},
            "education": [{"degree": "BCA (AI Specialization)", "institution": "Bennett University", "score": "8.82"}],
            "projects": [],
            "skills": {},
            "hobbies": ["Reading", "Traveling", "Exploring AI Trends"]
        }

    personal = data.get("personal_info", {})
    if not isinstance(personal, dict): personal = {}
    name = personal.get("name", "Vrinda Jindal")
    
    education_list = data.get("education", [{}])
    education_info = {}
    if isinstance(education_list, list) and education_list:
        first_edu = education_list[0]
        if isinstance(first_edu, dict):
            education_info = first_edu
        
    edu_str = f"{education_info.get('degree', 'BCA (AI)')} student at {education_info.get('institution', 'Bennett University')}, {education_info.get('score', 'CGPA: 8.82')}"
    
    projects = data.get("projects", [])
    project_titles: List[str] = []
    if isinstance(projects, list):
        for p in projects:
            if isinstance(p, dict):
                p_title = p.get("title")
                if p_title:
                    project_titles.append(str(p_title))
    
    skills_dict = data.get("skills", {})
    all_skills: List[str] = []
    if isinstance(skills_dict, dict):
        for category_items in skills_dict.values():
            if isinstance(category_items, list):
                for item in category_items:
                    if isinstance(item, str):
                        all_skills.append(item)

    # 1. INSTANT PROFESSIONAL RESPONSES (Rule-Based)
    
    # Projects (PRIORITY)
    project_keywords = ["project", "build", "work", "portfolio", "titanic", "expert", "analyzer", "animal", "classifier", "fraud", "buddy", "health", "calculator", "restaurant", "make", "create", "done", "detail", "experience"]
    if any(k in q for k in project_keywords):
        # Check for specific project questions first
        matching_project = None
        for p in projects:
            if isinstance(p, dict):
                title = str(p.get("title", "")).lower()
                if any(word in q for word in title.split() if len(word) > 2):
                    matching_project = p
                    break
        
        if matching_project and isinstance(matching_project, dict):
            p_title = matching_project.get('title', 'Project')
            p_year = matching_project.get('year', '2025')
            p_desc = matching_project.get('description', '')
            p_tech = ", ".join(matching_project.get("tech_stack", []))
            p_github = matching_project.get('github', '#')
            p_demo = matching_project.get('demo', '#')
            return (
                f"### **{p_title}** ({p_year})\n\n"
                f"{p_desc}\n\n"
                f"**🛠️ Tech Stack:** {p_tech}\n\n"
                f"🔗 [GitHub]({p_github}) | 🌐 [Live Demo]({p_demo})"
            )

        # General project list
        p_items: List[str] = []
        if isinstance(projects, list):
            for i in range(len(projects)):
                p = projects[i]
                if isinstance(p, dict):
                    title = p.get('title', 'Unknown Project')
                    p_year = p.get('year', '2024')
                    tech_list = p.get('tech_stack', [])
                    first_tech = tech_list[0] if tech_list and isinstance(tech_list, list) else "AI/Web"
                    desc = p.get('description', '')
                    p_items.append(f"▸ **{title}** ({p_year}) [{first_tech}]: {desc}")
        
        p_list = "\n".join(p_items)
        project_count = len(projects)
        return (
            f"**Vrinda Jindal** has spearheaded **{project_count} technical projects**, specializing in AI/ML and Production systems:\n\n"
            f"{p_list}\n\n"
            f"Ask for 'details on [project name]' for the full tech stack!"
        )

    # Career Interests & Hiring
    if any(k in q for k in ["seeking", "opportunity", "opening", "career", "job", "internship", "role", "hire", "value", "interest"]):
        return (
            f"Vrinda Jindal is a highly motivated **AI & Software Developer** (BCA AI student). "
            f"She is currently seeking **AI/ML or Software Developer Internships** for 2026 where she can bring immediate value."
        )

    # Education & Achievements
    if any(k in q for k in ["edu", "cgpa", "university", "college", "school", "grade", "study", "dean", "award", "list"]):
        edu_entries = data.get("education", [])
        if isinstance(edu_entries, list):
            edu_details = []
            for e in edu_entries:
                if isinstance(e, dict):
                    edu_details.append(f"▸ **{e.get('degree')}** from {e.get('institution')} ({e.get('period')}) - **{e.get('score')}**")
            edu_str_full = "\n".join(edu_details)
            return (
                f"Vrinda Jindal's academic excellence is reflected in her background:\n\n{edu_str_full}\n\n"
                f"She maintains a strong **8.82 CGPA** at Bennett University."
            )

    # Skills & Tech Stack
    if any(k in q for k in ["skill", "tech", "stack", "know", "language", "python", "java", "c++", "ml", "ai", "deep learning", "dl", "nlp", "vision", "dsa", "web"]):
        skills_subset = [all_skills[i] for i in range(min(12, len(all_skills)))]
        skills_str = ", ".join(skills_subset) + ("..." if len(all_skills) > 12 else "")
        return f"Vrinda Jindal possesses strong foundations in: **{skills_str}**. She is proficient in bridging the gap between AI research and production-ready code."

    # Leadership & Positions
    if any(k in q for k in ["leader", "role", "responsibility", "br", "batch", "representative", "team"]):
        responsibilities = data.get("positions_of_responsibility", [])
        resp_str = "\n".join([f"▸ **{r}**" for r in responsibilities]) if responsibilities else "leading various technical teams."
        return (
            f"{name} demonstrates exceptional leadership through her roles as:\n\n"
            f"{resp_str}\n\n"
            f"She focuses on delivery, collaboration, and steering teams through high-pressure development projects."
        )

    # Hobbies & Interests (FORCED)
    if any(k in q for k in ["hobby", "hobbies", "interest", "fun", "outside", "do for fun"]):
        raw_hobbies = data.get("hobbies", [])
        hobbies_list = [str(h) for h in raw_hobbies] if isinstance(raw_hobbies, list) else []
        h_str = ", ".join(hobbies_list) if hobbies_list else "Exploring AI trends, Reading, and Traveling."
        return f"Beyond coding, Vrinda Jindal is passionate about: **{h_str}**. She believes in continuous learning!"

    # 2. AI FALLBACK (OpenRouter) - For any complex HR questions
    if not OPENROUTER_API_KEY:
        return f"{name} is a dedicated BCA AI student with an 8.82 CGPA and a strong portfolio in AI/ML. She is available for 2026 internships."

    h_context = ", ".join([str(h) for h in data.get("hobbies", [])]) if isinstance(data.get("hobbies"), list) else "AI trends"
    prompt = f"""
    You are the AI Recruiter/Assistant for {name}. 
    A recruiter or HR professional is asking about her. 
    
    YOUR MISSION: 
    - Be extremely positive, professional, and highlight her strengths.
    - Focus on her BCA (AI Specialization) at Bennett University and her 8.82 academic CGPA.
    - Provide DETAILED and FACTUAL answers using the context provided.
    - If asked for projects, provide summaries for all {len(projects)} projects (ensure the count matches the data).
    - If asked for education, list all degrees and scores (BCA, XII, X).
    - If asked for hobbies, mention {h_context}.
    - Ensure you mention she is seeking internships for 2026.
    
    Resume Context: 
    {resume_context}
    
    Question: {question}
    
    Rules:
    - Use Markdown for bolding and lists (use '▸' for bullets).
    - Keep it concise but information-rich (max 3-4 sentences).
    - Speak as her professional representative.
    - Version: [v2.2]
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

