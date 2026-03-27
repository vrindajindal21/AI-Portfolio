from pypdf import PdfReader
import sys

def test_pdf(path):
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        print(f" Extracted {len(text)} characters.")
        print("First 500 chars:", text[:500])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_pdf(sys.argv[1])
