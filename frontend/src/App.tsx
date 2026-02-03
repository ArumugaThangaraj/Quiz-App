import { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setUploadSuccess(false);
      setExtractedText('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a PDF or DOCX file first.');
      return;
    }

    setLoading(true);
    setMessage('');
    setUploadSuccess(false);
    setExtractedText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Success: ${res.data.filename} processed!`);
      setUploadSuccess(true);
      setExtractedText(res.data.extracted_text_preview || 'No text extracted.');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Upload/Extraction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upload Quiz Document (PDF / Word)
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose file
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition
            ${loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Processing...
            </span>
          ) : (
            'Upload & Extract Text'
          )}
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center text-sm font-medium ${uploadSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        {extractedText && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Extracted Text Preview:</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap">
              {extractedText}
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              (Showing first part — full extraction available in backend)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;