
import React, { useState, useRef } from 'react';
import { DocumentDetails } from '../types';

interface DocumentInputFormProps {
  onSubmit: (details: DocumentDetails) => void;
  isLoading: boolean;
}

export const DocumentInputForm: React.FC<DocumentInputFormProps> = ({ onSubmit, isLoading }) => {
  const [documentContent, setDocumentContent] = useState<string>('');
  const [caseId, setCaseId] = useState<string>('');
  const [caseIdError, setCaseIdError] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');
  
  // File State
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setGeneralError('');
    } else {
      setGeneralError('Invalid file type. Please upload JPG, PNG, WEBP, or PDF.');
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the Data-URL declaration (e.g., "data:image/jpeg;base64,") to get just the base64 string
        const base64Data = result.split(',')[1]; 
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    
    if (!caseId.trim()) {
      setCaseIdError('Case ID is required.');
      valid = false;
    } else {
      setCaseIdError('');
    }

    if (!documentContent.trim() && !file) {
      setGeneralError('Please provide either text content OR upload a document.');
      valid = false;
    } else {
      setGeneralError('');
    }

    if (valid) {
      let fileData = null;
      if (file) {
        try {
          const base64 = await convertFileToBase64(file);
          fileData = {
            mimeType: file.type,
            data: base64
          };
        } catch (error) {
          console.error("File conversion error", error);
          setGeneralError("Failed to process the file.");
          return;
        }
      }

      onSubmit({ caseId, documentContent, fileData });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="caseId" className="block text-sm font-medium text-sky-300 mb-1">
          Case ID / Document ID
        </label>
        <input
          type="text"
          id="caseId"
          value={caseId}
          onChange={(e) => {
            setCaseId(e.target.value);
            if (e.target.value.trim()) setCaseIdError('');
          }}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-100 placeholder-slate-400"
          placeholder="Enter unique case identifier (e.g., CASE-12345)"
        />
        {caseIdError && <p className="text-red-400 text-xs mt-1">{caseIdError}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sky-300">
          Upload Document (Image/PDF)
        </label>
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200 ${
            dragActive ? "border-sky-400 bg-slate-600" : "border-slate-600 bg-slate-700 hover:border-sky-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,application/pdf"
          />
          
          {file ? (
             <div className="flex items-center space-x-2 z-10 bg-slate-800 p-2 rounded px-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-white font-medium truncate max-w-xs">{file.name}</span>
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); removeFile(); }}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  Remove
                </button>
             </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-slate-300 text-sm font-medium">Drag & Drop or Click to Upload</p>
              <p className="text-slate-500 text-xs mt-1">Supports Handwritten Notes (OCR), Forms, Medical Records (PDF, JPG, PNG)</p>
            </>
          )}
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-600"></div>
        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">OR Paste Text</span>
        <div className="flex-grow border-t border-slate-600"></div>
      </div>

      <div>
        <label htmlFor="documentContent" className="block text-sm font-medium text-sky-300 mb-1">
          Document Context / Text Content
        </label>
        <textarea
          id="documentContent"
          rows={4}
          value={documentContent}
          onChange={(e) => {
            setDocumentContent(e.target.value);
            setGeneralError('');
          }}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-gray-100 placeholder-slate-400"
          placeholder="Paste extra context or the content of the email here..."
        />
        {generalError && <p className="text-red-400 text-xs mt-1">{generalError}</p>}
        <p className="text-xs text-slate-400 mt-1">The AI Agent will process both the uploaded file and any text provided here to create the case plan.</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI Agent Processing...
            </>
          ) : (
            "Analyze, Plan & Draft Responses"
          )}
        </button>
      </div>
    </form>
  );
};
