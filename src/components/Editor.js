'use client'

import { useState } from 'react'
import { CODE_SNIPPETS } from '../utils/codeSnippets'
import MonacoEditor from './MonacoEditor'

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'python', 'html', 'css', 'json']

export default function Editor() {
  const [language, setLanguage] = useState('typescript')
  const [editor, setEditor] = useState(null)
  const [monaco, setMonaco] = useState(null)

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    if (editor && monaco) {
      editor.setValue(CODE_SNIPPETS[e.target.value])
    }
  }

  const handleEditorReady = (editorInstance, monacoInstance) => {
    setEditor(editorInstance)
    setMonaco(monacoInstance)
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
      </div>
      <MonacoEditor
        language={language}
        initialValue={CODE_SNIPPETS[language]}
        onEditorReady={handleEditorReady}
      />
    </div>
  )
}
