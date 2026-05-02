import React, { useEffect, useState, useCallback } from 'react'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import { useSettings } from '../contexts/settingsContext'
import { useAutoSave } from '../hooks/useAutoSave'

import { BookOpen, FileText, Globe, Columns } from 'lucide-react'

export default function StatusBar(){
  const editor = useEditorInstance()
  const zoom = useStore(s=>s.zoom)
  const setZoom = useStore(s=>s.setZoom)
  const { settings } = useSettings()
  const { isSaving } = useAutoSave(settings.autoSaveInterval)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lineCount, setLineCount] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })
  const [viewMode, setViewMode] = useState<'read'|'print'|'web'>('print')

  const updateStats = useCallback(()=>{
    if (!editor) return
    const text = editor.state.doc.textContent || ''
    const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)
    setCharCount(text.length)
    const lines = text.split('\n').length
    setLineCount(lines)
    const charsPerPage = 1800
    setPageCount(Math.max(1, Math.ceil(text.length / charsPerPage)))

    // cursor position
    try {
      const { from } = editor.state.selection
      const resolved = editor.state.doc.resolve(from)
      const lineNum = resolved.depth > 0 ? resolved.index(0) + 1 : 1
      setCursorPos({ line: lineNum, col: resolved.parentOffset + 1 })
    } catch {}
  }, [editor])

  useEffect(()=>{
    if (!editor) return
    updateStats()
    editor.on('transaction', updateStats)
    return ()=>{ 
      editor.off('transaction', updateStats)
    }
  },[editor, updateStats])

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span>Page {Math.min(pageCount, pageCount)} of {pageCount}</span>
        <span className="status-sep">|</span>
        <span>{wordCount.toLocaleString()} words</span>
        <span className="status-sep">|</span>
        <span>{charCount.toLocaleString()} characters</span>
        <span className="status-sep">|</span>
        <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
        <span className="status-sep">|</span>
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
          <button className={viewMode==='read' ? 'view-active' : ''} title="Read Mode" onClick={()=>setViewMode('read')}><BookOpen size={13} /></button>
          <button className={viewMode==='print' ? 'view-active' : ''} title="Print Layout" onClick={()=>setViewMode('print')}><FileText size={13} /></button>
          <button className={viewMode==='web' ? 'view-active' : ''} title="Web Layout" onClick={()=>setViewMode('web')}><Globe size={13} /></button>
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
