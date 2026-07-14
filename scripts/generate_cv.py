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
STRIPE_W = 26
MARGIN_L = 46
MARGIN_R = 46
RIGHT = PAGE_W - MARGIN_R
CONTENT_W = RIGHT - MARGIN_L

INK = HexColor("#202524")
MUTED = HexColor("#5A6561")
GREEN = HexColor("#275317")       # section headings (from the template)
GREEN_LINK = HexColor("#3A6B2E")  # email / links
STRIPE = HexColor("#E9F1E2")      # soft mint left band
TITLE_LT = HexColor("#B7BCB4")    # "LEBENSLAUF" light grey
TITLE_DK = HexColor("#6C716A")    # "ADARSH SARDA" grey
RULE = HexColor("#C4C9C2")
FRAME = HexColor("#D3D8D1")
PAPER = HexColor("#FBFAF6")

BODY = "Helvetica"
BOLD = "Helvetica-Bold"


ENGLISH = {
    "filename": "adarsh-sarda-cv-english.pdf",
    "preview": "english-preview.png",
    "title_word": "CURRICULUM VITAE",
    "name": "ADARSH SARDA",
    "contact": "Glückaufstr. 9   |   92224 Amberg   |   Phone: +49 1551 0438756",
    "email": "adarshsarda29@gmail.com",
    "born": "Born: 29 May 2000 in India",
    "sections": {
        "profile": "About me",
        "education": "Education",
        "experience": "Experience",
        "skills": "Skills",
        "interests": "Interests & Hobbies",
    },
    "profile": (
        "M.Sc. Artificial Intelligence student at OTH Amberg-Weiden with a focus on AI "
        "security. Current research: secure and robust language models, LLM red teaming, "
        "and vulnerability analysis of modern AI systems."
    ),
    "education": [
        {
            "date": "03/2025\npresent",
            "title": "M.Sc. Artificial Intelligence for Industrial Applications",
            "meta": "OTH Amberg-Weiden, Amberg, Bavaria   ·   Grade 2.0",
            "bullets": [
                "Designed a semantic LLM backdoor attack achieving 100% ASR and 0% false-trigger rate on Qwen-3B via order-dependent trigger activation.",
            ],
        },
        {
            "date": "08/2019\n06/2023",
            "title": "B.Tech in Information Technology",
            "meta": "Institute of Engineering and Management, Kolkata, India   ·   Grade 1.7 (8.6/10)",
            "bullets": [
                "Built an LSTM-based multimodal emotion-recognition model at ~86% accuracy, published with Springer in 2023.",
            ],
        },
    ],
    "experience": [
        {
            "date": "01/2023\n10/2024",
            "title": "Research Analyst",
            "meta": "GreyB Research Pte., Chandigarh, India",
            "bullets": [
                "Built an ML model for automated patent classification over large patent corpora.",
                "Ran patent-infringement, prior-art, and tech-scouting analysis across AI/ML, blockchain, and telecom (3GPP, IETF) for international clients.",
            ],
        }
    ],
    "skills": [
        ("Tools", "Python, PyTorch, scikit-learn, Vertex AI (GCP)"),
        ("AI", "NLP, Agentic AI, Adversarial ML, XAI, Threat Modelling, Red-Teaming, Prompt Engineering"),
        ("Languages", "English (C1), German (B1), Hindi (native)"),
    ],
    "interests": [
        "Music (voice, synthesizer, ukulele, guitar)",
        "Cooking (Asian cuisine, focus: India)",
    ],
    "updated": "Updated June 2026",
    "site": "adarshsarda.github.io",
}


GERMAN = {
    "filename": "adarsh-sarda-lebenslauf-deutsch.pdf",
    "preview": "german-preview.png",
    "title_word": "LEBENSLAUF",
    "name": "ADARSH SARDA",
    "contact": "Glückaufstr. 9   |   92224 Amberg   |   Fon: +49 1551 0438756",
    "email": "adarshsarda29@gmail.com",
    "born": "Geboren: 29.5.2000 in Indien",
    "sections": {
        "profile": "Über mich",
        "education": "Bildungsweg",
        "experience": "Berufserfahrung",
        "skills": "Besondere Kenntnisse",
        "interests": "Interessen & Hobbys",
    },
    "profile": (
        "M.Sc.-Student der Künstlichen Intelligenz an der OTH Amberg-Weiden mit Schwerpunkt "
        "auf AI Security. Aktuelle Forschung: sichere und robuste Sprachmodelle, Red-Teaming "
        "von LLMs sowie Schwachstellenanalyse moderner KI-Systeme."
    ),
    "education": [
        {
            "date": "03/2025\nHeute",
            "title": "M.Sc. Künstliche Intelligenz für industrielle Anwendungen",
            "meta": "OTH Amberg-Weiden, Amberg, Bayern   ·   Note 2,0",
            "bullets": [
                "Konzipierte einen semantischen LLM-Backdoor-Angriff mit 100% ASR und 0% FTR auf Qwen-3B durch order-dependent Trigger-Aktivierung.",
            ],
        },
        {
            "date": "08/2019\n06/2023",
            "title": "B.Tech in Information Technology",
            "meta": "Institute of Engineering and Management, Kalkutta, Indien   ·   Note 1,7 (8,6/10)",
            "bullets": [
                "Entwickelte ein LSTM-basiertes multimodales Emotionserkennungsmodell mit ca. 86% Genauigkeit, veröffentlicht bei Springer 2023.",
            ],
        },
    ],
    "experience": [
        {
            "date": "01/2023\n10/2024",
            "title": "Research Analyst",
            "meta": "GreyB Research Pte., Chandigarh, Indien",
            "bullets": [
                "Entwicklung eines ML-Modells zur automatisierten Patentklassifikation für umfangreiche Patentkorpora.",
                "Patent-Infringement-, Prior-Art- und Tech-Scouting-Analysen in AI/ML, Blockchain und Telekommunikation (3GPP, IETF) für internationale Kunden.",
            ],
        }
    ],
    "skills": [
        ("Tools", "Python, PyTorch, scikit-learn, Vertex AI (GCP)"),
        ("AI", "NLP, Agentic AI, Adversarial ML, XAI, Threat Modelling, Red-Teaming, Prompt Engineering"),
        ("Sprachen", "Englisch (C1), Deutsch (B1), Hindi (Muttersprache)"),
    ],
    "interests": [
        "Musik (Gesang, Synthesizer, Ukulele, Gitarre)",
        "Kochen (asiatische Küche mit Schwerpunkt: Indien)",
    ],
    "updated": "Aktualisiert im Juni 2026",
    "site": "adarshsarda.github.io",
}


def crop_headshot() -> None:
    image = Image.open(SOURCE_HEADSHOT).convert("RGB")
    w, h = image.size
    target = 4 / 5
    cw = min(w, int(h * target))
    ch = int(cw / target)
    left = max(0, (w - cw) // 2)
    top = max(0, int(h * 0.02))
    image.crop((left, top, left + cw, min(h, top + ch))).resize(
        (440, 550), Image.Resampling.LANCZOS
    ).save(HEADSHOT, quality=92, optimize=True)


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
    pdf.setFillColor(GREEN)
    pdf.setFont(BOLD, 12.5)
    pdf.drawString(x, y, label)
    pdf.setStrokeColor(GREEN)
    pdf.setLineWidth(1.1)
    pdf.line(x, y - 6, x + width, y - 6)
    return y - 20


def draw_bullets(pdf, items: Iterable[str], x, y, width) -> float:
    for item in items:
        pdf.setFillColor(GREEN)
        pdf.setFont(BOLD, 9)
        pdf.drawString(x, y, "-")
        y = draw_wrapped(pdf, item, x + 9, y, width - 9, size=9, leading=11.7)
        y -= 3.5
    return y


DATE_W = 70


def draw_entry(pdf, entry, x, y, width, *, spacing=9.0) -> float:
    tx = x + DATE_W
    tw = width - DATE_W
    if entry.get("date"):
        pdf.setFont(BOLD, 8.6)
        pdf.setFillColor(INK)
        dy = y
        for line in entry["date"].split("\n"):
            pdf.drawString(x, dy, line)
            dy -= 11
    yy = draw_wrapped(pdf, entry["title"], tx, y, tw, font=BOLD, size=9.9, leading=12)
    if entry.get("meta"):
        yy = draw_wrapped(pdf, entry["meta"], tx, yy, tw, size=8.7, color=MUTED, leading=11)
    if entry.get("bullets"):
        yy = draw_bullets(pdf, entry["bullets"], tx, yy - 3, tw)
    return yy - spacing


def draw_skills(pdf, groups, x, y, width) -> float:
    for label, value in groups:
        pdf.setFont(BOLD, 9.2)
        pdf.setFillColor(GREEN)
        pdf.drawString(x, y, "-")
        pdf.setFillColor(INK)
        pdf.drawString(x + 9, y, f"{label}:")
        offset = 9 + stringWidth(f"{label}:  ", BOLD, 9.2)
        y = draw_wrapped(pdf, value, x + offset, y, width - offset, size=9.2, leading=11.8)
        y -= 4
    return y


def create_pdf(content: dict) -> Path:
    output = CV_DIR / content["filename"]
    pdf = canvas.Canvas(str(output), pagesize=A4, pageCompression=1)
    pdf.setTitle(f"{content['title_word'].title()} — Adarsh Sarda")
    pdf.setAuthor("Adarsh Sarda")
    pdf.setSubject("Curriculum vitae")

    # Background, mint stripe, page frame.
    pdf.setFillColor(PAPER)
    pdf.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    pdf.setFillColor(STRIPE)
    pdf.rect(0, 0, STRIPE_W, PAGE_H, fill=1, stroke=0)
    pdf.setStrokeColor(FRAME)
    pdf.setLineWidth(0.8)
    pdf.rect(10, 10, PAGE_W - 20, PAGE_H - 20, fill=0, stroke=1)

    # Photo, top-left.
    pw, ph = 92, 115
    px, py = MARGIN_L, PAGE_H - 40 - ph
    pdf.drawImage(ImageReader(str(HEADSHOT)), px, py, width=pw, height=ph,
                  preserveAspectRatio=True, mask="auto")
    pdf.setStrokeColor(MUTED)
    pdf.setLineWidth(0.9)
    pdf.rect(px, py, pw, ph, fill=0, stroke=1)

    # Title, right of photo (two-tone).
    ty = PAGE_H - 66
    pdf.setFont(BOLD, 21)
    name_w = stringWidth(content["name"], BOLD, 21)
    lead = content["title_word"] + "  "
    lead_w = stringWidth(lead, BOLD, 21)
    nx = RIGHT - name_w
    pdf.setFillColor(TITLE_LT)
    pdf.drawString(nx - lead_w, ty, lead)
    pdf.setFillColor(TITLE_DK)
    pdf.drawString(nx, ty, content["name"])

    # Contact block, centred in the region right of the photo.
    region_l = px + pw + 18
    cx = (region_l + RIGHT) / 2
    pdf.setFont(BODY, 8.3)
    pdf.setFillColor(MUTED)
    pdf.drawCentredString(cx, PAGE_H - 96, content["contact"])
    mail_label = "Mail: "
    mail_w = stringWidth(mail_label, BODY, 8.3) + stringWidth(content["email"], BODY, 8.3)
    mx = cx - mail_w / 2
    pdf.drawString(mx, PAGE_H - 108, mail_label)
    pdf.setFillColor(GREEN_LINK)
    pdf.drawString(mx + stringWidth(mail_label, BODY, 8.3), PAGE_H - 108, content["email"])
    pdf.setFillColor(MUTED)
    pdf.drawCentredString(cx, PAGE_H - 120, content["born"])

    # Sections.
    y = min(py - 22, PAGE_H - 150)
    s = content["sections"]

    y = draw_heading(pdf, s["profile"], MARGIN_L, y, CONTENT_W)
    y = draw_wrapped(pdf, content["profile"], MARGIN_L, y, CONTENT_W, size=9.5, leading=12.6)

    y = draw_heading(pdf, s["education"], MARGIN_L, y - 13, CONTENT_W)
    for entry in content["education"]:
        y = draw_entry(pdf, entry, MARGIN_L, y, CONTENT_W)

    y = draw_heading(pdf, s["experience"], MARGIN_L, y - 5, CONTENT_W)
    for entry in content["experience"]:
        y = draw_entry(pdf, entry, MARGIN_L, y, CONTENT_W, spacing=10)

    y = draw_heading(pdf, s["skills"], MARGIN_L, y - 5, CONTENT_W)
    y = draw_skills(pdf, content["skills"], MARGIN_L, y, CONTENT_W)

    y = draw_heading(pdf, s["interests"], MARGIN_L, y - 6, CONTENT_W)
    y = draw_bullets(pdf, content["interests"], MARGIN_L, y, CONTENT_W)

    # Footer.
    pdf.setFont(BODY, 7.3)
    pdf.setFillColor(MUTED)
    pdf.drawString(MARGIN_L, 26, content["updated"])
    pdf.drawRightString(RIGHT, 26, content["site"])

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
        print("wrote", pdf_path.name)


if __name__ == "__main__":
    main()
