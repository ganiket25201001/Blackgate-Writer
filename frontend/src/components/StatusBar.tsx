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
    <div className="h-8 bg-[#1f1f1f] border-t border-black/20 flex items-center justify-between px-4 text-xs text-text-secondary select-none">
      <div className="flex items-center gap-6">
        <span>Page {doc.state ? Math.min(pageCount, pageCount) : 1} of {pageCount}</span>
        <span>{wordCount.toLocaleString()} words</span>
        <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded">
          <FileText size={14} className="opacity-70"/>
          English (United States)
        </button>
        {settings.enableAutoSave && (
          <span className={`transition ${isSaving ? 'text-yellow-400 animate-pulse' : 'text-text-secondary/50'}`}>
            {isSaving ? 'Saving...' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-white/10 pr-4">
          <button className="p-1.5 hover:bg-white/10 rounded" title="Read Mode"><BookOpen size={14} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded bg-white/10 text-blue-400" title="Print Layout"><FileText size={14} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded" title="Web Layout"><Globe size={14} /></button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={()=>setZoom(Math.max(0.5, zoom-0.1))} className="px-2 py-1 hover:bg-white/10 rounded font-bold">−</button>
          <input type="range" min="0.5" max="2" step="0.1" value={zoom} onChange={e=>setZoom(Number(e.target.value))} className="w-24 accent-blue-500 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer" />
          <button onClick={()=>setZoom(Math.min(2, zoom+0.1))} className="px-2 py-1 hover:bg-white/10 rounded font-bold">+</button>
          <div className="w-10 text-right">{Math.round(zoom*100)}%</div>
        </div>
      </div>
    </div>
  )
}
