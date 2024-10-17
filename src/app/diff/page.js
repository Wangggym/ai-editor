'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the entire diff library
const DiffLib = dynamic(() => import('diff'), { ssr: false });

export default function DiffDemo() {
  const [oldText, setOldText] = useState('Hello Worldddedwdewd');
  const [newText, setNewText] = useState('Hello Claude');
  const [diff, setDiff] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateDiff = async () => {
      try {
        const diffLib = await DiffLib;
        const diffResult = diffLib.diffChars(oldText, newText);
        console.log('Diff result:', diffResult); // For debugging
        setDiff(diffResult);
        setError(null);
      } catch (err) {
        console.error('Error calculating diff:', err);
        setError('Error calculating diff. Please try again.');
      }
    };

    calculateDiff();
  }, [oldText, newText]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">jsdiff Demo</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Old Text:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            rows="4"
          />
        </div>
        <div>
          <label className="block mb-2">New Text:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows="4"
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Diff Result:</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {Array.isArray(diff) ? (
                diff.map((part, index) => (
                  <span
                    key={index}
                    className={`
                      ${part.added ? 'bg-green-200 text-green-800' : ''}
                      ${part.removed ? 'bg-red-200 text-red-800' : ''}
                      ${!part.added && !part.removed ? 'bg-gray-200 text-gray-800' : ''}
                      px-1 py-0.5 rounded
                    `}
                  >
                    {part.value}
                  </span>
                ))
              ) : (
                <span>No diff available or diff is not an array</span>
              )}
            </pre>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Character-by-Character Diff:</h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre className="whitespace-pre-wrap">
            {Array.isArray(diff) ? (
              diff.map((part, index) => (
                <span key={index}>
                  {part.value.split('').map((char, charIndex) => (
                    <span
                      key={`${index}-${charIndex}`}
                      className={`
                        ${part.added ? 'bg-green-200 text-green-800' : ''}
                        ${part.removed ? 'bg-red-200 text-red-800' : ''}
                        ${!part.added && !part.removed ? 'bg-gray-200 text-gray-800' : ''}
                        px-0.5 py-0.5 rounded m-0.5
                      `}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))
            ) : (
              <span>No diff available or diff is not an array</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
