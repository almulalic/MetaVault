import os
import re
import sys
import base64
import pytesseract
from PIL import Image
from pdf2image import convert_from_path


def clean_ocr_response(text):
    text = re.sub(r'[\n\r]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()

    return text


def tesseract_ocr(image):
    return clean_ocr_response(pytesseract.image_to_string(image))


def process_pdf(pdf_path):
    """Convert a PDF into a list of PIL Image objects (one per page)."""
    pages = convert_from_path(pdf_path)
    results = []

    for i, page in enumerate(pages):
        tmp_path = f'/tmp/page_{i}.tmp.png'
        page.save(tmp_path, 'PNG')
        results.append(tesseract_ocr(Image.open(tmp_path)))
        os.remove(tmp_path)

    return results


def process_file(path: str):
    if path.endswith('.pdf'):
        return '\n'.join(process_pdf(path))
    else:
        return tesseract_ocr(Image.open(path))


if __name__ == "__main__":
    if len(sys.argv) > 1:
        path = base64.b64decode(sys.argv[1]).decode('utf-8')
        summary = process_file(path)
        print(base64.b64encode(summary.encode('utf-8')).decode('utf-8'))
    else:
        print("No path provided.")
