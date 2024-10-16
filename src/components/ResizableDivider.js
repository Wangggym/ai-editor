import { useState, useCallback, useEffect } from 'react';

const ResizableDivider = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        onResize(e.clientX);
      }
    },
    [isDragging, onResize]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`w-2 cursor-col-resize transition-colors ${
        isDragging ? 'bg-blue-500' : 'bg-gray-300 hover:bg-blue-300'
      }`}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ResizableDivider;
