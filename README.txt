============================
DOC/DOCX to PDF Extractor & Merger
============================

This project is a full-stack web application that allows users to:
- Upload three DOC or DOCX files
- Extract text from each file
- Convert each file to PDF
- Download each PDF individually
- Merge all PDFs into a single file and download the merged PDF

----------------------------
Requirements
----------------------------

**System:**
- Windows (required for DOC/DOCX to PDF conversion)
- Microsoft Word (must be installed and activated)

**Software:**
- Node.js (https://nodejs.org/)
- Python 3.x (https://www.python.org/)
- npm (comes with Node.js)

**Python Packages:**
- docx2txt
- docx2pdf
- pywin32
- PyPDF2

----------------------------
Installation
----------------------------

1. **Clone or download this repository.**

2. **Install backend dependencies:**
   Open a terminal and run:
   ```sh
   cd server
   npm install
   pip install docx2txt docx2pdf pywin32 PyPDF2
   ```

3. **Install frontend dependencies:**
   Open a new terminal and run:
   ```sh
   cd client/textAndMerge
   npm install
   ```

----------------------------
How to Run
----------------------------

1. **Start the backend server:**
   ```sh
   cd server
   node index.js
   ```
   You should see: `Server running on http://localhost:3001`

2. **Start the frontend dev server:**
   Open a new terminal:
   ```sh
   cd client/textAndMerge
   npm run dev
   ```
   You should see: `Local: http://localhost:5173/`

3. **Open your browser and go to:**
   http://localhost:5173/

----------------------------
How It Works
----------------------------

- The frontend allows you to select and upload three DOC or DOCX files.
- The backend receives the files, extracts text using Python's `docx2txt`, and converts each to PDF using Microsoft Word automation (`pywin32`).
- After all conversions, the backend merges the PDFs into a single file using `PyPDF2`.
- The frontend displays download links for each individual PDF and for the merged PDF.

----------------------------
Troubleshooting
----------------------------

- **PDF conversion fails:**
  - Make sure Microsoft Word is installed and not running in the background.
  - Only DOC or DOCX files are supported.
- **Python errors:**
  - Ensure all required Python packages are installed globally.
- **CORS or network errors:**
  - Make sure both frontend and backend servers are running.
  - Ports in the code must match the running servers.

----------------------------
Project Structure
----------------------------

- `server/` - Node.js backend, Python scripts for extraction, conversion, and merging
- `client/textAndMerge/` - React frontend (Vite)

----------------------------
Contact
----------------------------
For questions or issues, please contact the project maintainer. 