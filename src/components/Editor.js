'use client'

import { useEffect, useRef, useState } from 'react'
import { CODE_SNIPPETS } from '../utils/codeSnippets'
import { selectCodeBlock, getCurrentCodeBlock } from '../utils/editorUtils'

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'python', 'html', 'css', 'json']

export default function Editor() {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const [language, setLanguage] = useState('typescript')
  const [isEditorReady, setIsEditorReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('monaco-editor').then(monaco => {
        monacoRef.current = monaco
        initializeEditor(monaco)
      })
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (isEditorReady) {
      updateEditorLanguage()
    }
  }, [language, isEditorReady])

  const initializeEditor = (monaco) => {
    if (!editorRef.current) {
      editorRef.current = monaco.editor.create(document.getElementById('editor-container'), {
        value: CODE_SNIPPETS[language],
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
      })
      setIsEditorReady(true)
      // Remove the initial selection
      // selectCodeBlock(editorRef.current, monaco, 1, 5)

      // Add Cmd+K shortcut
      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
        const { startLine, endLine } = getCurrentCodeBlock(editorRef.current, monaco);
        selectCodeBlock(editorRef.current, monaco, startLine, endLine);
      })
    }
  }

  const updateEditorLanguage = () => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel()
      monacoRef.current.editor.setModelLanguage(model, language)
      editorRef.current.setValue(CODE_SNIPPETS[language])
      // Remove the automatic re-selection
      // selectCodeBlock(editorRef.current, monacoRef.current, 1, 5)
    }
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  const randomlySelectCodeBlock = () => {
    if (editorRef.current && monacoRef.current) {
      selectCodeBlock(editorRef.current, monacoRef.current)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <select 
          value={language} 
          onChange={handleLanguageChange}
          className="bg-gray-700 text-white p-2 rounded"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        <button 
          onClick={randomlySelectCodeBlock}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Randomly Select Code Block
        </button>
      </div>
      <div id="editor-container" className="flex-grow border border-gray-300 rounded-lg shadow-lg"></div>
    </div>
  )
}
