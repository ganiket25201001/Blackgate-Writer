import React, { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { useEditorInstance } from './editor/editorContext'

export default function LeftSidebar(){
  const { leftOpen, toggleLeft, leftTab, setLeftTab } = useStore()
  const editor = useEditorInstance()
  const [pages, setPages] = useState<Array<{label:string; pos:number}>>([])
  const [headings, setHeadings] = useState<Array<{text:string; level:number; pos:number}>>([])

  // compute pages by approximate character chunks and map to document positions
  useEffect(()=>{
    if (!editor) return
    const text = editor.getText() || ''
    const charsPerPage = 1400
    const parts: Array<{label:string; pos:number}> = []
    let acc = ''
    let pos = 0
    let docPos = 0
    editor.state.doc.descendants((node, offset, index) => {
      const nodeText = node.textContent || ''
      if (acc.length + nodeText.length > charsPerPage){
        parts.push({ label: acc.slice(0,80).replace(/\n/g,' ')+ (acc.length>80? '...':''), pos: docPos })
        acc = nodeText
        docPos = offset
      } else {
        acc += nodeText
      }
      return true
    })
    if (acc.length) parts.push({ label: acc.slice(0,80).replace(/\n/g,' ')+ (acc.length>80? '...':''), pos: docPos })
    setPages(parts)
  },[editor?.getHTML(), editor])

  // compute headings outline
  useEffect(()=>{
    if (!editor) return
    const list: Array<{text:string; level:number; pos:number}> = []
    editor.state.doc.descendants((node, offset)=>{
      if (node.type.name === 'heading'){
        const level = node.attrs.level || 1
        const text = node.textContent || ''
        list.push({ text, level, pos: offset })
      }
      return true
    })
    setHeadings(list)
  },[editor?.getHTML(), editor])

  function goTo(pos:number){
    if (!editor) return
    editor.chain().focus().setTextSelection(pos).scrollIntoView().run()
  }

  return (
    <aside className={`transition-all duration-300 ${leftOpen ? 'w-64 p-3' : 'w-12 p-2'} bg-panel border-r border-black/20 overflow-auto`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`${leftOpen ? 'font-semibold' : 'hidden'}`}>Navigation</div>
        <div className="flex gap-1">
          <button onClick={()=>setLeftTab('pages')} className={`px-2 py-1 rounded ${leftTab==='pages' ? 'bg-bg' : 'hover:bg-white/5'}`}>P</button>
          <button onClick={()=>setLeftTab('outline')} className={`px-2 py-1 rounded ${leftTab==='outline' ? 'bg-bg' : 'hover:bg-white/5'}`}>O</button>
          <button onClick={toggleLeft} title={leftOpen ? 'Collapse' : 'Expand'} className="px-2 py-1 rounded hover:bg-white/5">{leftOpen? '<':''} </button>
        </div>
      </div>

      {leftOpen && leftTab === 'pages' && (
        <div>
          <div className="text-xs text-text-secondary mb-2">Pages</div>
          <div className="space-y-3">
            {pages.length ? pages.map((p,i)=> (
              <div key={i} onClick={()=>goTo(p.pos)} className="bg-white/3 rounded p-2 cursor-pointer hover:bg-white/5">
                <div className="text-sm font-semibold">Page {i+1}</div>
                <div className="text-xs text-text-secondary truncate">{p.label}</div>
              </div>
            )) : <div className="text-sm text-text-secondary">No pages</div>}
          </div>
        </div>
      )}

      {leftOpen && leftTab === 'outline' && (
        <div>
          <div className="text-xs text-text-secondary mb-2">Outline</div>
          <div className="space-y-2">
            {headings.length ? headings.map((h,i)=> (
              <div key={i} onClick={()=>goTo(h.pos)} className="cursor-pointer hover:bg-white/5 rounded p-1">
                <div className={`text-sm ${h.level===1? 'font-semibold':'text-text-secondary'} ml-${(h.level-1)*2}`}>{h.text}</div>
              </div>
            )) : <div className="text-sm text-text-secondary">No headings</div>}
          </div>
        </div>
      )}
    </aside>
  )
}
