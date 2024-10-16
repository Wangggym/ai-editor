"use client";

import { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { getAIResponse } from '../services/openaiService';

export default function Output() {
  const { selectedCode, setModifiedCode } = useEditor();
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAiResponse('');
    console.log('Submitting request');

    try {
      console.log('Calling OpenAI API');
      const response = await getAIResponse(selectedCode, userInput);
      console.log('OpenAI API response received');
      setAiResponse(response);
      setModifiedCode(response); // Set the modified code in the context
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="output-container bg-white p-4 rounded-lg shadow-lg h-full overflow-auto flex flex-col">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">Selected Code:</h3>
      <pre className="bg-gray-100 p-4 rounded mb-4 flex-grow overflow-auto">{selectedCode || 'No code selected'}</pre>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your request (e.g., 'fix it', '声明一个类型')"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={isLoading || !selectedCode}
          className="mt-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          <h4 className="text-lg font-semibold mb-2">Error:</h4>
          <pre className="bg-red-100 p-4 rounded overflow-auto">{error}</pre>
        </div>
      )}

      {aiResponse && (
        <div>
          <h4 className="text-lg font-semibold mb-2 text-green-600">Modified Code:</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">{aiResponse}</pre>
        </div>
      )}
    </div>
  );
}
