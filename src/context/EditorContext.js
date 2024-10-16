"use client";

import React, { createContext, useState, useContext } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');

  return (
    <EditorContext.Provider value={{ selectedCode, setSelectedCode, modifiedCode, setModifiedCode }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
