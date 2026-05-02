import React, { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { useEditorInstance } from './editor/editorContext'

export default function LeftSidebar(){
  const { leftOpen, toggleLeft, leftTab, setLeftTab } = useStore()
  const editor = useEditorInstance()
  const [pages, setPages] = useState<Array<{label:string; pos:number}>>([])
  const [headings, setHeadings] = useState<Array<{text:string; level:number; pos:number}>>([])

  // compute pages by approximate character chunks
  useEffect(()=>{
    if (!editor) return
    const charsPerPage = 1400
    const parts: Array<{label:string; pos:number}> = []
    let acc = ''
    let docPos = 0
    editor.state.doc.descendants((node, offset) => {
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
    <aside className={`left-sidebar ${leftOpen ? 'open' : 'collapsed'}`}>
      {leftOpen && (
        <>
          <div className="sidebar-tabs">
            <button 
              onClick={()=>setLeftTab('outline')} 
              className={leftTab==='outline' ? 'active' : ''}
            >
              Outline
            </button>
            <button 
              onClick={()=>setLeftTab('pages')} 
              className={leftTab==='pages' ? 'active' : ''}
            >
              Pages
            </button>
            <button onClick={toggleLeft} className="sidebar-collapse-btn" title="Close sidebar">✕</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
            {leftTab === 'pages' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                {pages.length ? pages.map((p,i)=> (
                  <div key={i} onClick={()=>goTo(p.pos)} className="page-thumb">
                    <div className="page-thumb-card">
                      {/* Simulated text lines */}
                      {Array.from({length: 12 + Math.floor(Math.random()*6)}).map((_,li)=> (
                        <div key={li} className="page-thumb-line" style={{width: `${30 + Math.floor(Math.random()*65)}%`}} />
                      ))}
                    </div>
                    <div className="page-thumb-number">{i+1}</div>
                  </div>
                )) : <div style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', padding: 16 }}>No pages</div>}
              </div>
            )}

            {leftTab === 'outline' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {headings.length ? headings.map((h,i)=> (
                  <div 
                    key={i} 
                    onClick={()=>goTo(h.pos)} 
                    className="outline-item"
                    style={{ paddingLeft: (h.level-1) * 16 + 8 }}
                  >
                    <span style={{ 
                      fontWeight: h.level===1 ? 600 : 400, 
                      color: h.level===1 ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 12
                    }}>{h.text}</span>
                  </div>
                )) : <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: 8 }}>No headings found</div>}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  )
}
