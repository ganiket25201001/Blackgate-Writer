import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorInstance } from './editorContext'
import { useStore } from '../../store/useStore'

export default function EditorCanvas(){
  const editor = useEditorInstance()
  const zoom = useStore(s=>s.zoom)
  return (
    <div className="w-full flex justify-center">
      <div className="relative">
        {/* Ruler (visual only) */}
        <div className="h-6 w-full flex items-center justify-center text-xs text-text-secondary select-none">
          <div className="w-[800px] border-b border-black/20"></div>
        </div>
        <div className="editor-page p-8 mt-2" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {editor ? <EditorContent editor={editor} /> : <div>Loading editor...</div>}
        </div>
      </div>
    </div>
  )
}
