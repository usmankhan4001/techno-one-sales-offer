import os
import json
import datetime
from PIL import Image, ImageDraw, ImageFont
import fitz # PyMuPDF

# Output folder
OUT_DIR = 'exported_unit_offers'
os.makedirs(OUT_DIR, exist_ok=True)

# Load Inventory
with open('src/data/inventory.json', 'r', encoding='utf-8') as f:
    units = json.load(f)

print(f"Loaded {len(units)} units from inventory.")

# Base assets
TITLE_PAGE_IMG = 'public/assets/template_title_page.png'
TABLE_PAGE_IMG = 'public/assets/template_table_page.png'
BACK_COVER_IMG = 'public/assets/page_4_back_cover.png'

# Helper: Format PKR
def format_pkr(val):
    return f"PKR {round(val):,}"

# Helper: Add months to date
def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = min(sourcedate.day, [31, 29 if year % 4 == 0 and not (year % 100 == 0 and year % 400 != 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return datetime.date(year, month, day)

start_date = datetime.date(2026, 7, 22)

# Try loading Work Sans font or fallback
def get_font(size, bold=False):
    font_paths = [
        'C:/Windows/Fonts/worksans-bold.ttf' if bold else 'C:/Windows/Fonts/worksans-regular.ttf',
        'C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
        'C:/Windows/Fonts/dejavusans.ttf'
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title_val = get_font(72, bold=True)
font_summary_val = get_font(42, bold=False)
font_table_cell = get_font(38, bold=False)

def generate_pdf_for_unit(unit):
    unit_no = unit['unitNo']
    area = unit['areaSqFt']
    rate = unit['ratePerSqFt']
    total_price = area * rate
    down_payment = total_price * 0.30
    possession = total_price * 0.10
    financed = total_price - down_payment - possession
    monthly_inst = financed / 24.0

    # ================= PAGE 1: TITLE PAGE =================
    p1_img = Image.open(TITLE_PAGE_IMG).convert('RGB')
    p1_draw = ImageDraw.Draw(p1_img)
    p1_draw.text((194, 3000), "VALUED CLIENT", fill=(255, 255, 255), font=font_title_val)
    p1_draw.text((194, 3188), str(unit_no), fill=(255, 255, 255), font=font_title_val)

    p1_path = f"{OUT_DIR}/temp_p1_{unit_no}.jpg"
    p1_img.save(p1_path, 'JPEG', quality=85)

    # ================= PAGE 2: LAYOUT PLAN PAGE =================
    unit_plan_img_path = f"public/unit_plans/{unit_no}.png"
    if not os.path.exists(unit_plan_img_path):
        unit_plan_img_path = TITLE_PAGE_IMG

    p2_img = Image.open(unit_plan_img_path).convert('RGB')
    p2_path = f"{OUT_DIR}/temp_p2_{unit_no}.jpg"
    p2_img.save(p2_path, 'JPEG', quality=85)

    # ================= PAGE 3: TABLE PAGE =================
    p3_img = Image.open(TABLE_PAGE_IMG).convert('RGB')
    p3_draw = ImageDraw.Draw(p3_img)

    summary_color = (22, 40, 64)

    # Total Price
    p3_draw.text((1050, 350), format_pkr(total_price), fill=summary_color, font=font_summary_val, anchor='ra')
    # Down Payment
    p3_draw.text((2120, 350), format_pkr(down_payment), fill=summary_color, font=font_summary_val, anchor='ra')

    # Rate per SqFt
    p3_draw.text((1050, 432), format_pkr(rate), fill=summary_color, font=font_summary_val, anchor='ra')
    # Possession
    p3_draw.text((2120, 432), format_pkr(possession), fill=summary_color, font=font_summary_val, anchor='ra')

    # Date of Issue
    p3_draw.text((1050, 515), start_date.strftime("%d/%m/%Y"), fill=summary_color, font=font_summary_val, anchor='ra')
    # Monthly Installment
    p3_draw.text((2120, 515), format_pkr(monthly_inst), fill=summary_color, font=font_summary_val, anchor='ra')

    # Plan Duration
    p3_draw.text((1050, 598), "24 Months", fill=summary_color, font=font_summary_val, anchor='ra')
    # Balloon Payment
    p3_draw.text((2120, 598), "PKR 0", fill=summary_color, font=font_summary_val, anchor='ra')

    row_y_start = 851
    row_height = 88

    schedule_rows = []
    curr_balance = total_price - down_payment
    schedule_rows.append(("Down Payment", start_date.strftime("%d/%m/%Y"), down_payment, curr_balance))

    for i in range(1, 25):
        d = add_months(start_date, i)
        curr_balance -= monthly_inst
        schedule_rows.append((str(i), d.strftime("%d/%m/%Y"), monthly_inst, max(0, curr_balance)))

    pos_date = add_months(start_date, 24)
    schedule_rows.append(("Possession", pos_date.strftime("%d/%m/%Y"), possession, 0))

    for r_idx, (inst_no, inst_date, amt, due) in enumerate(schedule_rows):
        y_pos = row_y_start + (r_idx * row_height) + 24
        
        # Installment No
        p3_draw.text((420, y_pos), inst_no, fill=summary_color, font=font_table_cell, anchor='mm')
        # Date
        p3_draw.text((750, y_pos), inst_date, fill=(50, 60, 80), font=font_table_cell, anchor='lm')
        # Amount
        p3_draw.text((1700, y_pos), format_pkr(amt), fill=summary_color, font=font_table_cell, anchor='rm')
        # Amount Due
        p3_draw.text((2280, y_pos), format_pkr(due), fill=summary_color, font=font_table_cell, anchor='rm')

    p3_path = f"{OUT_DIR}/temp_p3_{unit_no}.jpg"
    p3_img.save(p3_path, 'JPEG', quality=85)

    # ================= PAGE 4: BACK COVER =================
    p4_img = Image.open(BACK_COVER_IMG).convert('RGB')
    p4_path = f"{OUT_DIR}/temp_p4_{unit_no}.jpg"
    p4_img.save(p4_path, 'JPEG', quality=85)

    # Combine 4 pages into single compressed PDF
    out_pdf_filename = f"Techno_One_Sales_Offer_{unit_no}.pdf"
    out_pdf_path = os.path.join(OUT_DIR, out_pdf_filename)

    doc = fitz.open()
    for page_img_path in [p1_path, p2_path, p3_path, p4_path]:
        img_doc = fitz.open(page_img_path)
        pdf_bytes = img_doc.convert_to_pdf()
        img_pdf = fitz.open("pdf", pdf_bytes)
        doc.insert_pdf(img_pdf)

    doc.save(out_pdf_path, deflate=True)
    doc.close()

    # Clean temporary files
    for p in [p1_path, p2_path, p3_path, p4_path]:
        if os.path.exists(p): os.remove(p)

    print(f"[SUCCESS] Exported: {out_pdf_filename}")

# Process all 36 units
for idx, u in enumerate(units, 1):
    print(f"[{idx}/{len(units)}] Processing Unit {u['unitNo']}...")
    generate_pdf_for_unit(u)

print(f"\n[DONE] Successfully generated all {len(units)} unit sales offer PDFs in '{OUT_DIR}' folder!")
