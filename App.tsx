
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { DocumentInputForm } from './components/DocumentInputForm';
import { ProcessingResults } from './components/ProcessingResults';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Alert } from './components/Alert';
import { AutomatedWorkflowResult, DocumentDetails } from './types';
import { analyzeDocumentWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [workflowResult, setWorkflowResult] = useState<AutomatedWorkflowResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string>('');

  const handleProcessDocument = useCallback(async (details: DocumentDetails) => {
    setIsLoading(true);
    setError(null);
    setWorkflowResult(null);
    setCurrentCaseId(details.caseId); 

    try {
      if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set or process.env is not accessible. Please ensure it's configured in your environment.");
      }
      // Pass the entire details object (content, caseId, and fileData)
      const result = await analyzeDocumentWithGemini(details);
      setWorkflowResult(result);
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during document analysis.");
      setWorkflowResult(null); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8">
          <DocumentInputForm onSubmit={handleProcessDocument} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
            <div className="ml-4">
              <p className="text-xl font-semibold text-sky-400">Casewrite AI Agent Working...</p>
              <p className="text-sm text-slate-400">Reading document, checking handwriting, drafting letters, and updating case plan.</p>
            </div>
          </div>
        )}

        {workflowResult && !isLoading && (
          <div className="mt-8 bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6 text-sky-400 border-b-2 border-sky-500 pb-2">Casewrite AI Workflow Results for Case ID: {currentCaseId}</h2>
            <ProcessingResults result={workflowResult} />
          </div>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-slate-400">
        Powered by Gemini API & React. Employee Disability Case Management Assistant.
      </footer>
    </div>
  );
};

export default App;
