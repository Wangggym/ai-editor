'use client';

import * as diff from 'diff';
import { useState } from 'react';


export default function Diff() {
  const [text1, setText1] = useState('beep boop');
  const [text2, setText2] = useState('beep boob blah');
  const [diffResult, setDiffResult] = useState([]);

  const handleDiff = async () => {
    if (diff) {
      const diffResult = await diff.diffLines(text1, text2);
      setDiffResult(diffResult);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text Diff Example</h1>
      <div className="mb-4">
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="border p-2 mr-2 w-full h-32"
        />
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="border p-2 w-full h-32 mt-2"
        />
      </div>
      <button
        onClick={handleDiff}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Compare
      </button>
      <div className="mt-4">
        {diffResult.map((part, index) => (
          <div
            key={index}
            className={`${
              part.added
                ? 'bg-green-100'
                : part.removed
                ? 'bg-red-100'
                : ''
            } ${part.added || part.removed ? 'py-1' : ''}`}
          >
            {part.value.split('\n').map((line, lineIndex) => (
              <div key={lineIndex}>
                {part.added && <span className="text-green-700">+ </span>}
                {part.removed && <span className="text-red-700">- </span>}
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
