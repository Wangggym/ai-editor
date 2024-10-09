'use client'

import { useEffect, useRef, useState } from 'react'

const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'python', 'html', 'css', 'json']

const CODE_SNIPPETS = {
  typescript: `// TypeScript Demo
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const john: Person = { name: "John", age: 30 };
console.log(greet(john));`,

  javascript: `// JavaScript Demo
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

  python: `# Python Demo
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print([x for x in range(20) if is_prime(x)])`,

  html: `<!-- HTML Demo -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`,

  css: `/* CSS Demo */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  background: #333;
  color: #fff;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}`,

  json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "married": false,
  "education": {
    "degree": "Bachelor's",
    "major": "Computer Science"
  }
}`
}

export default function Editor() {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const [language, setLanguage] = useState('typescript')
  const decorationsRef = useRef([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('monaco-editor').then(monaco => {
        monacoRef.current = monaco
        if (!editorRef.current) {
          editorRef.current = monaco.editor.create(document.getElementById('editor-container'), {
            value: CODE_SNIPPETS[language],
            language: language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            fontSize: 14,
            tabSize: 2,
            wordWrap: 'on',
            contextmenu: true,
            rulers: [80, 120],
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true,
            snippetSuggestions: 'inline',
            formatOnPaste: true,
            formatOnType: true,
          })

          // 添加键盘快捷键
          editorRef.current.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
            () => {
              selectAndHighlightCodeBlock()
            }
          )
        } else {
          updateLanguage(language)
        }
      })
    }
    
    return () => {
      editorRef.current?.dispose()
      clearDecorations()
    }
  }, [])

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      updateLanguage(language)
    }
  }, [language])

  const updateLanguage = (newLanguage) => {
    if (editorRef.current && monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), newLanguage)
      editorRef.current.setValue(CODE_SNIPPETS[newLanguage])
    }
  }

  const clearDecorations = () => {
    if (editorRef.current) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [])
    }
  }

  const selectAndHighlightCodeBlock = () => {
    if (editorRef.current && monacoRef.current) {
      const editor = editorRef.current
      const monaco = monacoRef.current
      
      // 清除之前的高亮
      clearDecorations()

      // 保存当前的选择和光标位置
      const currentSelection = editor.getSelection()
      const currentPosition = editor.getPosition()

      // 使用编辑器的智能括号选择功能
      editor.trigger('keyboard', 'editor.action.smartSelect.expand', null)
      
      // 获取新的选择范围
      const newSelection = editor.getSelection()
      
      // 创建新的装饰器
      const newDecorations = [
        {
          range: new monaco.Range(
            newSelection.startLineNumber,
            newSelection.startColumn,
            newSelection.endLineNumber,
            newSelection.endColumn
          ),
          options: {
            isWholeLine: false,
            className: 'myCodeBlockHighlight',
            minimap: {
              color: { red: 64, green: 64, blue: 64, alpha: 0.4 },
              position: monaco.editor.MinimapPosition.Inline
            }
          }
        }
      ]

      // 应用新的装饰器
      decorationsRef.current = editor.deltaDecorations([], newDecorations)

      // 恢复原来的选择和光标位置
      if (currentSelection.isEmpty()) {
        editor.setPosition(currentPosition)
      } else {
        editor.setSelection(currentSelection)
      }
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