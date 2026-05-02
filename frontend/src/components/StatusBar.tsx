import React, { useEffect, useState } from 'react'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import { useDoc } from '../contexts/documentContext'
import { useAutoSave } from '../hooks/useAutoSave'
import { useSettings } from '../contexts/settingsContext'

export default function StatusBar(){
  const editor = useEditorInstance()
  const zoom = useStore(s=>s.zoom)
  const setZoom = useStore(s=>s.setZoom)
  const doc = useDoc()
  const { settings } = useSettings()
  const { isSaving } = useAutoSave(settings.autoSaveInterval)
  const [wordCount, setWordCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(()=>{
    if (!editor) return
    const update = ()=>{
      const text = editor.getText() || ''
      const words = text.trim().split(/\s+/).filter(Boolean).length
      setWordCount(words)
      // estimate pages
      const charsPerPage = 1400
      const pages = Math.max(1, Math.ceil(text.length / charsPerPage))
      setPageCount(pages)
    }
    update()
    editor.on('update', update)
    editor.on('transaction', update)
    return ()=>{ editor.off('update', update); editor.off('transaction', update) }
  },[editor])

  return (
    <div className="h-10 bg-panel border-t border-black/20 flex items-center px-4 text-sm text-text-secondary">
      <div className="flex-1 flex items-center gap-4">
        <span>Page {doc.state ? Math.min(pageCount, pageCount) : 1} of {pageCount} • {wordCount} words</span>
        {settings.enableAutoSave && (
          <span className={`text-xs transition ${isSaving ? 'text-yellow-400 animate-pulse' : 'text-text-secondary'}`}>
            {isSaving ? '💾 Auto-saving...' : '✓ Auto-save ready'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div>EN</div>
        <div className="flex items-center gap-1">
          <button onClick={()=>setZoom(Math.max(0.5, zoom-0.1))} className="px-2 py-1 rounded hover:bg-white/5">-</button>
          <div>{Math.round(zoom*100)}%</div>
          <button onClick={()=>setZoom(Math.min(2, zoom+0.1))} className="px-2 py-1 rounded hover:bg-white/5">+</button>
        </div>
      </div>
    </div>
  )
}
