'use client'

import { useEffect, useRef, useState } from 'react'
import { CODE_SNIPPETS } from '../utils/codeSnippets'

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'python', 'html', 'css', 'json']

export default function Editor() {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const [language, setLanguage] = useState('javascript')
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
    }
  }

  const updateEditorLanguage = () => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel()
      monacoRef.current.editor.setModelLanguage(model, language)
      editorRef.current.setValue(CODE_SNIPPETS[language])
    }
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
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
      </div>
      <div id="editor-container" className="flex-grow border border-gray-300 rounded-lg shadow-lg"></div>
    </div>
  )
}
