import React, { useEffect, useState } from 'react'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import { useDoc } from '../contexts/documentContext'
import { useAutoSave } from '../hooks/useAutoSave'
import { useSettings } from '../contexts/settingsContext'

import { BookOpen, FileText, Globe } from 'lucide-react'

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
    <div className="status-bar">
      <div className="status-bar-left">
        <span>Page {Math.min(pageCount, pageCount)} of {pageCount}</span>
        <span>{wordCount.toLocaleString()} words</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <FileText size={12} style={{ opacity: 0.7 }}/>
          English (United States)
        </button>
        {settings.enableAutoSave && isSaving && (
          <span style={{ color: '#fbbf24', animation: 'pulse 1.5s infinite' }}>Saving...</span>
        )}
      </div>

      <div className="status-bar-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button title="Read Mode"><BookOpen size={13} /></button>
          <button className="view-active" title="Print Layout"><FileText size={13} /></button>
          <button title="Web Layout"><Globe size={13} /></button>
        </div>
        
        <div className="view-separator" />

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={()=>setZoom(Math.max(0.5, Math.round((zoom-0.1)*10)/10))} style={{ fontWeight: 700, fontSize: 14 }}>−</button>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={zoom} 
            onChange={e=>setZoom(Number(e.target.value))} 
            className="zoom-slider"
          />
          <button onClick={()=>setZoom(Math.min(2, Math.round((zoom+0.1)*10)/10))} style={{ fontWeight: 700, fontSize: 14 }}>+</button>
          <span style={{ width: 36, textAlign: 'right' }}>{Math.round(zoom*100)}%</span>
        </div>
      </div>
    </div>
  )
}
