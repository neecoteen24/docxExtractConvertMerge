import { useState } from 'react'
import './App.css'

function App() {
  // State for each file input
  const [files, setFiles] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [mergedPdf, setMergedPdf] = useState(null);

  // Handler for file input changes
  const handleFileChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.some(f => !f)) {
      alert('Please select all three files.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    try {
      const res = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.results) {
        data.results.forEach((result, idx) => {
          console.log(`File ${idx + 1} (${result.filename}) extracted text:\n`, result.text);
        });
        setResults(data.results);
        setMergedPdf(data.mergedPdfPath || null);
        alert('Files uploaded and processed! Check the console for extracted text.');
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload DOC/DOCX Files</h1>
      <form onSubmit={handleUpload}>
        {[0, 1, 2].map((idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <label>
              File {idx + 1}: 
              <input
                type="file"
                accept=".doc,.docx"
                onChange={(e) => handleFileChange(idx, e)}
              />
            </label>
            {files[idx] && <span style={{ marginLeft: '1rem' }}>{files[idx].name}</span>}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload and Convert'}
        </button>
      </form>
      {results && (
        <div>
          <h2>Converted PDFs</h2>
          <ul>
            {results.map((result, idx) => (
              <li key={idx}>
                {result.filename}:&nbsp;
                {result.pdfPath && result.pdfPath.endsWith('.pdf') ? (
                  <a href={`http://localhost:3001${result.pdfPath}`} download>
                    Download PDF
                  </a>
                ) : (
                  <span>{result.pdfPath}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {mergedPdf && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Merged PDF</h2>
          <a href={`http://localhost:3001${mergedPdf}`} download>
            Download Merged PDF
          </a>
        </div>
      )}
    </div>
  );
}

export default App
