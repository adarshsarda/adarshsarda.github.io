from pathlib import Path
from typing import Iterable

import pypdfium2 as pdfium
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CV_DIR = PUBLIC / "cv"
IMAGE_DIR = PUBLIC / "images" / "cv"

PAGE_W, PAGE_H = A4
MARGIN = 48
INK = HexColor("#202524")
MUTED = HexColor("#5A6561")
ACCENT = HexColor("#69404A")   # website --signal
MOSS = HexColor("#354B43")     # website --moss (section headings)
RULE = HexColor("#BCC4C0")
PAPER = HexColor("#F7F5EF")

BODY = "Helvetica"
BOLD = "Helvetica-Bold"


ENGLISH = {
    "filename": "adarsh-sarda-cv-english.pdf",
    "preview": "english-preview.png",
    "name": "Adarsh Sarda",
    "tagline": "AI SECURITY RESEARCHER  /  M.SC. CANDIDATE",
    "contact": [
        "Amberg, Germany",
        "+49 1551 0438756  ·  adarshsarda29@gmail.com",
        "adarshsarda.github.io  ·  linkedin.com/in/adarshsarda",
        "Born 29 May 2000, India  ·  Available: Werkstudent, 20 h/week",
    ],
    "sections": {
        "profile": "About me",
        "education": "Education",
        "experience": "Experience",
        "work": "Selected work",
        "skills": "Skills",
        "interests": "Interests",
    },
    "profile": (
        "M.Sc. Artificial Intelligence student at OTH Amberg-Weiden focused on AI security, "
        "LLM red teaming, and adversarial machine learning. I care about rigorous, honestly "
        "reported evaluation — denominators, controls, and confidence intervals over adjectives."
    ),
    "education": [
        {
            "date": "03/2025\npresent",
            "title": "M.Sc. Artificial Intelligence for Industrial Applications",
            "meta": "OTH Amberg-Weiden, Bavaria  ·  Grade 2.0",
        },
        {
            "date": "08/2019\n06/2023",
            "title": "B.Tech in Information Technology",
            "meta": "Institute of Engineering and Management, Kolkata  ·  Grade 1.7 (8.6/10)",
        },
    ],
    "experience": [
        {
            "date": "01/2023\n10/2024",
            "title": "Research Analyst — GreyB Research, Chandigarh, India",
            "bullets": [
                "Built an ML system for automated patent technology classification over large corpora.",
                "Ran infringement, prior-art, and tech-scouting analysis across AI/ML, blockchain, 3GPP, and IETF for international clients.",
            ],
        }
    ],
    "work": [
        {
            "title": "Order-Dependent Semantic Backdoors (ODSB) — multi-turn LLMs",
            "meta": "100% in-distribution ASR (n=140), 0% false-trigger rate, 0.887 on held-out paraphrases; Qwen2.5-3B + LoRA, pre-registered. Code + report public.",
        },
        {
            "title": "Red Teaming AI Systems: A Practitioner's Guide",
            "meta": "Six-phase methodology for chatbots, RAG, and agents, mapped to NIST AI RMF, OWASP, and MITRE ATLAS.",
        },
        {
            "title": "Multimodal Emotion Recognition — Springer book chapter (2023)",
            "meta": "Co-authored an LSTM speech + text model reaching ~86% accuracy.",
        },
    ],
    "skills": [
        ("Tools", "Python, PyTorch, scikit-learn, Vertex AI (GCP)"),
        ("AI", "LLMs & NLP, Adversarial ML, Explainable AI, Threat Modelling, LLM Red-Teaming, Prompt Engineering"),
        ("Languages", "English C1, German B1, Hindi (native)"),
    ],
    "interests": "Music (voice, synthesizer, ukulele, guitar)  ·  Cooking (Asian cuisine, especially Indian)",
    "updated": "Updated June 2026",
    "site": "adarshsarda.github.io",
}


GERMAN = {
    "filename": "adarsh-sarda-lebenslauf-deutsch.pdf",
    "preview": "german-preview.png",
    "name": "Adarsh Sarda",
    "tagline": "KI-SICHERHEITSFORSCHER  /  M.SC.-STUDENT",
    "contact": [
        "Amberg, Deutschland",
        "+49 1551 0438756  ·  adarshsarda29@gmail.com",
        "adarshsarda.github.io  ·  linkedin.com/in/adarshsarda",
        "Geboren 29.05.2000 in Indien  ·  Verfügbar: Werkstudent, 20 Std./Woche",
    ],
    "sections": {
        "profile": "Über mich",
        "education": "Bildungsweg",
        "experience": "Berufserfahrung",
        "work": "Ausgewählte Arbeiten",
        "skills": "Kenntnisse",
        "interests": "Interessen",
    },
    "profile": (
        "M.Sc.-Student der Künstlichen Intelligenz an der OTH Amberg-Weiden mit Schwerpunkt "
        "KI-Sicherheit, Red-Teaming von LLMs und Adversarial Machine Learning. Mir ist eine "
        "belastbare, ehrlich berichtete Evaluierung wichtig — Nenner, Kontrollen und "
        "Konfidenzintervalle statt Adjektive."
    ),
    "education": [
        {
            "date": "03/2025\nheute",
            "title": "M.Sc. Künstliche Intelligenz für industrielle Anwendungen",
            "meta": "OTH Amberg-Weiden, Bayern  ·  Note 2,0",
        },
        {
            "date": "08/2019\n06/2023",
            "title": "B.Tech in Information Technology",
            "meta": "Institute of Engineering and Management, Kalkutta  ·  Note 1,7 (8,6/10)",
        },
    ],
    "experience": [
        {
            "date": "01/2023\n10/2024",
            "title": "Research Analyst — GreyB Research, Chandigarh, Indien",
            "bullets": [
                "Entwickelte ein ML-System zur automatisierten Technologieklassifikation umfangreicher Patentkorpora.",
                "Führte Infringement-, Prior-Art- und Tech-Scouting-Analysen in KI/ML, Blockchain, 3GPP und IETF für internationale Kunden durch.",
            ],
        }
    ],
    "work": [
        {
            "title": "Ordnungsabhängige semantische Backdoors (ODSB) — Multi-Turn-LLMs",
            "meta": "100% In-Distribution-ASR (n=140), 0% False-Trigger-Rate, 0,887 auf ungesehenen Paraphrasen; Qwen2.5-3B + LoRA, präregistriert. Code + Bericht öffentlich.",
        },
        {
            "title": "Red Teaming AI Systems: A Practitioner's Guide",
            "meta": "Sechsstufige Methodik für Chatbots, RAG und Agenten, abgebildet auf NIST AI RMF, OWASP und MITRE ATLAS.",
        },
        {
            "title": "Multimodale Emotionserkennung — Springer-Buchkapitel (2023)",
            "meta": "Co-Autor eines LSTM-Modells aus Sprache + Text mit ca. 86% Genauigkeit.",
        },
    ],
    "skills": [
        ("Tools", "Python, PyTorch, scikit-learn, Vertex AI (GCP)"),
        ("KI", "LLMs & NLP, Adversarial ML, Explainable AI, Threat Modelling, LLM-Red-Teaming, Prompt Engineering"),
        ("Sprachen", "Englisch C1, Deutsch B1, Hindi (Muttersprache)"),
    ],
    "interests": "Musik (Gesang, Synthesizer, Ukulele, Gitarre)  ·  Kochen (asiatische Küche, besonders indische)",
    "updated": "Aktualisiert im Juni 2026",
    "site": "adarshsarda.github.io",
}


def wrap_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    lines: list[str] = []
    for raw in text.split("\n"):
        words = raw.split()
        current = ""
        for word in words:
            candidate = f"{current} {word}".strip()
            if current and stringWidth(candidate, font, size) > max_width:
                lines.append(current)
                current = word
            else:
                current = candidate
        lines.append(current)
    return lines


def draw_wrapped(pdf, text, x, y, width, *, font=BODY, size=9.3, color=INK, leading=12.0) -> float:
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    for line in wrap_lines(text, font, size, width):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_heading(pdf, label, x, y, width) -> float:
    pdf.setFillColor(MOSS)
    pdf.setFont(BOLD, 12)
    pdf.drawString(x, y, label)
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.8)
    pdf.line(x, y - 6, x + width, y - 6)
    return y - 20


def draw_bullets(pdf, items: Iterable[str], x, y, width) -> float:
    for item in items:
        pdf.setStrokeColor(ACCENT)
        pdf.setLineWidth(1.1)
        pdf.line(x, y + 2.6, x + 5, y + 2.6)
        y = draw_wrapped(pdf, item, x + 10, y, width - 10, size=9, leading=11.6)
        y -= 3.5
    return y


DATE_W = 74


def draw_dated_entry(pdf, entry, x, y, width, *, spacing=9.0) -> float:
    tx = x + DATE_W
    tw = width - DATE_W
    if entry.get("date"):
        pdf.setFont(BOLD, 8.3)
        pdf.setFillColor(ACCENT)
        dy = y
        for line in entry["date"].split("\n"):
            pdf.drawString(x, dy, line)
            dy -= 10.5
    yy = draw_wrapped(pdf, entry["title"], tx, y, tw, font=BOLD, size=9.7, leading=11.8)
    if entry.get("meta"):
        yy = draw_wrapped(pdf, entry["meta"], tx, yy, tw, size=8.6, color=MUTED, leading=10.8)
    if entry.get("bullets"):
        yy = draw_bullets(pdf, entry["bullets"], tx, yy - 2, tw)
    return yy - spacing


def draw_work(pdf, entry, x, y, width, *, spacing=8.0) -> float:
    y = draw_wrapped(pdf, entry["title"], x, y, width, font=BOLD, size=9.7, leading=11.8)
    if entry.get("meta"):
        y = draw_wrapped(pdf, entry["meta"], x, y, width, size=8.9, color=MUTED, leading=11.2)
    return y - spacing


def draw_skills(pdf, groups, x, y, width) -> float:
    for label, value in groups:
        tag = f"{label}   "
        pdf.setFont(BOLD, 9)
        pdf.setFillColor(MOSS)
        pdf.drawString(x, y, label)
        offset = stringWidth(tag, BOLD, 9)
        y = draw_wrapped(pdf, value, x + offset, y, width - offset, size=9, leading=11.6)
        y -= 4.5
    return y


def create_pdf(content: dict) -> Path:
    output = CV_DIR / content["filename"]
    pdf = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    pdf.setTitle(f"{content['name']} — CV")
    pdf.setAuthor(content["name"])
    pdf.setSubject("Curriculum vitae")

    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    pdf.setFillColor(ACCENT)
    pdf.rect(0, PAGE_H - 6, PAGE_W, 6, fill=1, stroke=0)

    width = PAGE_W - 2 * MARGIN

    # Header: name + tagline (left), contact (right).
    pdf.setFillColor(INK)
    pdf.setFont(BOLD, 25)
    pdf.drawString(MARGIN, PAGE_H - 66, content["name"])
    pdf.setFillColor(ACCENT)
    pdf.setFont(BOLD, 8.6)
    pdf.drawString(MARGIN, PAGE_H - 82, content["tagline"])

    cy = PAGE_H - 50
    pdf.setFont(BODY, 8.4)
    pdf.setFillColor(MUTED)
    for line in content["contact"]:
        pdf.drawRightString(PAGE_W - MARGIN, cy, line)
        cy -= 11.2

    pdf.setStrokeColor(MOSS)
    pdf.setLineWidth(1)
    pdf.line(MARGIN, PAGE_H - 100, PAGE_W - MARGIN, PAGE_H - 100)

    y = PAGE_H - 122
    s = content["sections"]

    y = draw_heading(pdf, s["profile"], MARGIN, y, width)
    y = draw_wrapped(pdf, content["profile"], MARGIN, y, width, size=9.4, leading=12.4)

    y = draw_heading(pdf, s["education"], MARGIN, y - 12, width)
    for entry in content["education"]:
        y = draw_dated_entry(pdf, entry, MARGIN, y, width)

    y = draw_heading(pdf, s["experience"], MARGIN, y - 4, width)
    for entry in content["experience"]:
        y = draw_dated_entry(pdf, entry, MARGIN, y, width, spacing=10)

    y = draw_heading(pdf, s["work"], MARGIN, y - 4, width)
    for entry in content["work"]:
        y = draw_work(pdf, entry, MARGIN, y, width)

    y = draw_heading(pdf, s["skills"], MARGIN, y - 4, width)
    y = draw_skills(pdf, content["skills"], MARGIN, y, width)

    y = draw_heading(pdf, s["interests"], MARGIN, y - 6, width)
    y = draw_wrapped(pdf, content["interests"], MARGIN, y, width, size=9.2, leading=12)

    # Footer.
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.7)
    pdf.line(MARGIN, 44, PAGE_W - MARGIN, 44)
    pdf.setFont(BODY, 7.4)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, 31, content["updated"])
    pdf.drawRightString(PAGE_W - MARGIN, 31, content["site"])

    pdf.save()
    return output


def render_preview(pdf_path: Path, filename: str) -> None:
    document = pdfium.PdfDocument(str(pdf_path))
    page = document[0]
    image = page.render(scale=1.65).to_pil().convert("RGB")
    image.save(IMAGE_DIR / filename, optimize=True)


def main() -> None:
    CV_DIR.mkdir(parents=True, exist_ok=True)
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    for content in (ENGLISH, GERMAN):
        pdf_path = create_pdf(content)
        render_preview(pdf_path, content["preview"])
        print("wrote", pdf_path.name)


if __name__ == "__main__":
    main()
