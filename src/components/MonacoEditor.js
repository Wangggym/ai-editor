'use client'

import { useEffect, useRef, useState } from 'react'
import { selectCodeBlock, getCurrentCodeBlock } from '../utils/editorUtils'
import { useEditor } from '../context/EditorContext'

export default function MonacoEditor({ language, initialValue, onEditorReady }) {
    const editorRef = useRef(null)
    const monacoRef = useRef(null)
    const [isEditorReady, setIsEditorReady] = useState(false)
    const [currentRange, setCurrentRange] = useState(null)
    const { setSelectedCode, modifiedCode, setModifiedCode } = useEditor()

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

    useEffect(() => {
        if (isEditorReady && modifiedCode) {
            updateEditorContent(modifiedCode, currentRange)
        }
    }, [modifiedCode, isEditorReady, currentRange])

    const initializeEditor = (monaco) => {
        if (!editorRef.current) {
            editorRef.current = monaco.editor.create(document.getElementById('monaco-editor-container'), {
                value: initialValue,
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,
            })
            setIsEditorReady(true)
            onEditorReady(editorRef.current, monaco)

            // Add Cmd+K shortcut
            editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
                const { startLine, endLine } = getCurrentCodeBlock(editorRef.current, monaco);
                const range = selectCodeBlock(editorRef.current, monaco, startLine, endLine);
                setCurrentRange(range);

                // Get the selected text
                const selectedText = editorRef.current.getModel().getValueInRange(range);
                setSelectedCode(selectedText);
            })

            // Listen for selection changes
            // editorRef.current.onDidChangeCursorSelection((e) => {
            //     if (e.selection && !e.selection.isEmpty()) {
            //         setCurrentRange(e.selection);
            //         const selectedText = editorRef.current.getModel().getValueInRange(e.selection);
            //         setSelectedCode(selectedText);
            //     }
            // });
        }
    }

    const updateEditorLanguage = () => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel()
            monacoRef.current.editor.setModelLanguage(model, language)
        }
    }

    const randomlySelectCodeBlock = () => {
        if (editorRef.current && monacoRef.current) {
            const range = selectCodeBlock(editorRef.current, monacoRef.current)
            setCurrentRange(range)
        }
    }

    // Updated method to update editor content
    const updateEditorContent = (newContent, range) => {
        if (editorRef.current && newContent) {
            const model = editorRef.current.getModel();
            if (model) {
                try {
                    if (!range || range.isEmpty()) {
                        range = model.getFullModelRange();
                    }
                    editorRef.current.executeEdits('update-content', [{
                        range: range,
                        text: newContent,
                    }]);
                    setModifiedCode("");
                } catch (error) {
                    console.error("Error updating editor content:", error);
                }
            }
        }
    }

    return (
        <div id="monaco-editor-container" className="h-full border border-gray-300 rounded-lg shadow-lg"></div>
    )
}
