import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfgen import canvas

pdf_path = r"C:\Users\TEJDEEP\.gemini\antigravity\scratch\canteen-token-system\Project_Abstract_Canteen_System.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#0F172A'),
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#2563EB'),
    spaceAfter=12
)

meta_style = ParagraphStyle(
    'MetaText',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#475569')
)

section_heading = ParagraphStyle(
    'SectionHead',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=15,
    textColor=colors.HexColor('#1E293B'),
    spaceBefore=10,
    spaceAfter=6
)

abstract_style = ParagraphStyle(
    'AbstractBody',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=15,
    textColor=colors.HexColor('#1E293B')
)

bullet_style = ParagraphStyle(
    'BulletText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor('#334155')
)

table_header = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=12,
    textColor=colors.HexColor('#FFFFFF')
)

table_cell = ParagraphStyle(
    'TableCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor('#1E293B')
)

table_cell_bold = ParagraphStyle(
    'TableCellBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11.5,
    textColor=colors.HexColor('#0F172A')
)

elements = []

# Title & Header
elements.append(Paragraph("Smart Campus Canteen Pre-Ordering & Live Token System", title_style))
elements.append(Paragraph("Full-Stack Web Engineering Project &bull; Java (Spring Boot) & React", subtitle_style))
elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#E2E8F0'), spaceAfter=10))

# Abstract Card
abstract_content = (
    "<b>The Smart Campus Canteen Pre-Ordering & Live Token System</b> eliminates long lunch queues and chaotic "
    "food counters in college campuses through an intuitive full-stack web application. Built with <b>React</b> and "
    "<b>Spring Boot (Java)</b>, the platform enables students to pre-order meals from dynamic menus and receive instant "
    "digital tokens for scheduled pickups. Canteen staff manage incoming orders through a real-time kitchen queue, while a "
    "public TV display board flashes ready tokens for hassle-free collection. Secured with <b>JWT authentication</b> and "
    "powered by <b>Spring Data JPA</b>, this project modernizes campus dining into a fast, transparent, and completely "
    "queue-free experience."
)

abstract_table = Table(
    [[Paragraph("<b>PROJECT ABSTRACT</b>", ParagraphStyle('BoxH', fontName='Helvetica-Bold', fontSize=10, textColor=colors.HexColor('#1D4ED8'), leading=12)), ""],
     [Paragraph(abstract_content, abstract_style), ""]],
    colWidths=[500, 20]
)
abstract_table.setStyle(TableStyle([
    ('SPAN', (0, 0), (1, 0)),
    ('SPAN', (0, 1), (1, 1)),
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
    ('LINEBEFORE', (0, 0), (0, -1), 3.5, colors.HexColor('#2563EB')),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
]))
elements.append(abstract_table)
elements.append(Spacer(1, 12))

# Key Modules & Features
elements.append(Paragraph("Key System Modules", section_heading))

modules_data = [
    [
        Paragraph("<b>1. Student Portal (React)</b><br/>"
                  "&bull; Browse categorized daily menus (Breakfast, Lunch, Snacks, Drinks).<br/>"
                  "&bull; Add to interactive cart with instant price calculation.<br/>"
                  "&bull; Select class-break pickup time slots.<br/>"
                  "&bull; Real-time token tracking badge (Placed &rarr; Preparing &rarr; Ready).", bullet_style),
        Paragraph("<b>2. Canteen Staff Dashboard (Spring Boot + React)</b><br/>"
                  "&bull; Live incoming kitchen order queue ordered by pickup time.<br/>"
                  "&bull; 1-click status transitions (Received &rarr; Preparing &rarr; Ready).<br/>"
                  "&bull; Live item availability toggle (Mark 'Out of Stock' instantly).<br/>"
                  "&bull; Daily order summary and sales breakdown.", bullet_style)
    ],
    [
        Paragraph("<b>3. Live Public Display Board</b><br/>"
                  "&bull; Fullscreen high-visibility screen for dining hall TV/monitor.<br/>"
                  "&bull; Clear status split: <i>Now Preparing</i> vs <i>Ready for Pickup</i>.<br/>"
                  "&bull; Color-coded flashing alerts for recently ready tokens.<br/>"
                  "&bull; Eliminates counter crowding and verbal announcements.", bullet_style),
        Paragraph("<b>4. Security & Data Management</b><br/>"
                  "&bull; Stateless authentication via <b>JSON Web Tokens (JWT)</b>.<br/>"
                  "&bull; Role-Based Access Control (<code>ROLE_STUDENT</code> & <code>ROLE_STAFF</code>).<br/>"
                  "&bull; Relational database integrity with Spring Data JPA & Hibernate.<br/>"
                  "&bull; Prevents duplicate token collisions and race conditions.", bullet_style)
    ]
]

mod_table = Table(modules_data, colWidths=[255, 255])
mod_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#FFFFFF')),
    ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#FFFFFF')),
    ('BACKGROUND', (0, 1), (0, 1), colors.HexColor('#FFFFFF')),
    ('BACKGROUND', (1, 1), (1, 1), colors.HexColor('#FFFFFF')),
    ('BOX', (0, 0), (0, 0), 0.5, colors.HexColor('#CBD5E1')),
    ('BOX', (1, 0), (1, 0), 0.5, colors.HexColor('#CBD5E1')),
    ('BOX', (0, 1), (0, 1), 0.5, colors.HexColor('#CBD5E1')),
    ('BOX', (1, 1), (1, 1), 0.5, colors.HexColor('#CBD5E1')),
    ('PADDING', (0, 0), (-1, -1), 8),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(mod_table)
elements.append(Spacer(1, 12))

# Tech Stack Table
elements.append(Paragraph("Technology Specifications", section_heading))

stack_data = [
    [Paragraph("Layer", table_header), Paragraph("Technology Choices", table_header), Paragraph("Functional Role", table_header)],
    [Paragraph("Frontend", table_cell_bold), Paragraph("React 18+, Vite, Tailwind CSS, Axios", table_cell), Paragraph("Interactive UI, responsive cart state, live status polling", table_cell)],
    [Paragraph("Backend", table_cell_bold), Paragraph("Java 17/21, Spring Boot 3.x, Spring Web", table_cell), Paragraph("RESTful endpoints, business logic, token generation", table_cell)],
    [Paragraph("Security", table_cell_bold), Paragraph("Spring Security 6, JWT, BCrypt", table_cell), Paragraph("Stateless token auth, role authorization (Student/Staff)", table_cell)],
    [Paragraph("Database", table_cell_bold), Paragraph("Spring Data JPA, Hibernate, MySQL/PostgreSQL", table_cell), Paragraph("Relational data mapping, ACID transactions, data persistence", table_cell)],
    [Paragraph("Deployment", table_cell_bold), Paragraph("Docker, GitHub / Localhost", table_cell), Paragraph("Containerized multi-container full-stack execution", table_cell)]
]

stack_table = Table(stack_data, colWidths=[80, 210, 220])
stack_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
]))
elements.append(stack_table)
elements.append(Spacer(1, 14))

# Footer note
footer_text = Paragraph(
    "<font color='#64748B' size=8><b>College Full-Stack Engineering Project Synopsis</b> &bull; "
    "Designed for high-impact campus placement demos and academic review &bull; Ready for implementation</font>",
    ParagraphStyle('Foot', alignment=1)
)
elements.append(footer_text)

doc.build(elements)
print(f"SUCCESS: PDF generated at {pdf_path}")
