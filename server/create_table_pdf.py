from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import json
from datetime import datetime

def create_table_pdf(form_data, output_path):
    """
    Create a PDF with table data from the form
    :param form_data: Dictionary containing form data
    :param output_path: Path where the PDF should be saved
    :return: Path to the created PDF
    """
    # Create the PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    # Get styles
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    normal_style = styles['Normal']

    # Create the content elements
    elements = []

    # Add title
    elements.append(Paragraph("Manuscript Submission Details", title_style))
    elements.append(Spacer(1, 30))

    # Prepare table data
    data = [
        ["Type:", form_data.get('type', '')],
        ["Title:", form_data.get('title', '')],
        ["Authors:", ", ".join(str(author.get('authorId', '')) for author in form_data.get('authors', []))],
        ["Keywords:", form_data.get('keywords', '')],
        ["Abstract:", form_data.get('abstract', '')],
        ["Classification:", form_data.get('classification', '')],
        ["Comments:", form_data.get('comments', '')],
        ["Funding:", form_data.get('funding', '')],
        ["Submission Date:", datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
    ]

    # Create table
    table = Table(data, colWidths=[2*inch, 4*inch])
    
    # Add style to table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))

    elements.append(table)
    
    # Build the PDF
    doc.build(elements)
    
    return output_path

if __name__ == "__main__":
    # Test data
    test_data = {
        "type": "Research Article",
        "title": "Sample Title",
        "authors": [{"authorId": "Author 1"}, {"authorId": "Author 2"}],
        "keywords": "test, sample",
        "abstract": "This is a test abstract",
        "classification": "Test Classification",
        "comments": "Test comments",
        "funding": "Test funding"
    }
    
    output_path = "uploads/table_test.pdf"
    create_table_pdf(test_data, output_path) 