import React, { createContext, useContext } from 'react'
import type { Editor } from '@tiptap/react'

const EditorContext = createContext<Editor | null>(null)

export function EditorProvider({ editor, children }: { editor: Editor | null; children: React.ReactNode }){
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
}

export function useEditorInstance(){
  return useContext(EditorContext)
}
