'use client';

import * as diff from 'diff';
import { useState } from 'react';


export default function Diff() {
  const [text1, setText1] = useState('beep boop');
  const [text2, setText2] = useState('beep boob blah');
  const [diffResult, setDiffResult] = useState([]);

  const handleDiff = async () => {
    if (diff) {
      const diffResult = await diff.diffChars(text1, text2);
      setDiffResult(diffResult);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Text Diff Example</h1>
      <div className="mb-4">
        <input
          type="text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="border p-2"
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
          <span
            key={index}
            style={{
              backgroundColor: part.added
                ? 'lightgreen'
                : part.removed
                  ? 'lightcoral'
                  : 'transparent',
            }}
          >
            {part.value}
          </span>
        ))}
      </div>
    </div>
  );
}
