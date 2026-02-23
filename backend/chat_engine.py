import os
import json
import logging
from resume_data import SAMPLE_RESUME

async def ask_question(question: str, resume_context: str) -> str:
    """
    Vrinda Jindal's AI Portfolio Assistant.
    Professionally represents Vrinda to recruiters and HR professionals.
    """
    q = question.lower().strip()
    
    # --- VRINDA'S PROFESSIONAL PROFILE DATA ---
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
            "Batch Representative (BR) at Bennett University",
            "Team Leader for multiple project groups"
        ],
        "interests": ["AI/ML Internship", "Python Developer Internship", "Software Developer Intern"],
        "hobbies": ["Reading", "Traveling", "Exploring AI Trends"],
        "awards": ["Dean's List Award for Academic Excellence"]
    }

    # --- PROFESSIONAL RESPONSE LOGIC ---

    # Fallback Message
    fallback = "I am Vrinda's AI Portfolio Assistant. I can tell you about her AI projects, technical foundations, leadership roles, and readiness for internships."

    # 1. Career Interests (Focused Mapping per Audit)
    if any(k in q for k in ["interest", "seeking", "looking for", "opportunity", "opening", "career", "job", "internship", "role", "hire", "value"]):
        return (
            f"Vrinda is a dedicated **AI & Software Developer** and a **BCA (AI Specialization)** student at Bennett University. "
            f"She applies AI/ML techniques to solve real-world problems through practical project implementation. "
            f"Currently, she is specifically seeking **AI/ML, Python Developer, or Software Developer Internships** for 2026 where she can contribute to high-growth teams."
        )

    # 2. Education, CGPA & Awards
    if any(k in q for k in ["edu", "cgpa", "university", "college", "school", "grade", "study", "dean", "award", "list"]):
        return (
            f"Vrinda is a **{profile['education']}**. "
            f"She maintains a high academic standard with an **8.82 CGPA** and has been honored with the **Dean's List Award** for her outstanding performance."
        )

    # 3. Skills & Foundations
    if any(k in q for k in ["skill", "tech", "stack", "know", "language", "python", "java", "c++", "ml", "ai", "deep learning", "dl", "nlp", "vision", "dsa", "web"]):
        return f"Vrinda has strong foundations in: **{', '.join(profile['foundations'])}**. Her technical expertise spans both AI research and practical software development."

    # 4. Projects
    if any(k in q for k in ["project", "build", "work", "analyzer", "wild animal", "animal", "human", "classifier", "daily buddy", "buddy", "health", "calculator", "fraud", "restaurant"]):
        p_list = "\n- ".join(profile['projects'])
        return f"Vrinda has successfully completed several high-impact projects, including:\n- {p_list}"

    # 5. Certifications
    if any(k in q for k in ["cert", "course", "certified", "ibm", "infosys", "coursera", "sd", "san diego"]):
        return f"Vrinda has completed professional certifications from global leaders including: **{', '.join(profile['certifications'])}**."

    # 6. Leadership Roles
    if any(k in q for k in ["leader", "role", "responsibility", "br", "batch", "representative", "team"]):
        return (
            "Vrinda has a proven track record of leadership:\n\n"
            "1. **Batch Representative (BR)**: Elected by her peers at Bennett University to represent the batch and coordinate with faculty.\n"
            "2. **Team Leader**: Successfully led multiple development teams in academic projects, ensuring project delivery and efficient collaboration."
        )

    # 7. Hobbies
    if any(k in q for k in ["hobby", "hobbies", "interest", "free time", "enjoy", "reading", "traveling", "ai trends"]):
        return f"Beyond coding, Vrinda is passionate about **{', '.join(profile['hobbies'])}**. She loves staying updated with the rapid evolution of technology and exploring new cultures through travel."

    # 8. Professional Introduction / Catch-all
    if any(k in q for k in ["who", "tell me about", "profile", "summary", "about", "introduction", "hired", "hire", "achieve", "success"]):
        return (
            f"Vrinda Jindal is an AI-specialized BCA student at Bennett University with a CGPA of 8.82. "
            f"She is a **Dean's List awardee** and a dedicated professional with expertise in **AI/ML, Data Structures, and Full-stack Development**. "
            f"With her leadership experience as a **Batch Representative** and a portfolio of 8+ projects, she is an exceptional candidate for 2026 internships."
        )

    # --- STRICT PROFESSIONAL FALLBACK ---
    return fallback
