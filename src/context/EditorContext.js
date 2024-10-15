"use client";

import React, { createContext, useState, useContext } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [selectedCode, setSelectedCode] = useState('');

  return (
    <EditorContext.Provider value={{ selectedCode, setSelectedCode }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
