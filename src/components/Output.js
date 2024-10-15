"use client";

import { useEditor } from '../context/EditorContext';

export default function Output() {
  const { selectedCode } = useEditor();

  return (
    <div className="output-container bg-white p-4 rounded-lg shadow-lg h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-2 text-blue-600">Selected Code:</h3>
      <pre className="bg-gray-100 p-4 rounded">{selectedCode || 'No code selected'}</pre>
    </div>
  );
}
