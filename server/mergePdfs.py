import sys
from PyPDF2 import PdfMerger
import os

def merge_pdfs(output_path, input_paths):
    merger = PdfMerger()
    for pdf in input_paths:
        if os.path.exists(pdf):
            merger.append(pdf)
        else:
            print(f"Warning: {pdf} does not exist and will be skipped.", file=sys.stderr)
    merger.write(output_path)
    merger.close()
    print(f"Merged PDF saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python mergePdfs.py <output_path> <input1.pdf> <input2.pdf> ...", file=sys.stderr)
        sys.exit(1)
    output_path = sys.argv[1]
    input_paths = sys.argv[2:]
    merge_pdfs(output_path, input_paths)
