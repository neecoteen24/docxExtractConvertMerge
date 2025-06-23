import sys
from PyPDF2 import PdfMerger
import os
from create_table_pdf import create_table_pdf
import json

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

def create_and_merge_with_table(form_data, output_path, input_paths):
    """
    Create a table PDF from form data and merge it with other PDFs
    :param form_data: Dictionary containing form data for the table
    :param output_path: Path where the final merged PDF should be saved
    :param input_paths: List of paths to PDFs to merge with the table
    :return: Path to the merged PDF
    """
    # Create table PDF
    table_pdf_path = os.path.join(os.path.dirname(output_path), f'table_{os.path.basename(output_path)}')
    create_table_pdf(form_data, table_pdf_path)
    
    # Add table PDF as the first document
    all_pdfs = [table_pdf_path] + input_paths
    
    # Merge all PDFs
    merge_pdfs(output_path, all_pdfs)
    
    # Clean up the temporary table PDF
    try:
        os.remove(table_pdf_path)
    except:
        pass
    
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage:", file=sys.stderr)
        print("  For simple merge: python mergePdfs.py <output_path> <input1.pdf> <input2.pdf> ...", file=sys.stderr)
        print("  For table merge: python mergePdfs.py create_and_merge_with_table <output_path> <form_data_json> <input1.pdf> <input2.pdf> ...", file=sys.stderr)
        sys.exit(1)

    if sys.argv[1] == "create_and_merge_with_table":
        if len(sys.argv) < 5:
            print("Error: Not enough arguments for table merge", file=sys.stderr)
            sys.exit(1)
        output_path = sys.argv[2]
        form_data = json.loads(sys.argv[3])
        input_paths = sys.argv[4:]
        create_and_merge_with_table(form_data, output_path, input_paths)
    else:
        output_path = sys.argv[1]
        input_paths = sys.argv[2:]
        merge_pdfs(output_path, input_paths)
