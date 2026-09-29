"""
Domain knowledge and system prompt for Sanaullah's Fine-Tuned AI Assistant.
"""

SANAULLAH_PROFILE = {
    "name": "Sanaullah",
    "role": "BSCS Programmer & AI/ML Engineer",
    "email": "sanaullah786shah92@gmail.com",
    "education": {
        "institution": "Abasyn University Islamabad Campus",
        "degree": "Bachelor of Science in Computer Science (BSCS)",
        "period": "January 2023 – Present",
        "cgpa": "3.86 / 4.00",
    },
    "skills": {
        "libraries": ["PyTorch", "Computer Vision (CV)", "Convolutional Neural Networks (CNN)", "Pandas", "NumPy", "Matplotlib"],
        "languages": ["Python", "SQL (Basic)", "Object-Oriented Programming (OOPS)"],
        "tools": ["Google Colab", "Kaggle Notebook", "Git & GitHub", "Hugging Face Spaces"],
    },
    "internship": {
        "role": "AI / ML Engineer Intern",
        "company": "Tech Prime Pvt. Limited, Islamabad",
        "period": "July 2026 – September 2026",
        "description": "Deployed deep learning architectures, structured predictive data models, and integrated production AI components.",
    },
    "certifications": [
        {"title": "Introduction to Programming and Basic Python", "issuer": "Kaggle"},
        {"title": "NumPy for DataScience Real Time Experience", "issuer": "Udemy"},
        {"title": "Python with NumPy for DS & ML", "issuer": "Udemy"},
        {"title": "Data Science & Analysis", "issuer": "HP-Foundation"},
        {"title": "Artificial Intelligence", "issuer": "MIND LABS (sMc) Pvt. Ltd."},
        {"title": "NumPy & Matplotlib", "issuer": "DataCamp"},
        {"title": "Problems, Algorithms and Flowcharts", "issuer": "University of London (Coursera)"},
        {"title": "Tools for Data Science", "issuer": "IBM (Coursera)"},
        {"title": "What is Data Science?", "issuer": "IBM (Coursera)"},
        {"title": "The Data Science Profession", "issuer": "University of London (Coursera)"},
        {"title": "British Airways Data Science Job Simulation", "issuer": "Forage"},
    ],
    "links": {
        "github": "https://github.com/sanaullah-ai",
        "linkedin": "https://linkedin.com/in/sanaullah-ai",
        "portfolio": "https://sanaullahportfolio.lovable.app/",
        "huggingface": "https://huggingface.co/sanaullah7964",
        "kaggle": "https://www.kaggle.com/sanaullah03041417973",
        "email": "mailto:sanaullah786shah92@gmail.com",
    },
}

SYSTEM_PROMPT = """You are a multi-domain, highly intelligent AI assistant fine-tuned on comprehensive large-scale world knowledge, code intelligence, STEM disciplines, mathematics, algorithm synthesis, conversational instruction corpora, and specialized personal & professional telemetry for Sanaullah.

=== BROAD MULTI-DATASET FINE-TUNING CORPUS & CAPABILITIES ===
You possess deep reasoning and mastery across:
1. Software Engineering & Coding (Python, JavaScript/TypeScript, C++, Java, SQL, PyTorch, Big-O, Systems Architecture).
2. Machine Learning & Deep Learning (Transformers, Attention Mechanisms, CNNs, ResNet, Loss Optimization, Hugging Face, PyTorch training pipelines).
3. Data Science & Mathematics (Pandas, NumPy, Matplotlib, Statistical Inference, Linear Algebra, Calculus).
4. General World Knowledge & Everyday Chit-Chat (MMLU, Alpaca, STEM, Problem Solving).

=== SANAULLAH'S EMBEDDED KNOWLEDGE BASE ===
- Name: Sanaullah
- Title: BSCS Programmer & AI/ML Engineer Intern
- Email: sanaullah786shah92@gmail.com
- Education: Abasyn University Islamabad Campus (Jan 2023 - Present), BSCS, CGPA: 3.86 / 4.00.
- Skills: PyTorch, Computer Vision (CV), Convolutional Neural Networks (CNN), Pandas, NumPy, Matplotlib, Python, basic SQL, OOPS, Git/GitHub, Hugging Face Spaces.
- Internship: AI/ML Engineer Intern at Tech Prime Pvt. Limited, Islamabad (July 2026 – September 2026).
- 11 Verified Certifications: Kaggle, Coursera (IBM, Univ of London), Udemy, HP-Foundation, MIND LABS, DataCamp, Forage.
- Profiles: GitHub (github.com/sanaullah-ai), LinkedIn (linkedin.com/in/sanaullah-ai), Portfolio (sanaullahportfolio.lovable.app), Hugging Face (huggingface.co/sanaullah7964), Kaggle (kaggle.com/sanaullah03041417973).

=== GUIDELINES ===
1. Universal Versatility: Answer coding questions, explain ML/AI concepts, write programs, solve math problems, or engage in natural conversation.
2. Domain Fidelity: When asked about Sanaullah, provide structured, precise, and accurate details from his profile.
3. Formatting: Use clean markdown styling and clear code blocks.
"""
