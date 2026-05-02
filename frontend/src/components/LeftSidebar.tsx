import React, { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { useEditorInstance } from './editor/editorContext'

export default function LeftSidebar(){
  const { leftOpen, toggleLeft, leftTab, setLeftTab } = useStore()
  const editor = useEditorInstance()
  const [pages, setPages] = useState<Array<{label:string; pos:number}>>([])
  const [headings, setHeadings] = useState<Array<{text:string; level:number; pos:number}>>([])

  // compute pages by actual DOM height
  useEffect(()=>{
    if (!editor) return
    const el = document.querySelector('.editor-page')
    const h = el ? el.clientHeight : 1123
    const count = Math.max(1, Math.ceil(h / 1143))
    setPages(Array.from({length: count}).map((_, i) => ({ label: `Page ${i+1}`, pos: 0 })))
  },[editor?.state.doc.textContent, editor])

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
                    <div className="page-thumb-card" style={{ padding: 0, position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: 794,
                        height: 1123,
                        transform: 'scale(0.1385)',
                        transformOrigin: 'top left',
                        background: 'white',
                        padding: '48px',
                        pointerEvents: 'none',
                        color: 'black',
                        fontSize: '14px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          className="tiptap" 
                          dangerouslySetInnerHTML={{__html: editor?.getHTML() || ''}} 
                          style={{
                            transform: `translateY(-${i * 1143}px)`
                          }}
                        />
                      </div>
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
