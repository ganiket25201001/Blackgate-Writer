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
    <aside className={`transition-all duration-300 ${leftOpen ? 'w-64' : 'w-12'} bg-panel border-r border-black/20 flex flex-col`}>
      <div className="flex items-center justify-between border-b border-black/10">
        {leftOpen ? (
          <div className="flex flex-1 text-sm font-semibold text-text-secondary">
            <button 
              onClick={()=>setLeftTab('outline')} 
              className={`flex-1 py-3 border-b-2 text-center transition-colors ${leftTab==='outline' ? 'border-blue-500 text-text-primary' : 'border-transparent hover:text-text-primary'}`}
            >
              Outline
            </button>
            <button 
              onClick={()=>setLeftTab('pages')} 
              className={`flex-1 py-3 border-b-2 text-center transition-colors ${leftTab==='pages' ? 'border-blue-500 text-text-primary' : 'border-transparent hover:text-text-primary'}`}
            >
              Pages
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center py-2 gap-2">
            <button onClick={()=>setLeftTab('outline')} className="px-2 py-1 rounded hover:bg-white/5">O</button>
            <button onClick={()=>setLeftTab('pages')} className="px-2 py-1 rounded hover:bg-white/5">P</button>
          </div>
        )}
        <button onClick={toggleLeft} title={leftOpen ? 'Collapse' : 'Expand'} className="px-2 py-3 hover:bg-white/5 text-text-secondary hover:text-text-primary">
          {leftOpen ? '✕' : '›'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {leftOpen && leftTab === 'pages' && (
          <div className="space-y-6">
            {pages.length ? pages.map((p,i)=> (
              <div key={i} onClick={()=>goTo(p.pos)} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-32 h-44 bg-white rounded shadow-sm border border-transparent group-hover:border-blue-500 flex flex-col p-2 overflow-hidden text-[6px] text-black leading-tight opacity-90 group-hover:opacity-100">
                  {p.label.split(' ').map((word, idx) => (
                    <div key={idx} className="bg-gray-200 h-1 mb-[1px] rounded-sm w-full" style={{width: `${Math.max(20, Math.random() * 100)}%`}}></div>
                  ))}
                </div>
                <div className="text-xs font-semibold text-text-secondary group-hover:text-blue-500">{i+1}</div>
              </div>
            )) : <div className="text-sm text-text-secondary text-center">No pages</div>}
          </div>
        )}

        {leftOpen && leftTab === 'outline' && (
          <div className="space-y-2">
            {headings.length ? headings.map((h,i)=> (
              <div key={i} onClick={()=>goTo(h.pos)} className="cursor-pointer hover:bg-white/5 rounded p-1">
                <div className={`text-sm ${h.level===1? 'font-semibold text-text-primary':'text-text-secondary'} ml-${(h.level-1)*2}`}>{h.text}</div>
              </div>
            )) : <div className="text-sm text-text-secondary">No headings</div>}
          </div>
        )}
      </div>
    </aside>
  )
}
