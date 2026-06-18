from pathlib import Path
from typing import Iterable

import pypdfium2 as pdfium
from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CV_DIR = PUBLIC / "cv"
IMAGE_DIR = PUBLIC / "images" / "cv"
SOURCE_HEADSHOT = ROOT / "assets" / "cv" / "headshot-source.jpg"
HEADSHOT = IMAGE_DIR / "headshot.jpg"

PAGE_W, PAGE_H = A4
MARGIN = 42
INK = HexColor("#202524")
MUTED = HexColor("#5A6561")
ACCENT = HexColor("#69404A")
MOSS = HexColor("#354B43")
RULE = HexColor("#BCC4C0")
PAPER = HexColor("#F7F5EF")


ENGLISH = {
    "filename": "adarsh-sarda-cv-english.pdf",
    "preview": "english-preview.png",
    "title": "Adarsh Sarda",
    "tagline": "AI SECURITY RESEARCHER / M.SC. CANDIDATE",
    "contact": [
        "Amberg, Germany  |  +49 1551 0438756",
        "adarshsarda29@gmail.com  |  adarshsarda.github.io",
        "linkedin.com/in/adarshsarda  |  github.com/adarshsarda",
    ],
    "sections": {
        "profile": "PROFILE",
        "experience": "EXPERIENCE",
        "education": "EDUCATION",
        "research": "SELECTED WORK",
        "details": "DETAILS",
        "skills": "TECHNICAL SKILLS",
        "languages": "LANGUAGES",
        "interests": "INTERESTS",
    },
    "profile": (
        "M.Sc. Artificial Intelligence student at OTH Amberg-Weiden focused on AI "
        "security, LLM red teaming, adversarial machine learning, and rigorous "
        "evaluation of modern AI systems."
    ),
    "experience": [
        {
            "title": "Research Analyst",
            "date": "01/2023 - 10/2024",
            "meta": "GreyB Research, Chandigarh, India",
            "bullets": [
                "Built an ML system for automated patent technology classification over large patent corpora.",
                "Conducted infringement, prior-art, and technology-scouting analysis across AI/ML, blockchain, 3GPP, and IETF technologies for international clients.",
            ],
        }
    ],
    "education": [
        {
            "title": "M.Sc. Artificial Intelligence for Industrial Applications",
            "date": "03/2025 - present",
            "meta": "OTH Amberg-Weiden, Bavaria  |  Grade 2.0",
        },
        {
            "title": "B.Tech in Information Technology",
            "date": "08/2019 - 06/2023",
            "meta": "Institute of Engineering and Management, Kolkata  |  Grade 1.7 (8.6/10)",
        },
    ],
    "research": [
        {
            "title": "Order-dependent semantic backdoor for multi-turn LLMs",
            "meta": "Qwen2.5-3B, LoRA, pre-registered evaluation",
            "bullets": [
                "Achieved 100% in-distribution attack success (n=140), 0% false-trigger rate, and 0.887 attack success on held-out paraphrases.",
            ],
        },
        {
            "title": "Red Teaming AI Systems: A Practitioner's Guide",
            "meta": "Portfolio knowledge base, 2026",
            "bullets": [
                "Authored a six-phase methodology for testing chatbots, RAG pipelines, and agents, mapped to NIST AI RMF, OWASP, and MITRE ATLAS.",
            ],
        },
        {
            "title": "Where the Devil Hides",
            "meta": "AI Conference paper presentation, 2026",
            "bullets": [
                "Presented a CVPR 2025 study on passcode-controlled training-data backdoors in deepfake detectors.",
            ],
        },
        {
            "title": "Multimodal emotion recognition",
            "meta": "Springer book chapter, 2023",
            "bullets": [
                "Built a model with approximately 86% accuracy and co-authored a Springer publication in 2023.",
            ],
        },
    ],
    "details": [
        ("Location", "Amberg, Germany"),
        ("Born", "29 May 2000, India"),
        ("Availability", "Werkstudent, 20 hours/week, immediate start"),
    ],
    "skills": [
        "Python",
        "PyTorch",
        "scikit-learn",
        "Vertex AI (GCP)",
        "NLP and LLMs",
        "Adversarial ML",
        "Explainable AI",
        "Threat modelling",
        "LLM red teaming",
        "Prompt engineering",
    ],
    "languages": ["English C1", "German B1", "Hindi, native"],
    "interests": ["Music: voice, synthesizer, ukulele, guitar", "Cooking: Asian cuisine, especially Indian"],
    "updated": "Updated June 2026",
}


GERMAN = {
    "filename": "adarsh-sarda-lebenslauf-deutsch.pdf",
    "preview": "german-preview.png",
    "title": "Adarsh Sarda",
    "tagline": "KI-SICHERHEITSFORSCHER / M.SC.-STUDENT",
    "contact": [
        "Amberg, Deutschland  |  +49 1551 0438756",
        "adarshsarda29@gmail.com  |  adarshsarda.github.io",
        "linkedin.com/in/adarshsarda  |  github.com/adarshsarda",
    ],
    "sections": {
        "profile": "PROFIL",
        "experience": "BERUFSERFAHRUNG",
        "education": "BILDUNGSWEG",
        "research": "AUSGEWÄHLTE ARBEITEN",
        "details": "PERSÖNLICHE DATEN",
        "skills": "TECHNISCHE KENNTNISSE",
        "languages": "SPRACHEN",
        "interests": "INTERESSEN",
    },
    "profile": (
        "M.Sc.-Student der Künstlichen Intelligenz an der OTH Amberg-Weiden mit "
        "Schwerpunkt KI-Sicherheit, Red-Teaming von LLMs, Adversarial Machine "
        "Learning und belastbarer Evaluierung moderner KI-Systeme."
    ),
    "experience": [
        {
            "title": "Research Analyst",
            "date": "01/2023 - 10/2024",
            "meta": "GreyB Research, Chandigarh, Indien",
            "bullets": [
                "Entwickelte ein ML-System zur automatisierten Technologieklassifikation umfangreicher Patentkorpora.",
                "Führte Patent-Infringement-, Prior-Art- und Tech-Scouting-Analysen in KI/ML, Blockchain, 3GPP und IETF für internationale Kunden durch.",
            ],
        }
    ],
    "education": [
        {
            "title": "M.Sc. Künstliche Intelligenz für industrielle Anwendungen",
            "date": "03/2025 - heute",
            "meta": "OTH Amberg-Weiden, Bayern  |  Note 2,0",
        },
        {
            "title": "B.Tech in Information Technology",
            "date": "08/2019 - 06/2023",
            "meta": "Institute of Engineering and Management, Kalkutta  |  Note 1,7 (8,6/10)",
        },
    ],
    "research": [
        {
            "title": "Ordnungsabhängige semantische Backdoor für Multi-Turn-LLMs",
            "meta": "Qwen2.5-3B, LoRA, präregistrierte Evaluierung",
            "bullets": [
                "Erreichte 100% In-Distribution-ASR (n=140), 0% False-Trigger-Rate und 0,887 ASR auf ungesehenen Paraphrasen.",
            ],
        },
        {
            "title": "Red Teaming AI Systems: A Practitioner's Guide",
            "meta": "Portfolio-Wissensdatenbank, 2026",
            "bullets": [
                "Verfasste eine sechsstufige Methodik zum Testen von Chatbots, RAG-Pipelines und Agenten auf Basis von NIST AI RMF, OWASP und MITRE ATLAS.",
            ],
        },
        {
            "title": "Where the Devil Hides",
            "meta": "Paper-Präsentation auf einer KI-Konferenz, 2026",
            "bullets": [
                "Präsentierte eine CVPR-2025-Studie zu passwortgesteuerten Backdoors in Trainingsdaten für Deepfake-Detektoren.",
            ],
        },
        {
            "title": "Multimodale Emotionserkennung",
            "meta": "Springer-Buchkapitel, 2023",
            "bullets": [
                "Entwickelte ein Modell mit ca. 86% Genauigkeit und war Co-Autor einer Springer-Veröffentlichung aus dem Jahr 2023.",
            ],
        },
    ],
    "details": [
        ("Wohnort", "Amberg, Deutschland"),
        ("Geboren", "29.05.2000 in Indien"),
        ("Verfügbarkeit", "Werkstudent, 20 Std./Woche, ab sofort"),
    ],
    "skills": [
        "Python",
        "PyTorch",
        "scikit-learn",
        "Vertex AI (GCP)",
        "NLP und LLMs",
        "Adversarial ML",
        "Explainable AI",
        "Threat Modelling",
        "LLM Red-Teaming",
        "Prompt Engineering",
    ],
    "languages": ["Englisch C1", "Deutsch B1", "Hindi, Muttersprache"],
    "interests": ["Musik: Gesang, Synthesizer, Ukulele, Gitarre", "Kochen: asiatische Küche, besonders indische"],
    "updated": "Aktualisiert im Juni 2026",
}


def crop_headshot() -> None:
    image = Image.open(SOURCE_HEADSHOT).convert("RGB")
    width, height = image.size
    target_ratio = 4 / 5
    crop_width = min(width, int(height * target_ratio))
    crop_height = int(crop_width / target_ratio)
    left = max(0, min(width - crop_width, int(width * 0.5 - crop_width * 0.5)))
    top = max(0, min(height - crop_height, int(height * 0.04)))
    cropped = image.crop((left, top, left + crop_width, top + crop_height))
    cropped.resize((800, 1000), Image.Resampling.LANCZOS).save(
        HEADSHOT, quality=92, optimize=True
    )


def wrap_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and stringWidth(candidate, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    *,
    font: str = "Helvetica",
    size: float = 9.3,
    color=INK,
    leading: float = 12,
) -> float:
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    for line in wrap_lines(text, font, size, width):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_section_heading(
    pdf: canvas.Canvas, label: str, x: float, y: float, width: float
) -> float:
    pdf.setFillColor(MOSS)
    pdf.setFont("Helvetica-Bold", 9.8)
    pdf.drawString(x, y, label)
    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.7)
    pdf.line(x, y - 4.5, x + width, y - 4.5)
    return y - 17


def draw_bullets(
    pdf: canvas.Canvas, items: Iterable[str], x: float, y: float, width: float
) -> float:
    for item in items:
        pdf.setStrokeColor(ACCENT)
        pdf.setLineWidth(1.1)
        pdf.line(x, y + 2.5, x + 5, y + 2.5)
        y = draw_wrapped(pdf, item, x + 10, y, width - 10, size=9, leading=11.8)
        y -= 4
    return y


def draw_entry(
    pdf: canvas.Canvas,
    entry: dict,
    x: float,
    y: float,
    width: float,
    *,
    spacing_after: float = 10,
) -> float:
    date = entry.get("date")
    title_width = width - (104 if date else 0)
    y = draw_wrapped(
        pdf,
        entry["title"],
        x,
        y,
        title_width,
        font="Helvetica-Bold",
        size=9.9,
        leading=12,
    )
    if date:
        pdf.setFont("Helvetica-Bold", 7.8)
        pdf.setFillColor(MUTED)
        pdf.drawRightString(x + width, y + 12, date)
    if entry.get("meta"):
        y = draw_wrapped(
            pdf,
            entry["meta"],
            x,
            y - 1,
            width,
            size=8.6,
            color=MUTED,
            leading=10.8,
        )
    if entry.get("bullets"):
        y = draw_bullets(pdf, entry["bullets"], x, y - 3, width)
    return y - spacing_after


def draw_left_label(pdf: canvas.Canvas, label: str, x: float, y: float) -> float:
    pdf.setFillColor(MOSS)
    pdf.setFont("Helvetica-Bold", 8.8)
    pdf.drawString(x, y, label)
    return y - 13


def draw_left_value(pdf: canvas.Canvas, value: str, x: float, y: float, width: float) -> float:
    return draw_wrapped(pdf, value, x, y, width, size=8.75, color=INK, leading=11)


def create_pdf(content: dict) -> Path:
    output = CV_DIR / content["filename"]
    pdf = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    pdf.setTitle(f"{content['title']} - {content['tagline']}")
    pdf.setAuthor(content["title"])
    pdf.setSubject("Curriculum vitae")

    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    pdf.setFillColor(ACCENT)
    pdf.rect(0, PAGE_H - 7, PAGE_W, 7, fill=1, stroke=0)

    photo_w, photo_h = 82, 102.5
    photo_x = PAGE_W - MARGIN - photo_w
    photo_y = PAGE_H - MARGIN - photo_h
    pdf.drawImage(
        ImageReader(str(HEADSHOT)),
        photo_x,
        photo_y,
        width=photo_w,
        height=photo_h,
        preserveAspectRatio=True,
        mask="auto",
    )
    pdf.setStrokeColor(MOSS)
    pdf.setLineWidth(0.8)
    pdf.rect(photo_x, photo_y, photo_w, photo_h, fill=0, stroke=1)

    text_w = photo_x - MARGIN - 18
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 27)
    pdf.drawString(MARGIN, PAGE_H - 64, content["title"])
    pdf.setFillColor(ACCENT)
    pdf.setFont("Helvetica-Bold", 8.8)
    pdf.drawString(MARGIN, PAGE_H - 82, content["tagline"])

    y = PAGE_H - 103
    for line in content["contact"]:
        y = draw_wrapped(pdf, line, MARGIN, y, text_w, size=8.4, color=MUTED, leading=10.6)

    divider_y = photo_y - 18
    pdf.setStrokeColor(MOSS)
    pdf.setLineWidth(1)
    pdf.line(MARGIN, divider_y, PAGE_W - MARGIN, divider_y)

    left_x = MARGIN
    left_w = 145
    gap = 25
    right_x = left_x + left_w + gap
    right_w = PAGE_W - MARGIN - right_x
    content_top = divider_y - 24

    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.7)
    pdf.line(left_x + left_w + gap / 2, content_top + 8, left_x + left_w + gap / 2, 58)

    y_left = draw_section_heading(
        pdf, content["sections"]["details"], left_x, content_top, left_w
    )
    for label, value in content["details"]:
        y_left = draw_left_label(pdf, label.upper(), left_x, y_left)
        y_left = draw_left_value(pdf, value, left_x, y_left, left_w)
        y_left -= 9

    y_left = draw_section_heading(
        pdf, content["sections"]["skills"], left_x, y_left - 3, left_w
    )
    for item in content["skills"]:
        pdf.setFillColor(ACCENT)
        pdf.circle(left_x + 2, y_left + 2.5, 1.15, fill=1, stroke=0)
        y_left = draw_left_value(pdf, item, left_x + 9, y_left, left_w - 9)
        y_left -= 3.5

    y_left = draw_section_heading(
        pdf, content["sections"]["languages"], left_x, y_left - 5, left_w
    )
    for item in content["languages"]:
        y_left = draw_left_value(pdf, item, left_x, y_left, left_w)
        y_left -= 3

    y_left = draw_section_heading(
        pdf, content["sections"]["interests"], left_x, y_left - 5, left_w
    )
    for item in content["interests"]:
        y_left = draw_left_value(pdf, item, left_x, y_left, left_w)
        y_left -= 6

    y_right = draw_section_heading(
        pdf, content["sections"]["profile"], right_x, content_top, right_w
    )
    y_right = draw_wrapped(
        pdf, content["profile"], right_x, y_right, right_w, size=9.4, leading=12.3
    )

    y_right = draw_section_heading(
        pdf, content["sections"]["experience"], right_x, y_right - 12, right_w
    )
    for entry in content["experience"]:
        y_right = draw_entry(pdf, entry, right_x, y_right, right_w)

    y_right = draw_section_heading(
        pdf, content["sections"]["education"], right_x, y_right - 1, right_w
    )
    for entry in content["education"]:
        y_right = draw_entry(
            pdf, entry, right_x, y_right, right_w, spacing_after=9
        )

    y_right = draw_section_heading(
        pdf, content["sections"]["research"], right_x, y_right - 1, right_w
    )
    for entry in content["research"]:
        y_right = draw_entry(
            pdf, entry, right_x, y_right, right_w, spacing_after=8
        )

    pdf.setStrokeColor(RULE)
    pdf.setLineWidth(0.7)
    pdf.line(MARGIN, 43, PAGE_W - MARGIN, 43)
    pdf.setFont("Helvetica", 7.2)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN, 29, content["updated"])
    pdf.drawRightString(PAGE_W - MARGIN, 29, "adarshsarda.github.io")

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
    crop_headshot()
    for content in (ENGLISH, GERMAN):
        pdf_path = create_pdf(content)
        render_preview(pdf_path, content["preview"])
        print(f"Generated {pdf_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
