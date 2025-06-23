const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your Vite frontend is running on
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use('/uploads', express.static('uploads'));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Preserve the original file extension
    const ext = path.extname(file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST endpoint to handle file uploads with form data
app.post('/upload', upload.array('files', 3), async (req, res) => {
  if (!req.files || req.files.length !== 3) {
    return res.status(400).json({ error: 'Please upload exactly three files.' });
  }

  const formData = req.body;
  let results = [];
  let pdfFiles = [];

  for (const file of req.files) {
    const filePath = path.resolve(file.path);
    const ext = path.extname(file.originalname).toLowerCase();
    let text = '';
    let pdfPath = '';

    if (ext !== '.doc' && ext !== '.docx') {
      results.push({
        filename: file.originalname,
        text: 'Error: File must be .doc or .docx',
        pdfPath: 'Error: Unsupported file type'
      });
      continue;
    }

    // Extract text using Python script
    try {
      text = execFileSync('python', ['extract_text.py', filePath], { encoding: 'utf-8' });
      console.log(`Extracted text from ${file.originalname}:\n`, text);
    } catch (err) {
      text = 'Error extracting text';
      console.error('Text extraction error:', err.stderr ? err.stderr.toString() : err.message);
    }

    // Convert to PDF
    try {
      const outputFileName = path.parse(file.originalname).name + '.pdf';
      const outputPath = path.join(__dirname, 'uploads', outputFileName);
      
      // Kill any hanging Word processes (on Windows)
      try {
        execFileSync('taskkill', ['/F', '/IM', 'WINWORD.EXE'], { stdio: 'ignore' });
      } catch (e) {
        // Ignore errors if Word wasn't running
      }

      // Wait a moment before starting conversion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Convert to PDF
      execFileSync('python', ['docxtopdf.py', filePath, outputPath]);
      
      // Verify the PDF exists and is not empty
      if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
        pdfPath = '/uploads/' + outputFileName;
        if (pdfPath && pdfPath.endsWith('.pdf') && !pdfPath.startsWith('Error')) {
          pdfFiles.push(path.join(__dirname, 'uploads', path.parse(file.originalname).name + '.pdf'));
        }
      } else {
        throw new Error('PDF file was not created or is empty');
      }
    } catch (err) {
      pdfPath = 'Error converting to PDF';
      console.error('PDF conversion error:', err.stderr ? err.stderr.toString() : err.message);
      
      // Try to clean up any failed conversion
      const outputFileName = path.parse(file.originalname).name + '.pdf';
      const outputPath = path.join(__dirname, 'uploads', outputFileName);
      try {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      } catch (e) {
        console.error('Error cleaning up failed conversion:', e);
      }
    }

    results.push({
      filename: file.originalname,
      text,
      pdfPath
    });
  }

  let mergedPdfPath = '';
  if (pdfFiles.length === 3) {
    try {
      mergedPdfPath = path.join('uploads', 'merged_output.pdf');
      const mergedPdfAbsPath = path.join(__dirname, mergedPdfPath);
      
      // Create table PDF and merge with other PDFs
      execFileSync('python', [
        'mergePdfs.py',
        'create_and_merge_with_table',
        mergedPdfAbsPath,
        JSON.stringify(formData),
        ...pdfFiles
      ]);
      
      mergedPdfPath = '/' + mergedPdfPath.replace(/\\/g, '/');
    } catch (err) {
      mergedPdfPath = '';
      console.error('PDF merge error:', err.stderr ? err.stderr.toString() : err.message);
    }
  }

  res.json({ results, mergedPdfPath });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 