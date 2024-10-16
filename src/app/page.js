'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic'
import Output from '../components/Output'
import ResizableDivider from '../components/ResizableDivider'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

export default function Home() {
  const [editorWidth, setEditorWidth] = useState(75); // Initial width percentage
  const containerRef = useRef(null);

  const handleResize = useCallback((clientX) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((clientX - containerRect.left) / containerRect.width) * 100;
      setEditorWidth(Math.max(20, Math.min(80, newWidth))); // Limit between 20% and 80%
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Force a re-render to update the layout
      setEditorWidth(prev => prev);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-grow flex p-4" ref={containerRef}>
        <div style={{ width: `${editorWidth}%` }}>
          <Editor />
        </div>
        <ResizableDivider onResize={handleResize} />
        <div style={{ width: `${100 - editorWidth}%` }}>
          <Output content="Code execution results will be displayed here" />
        </div>
      </main>
    </div>
  )
}
