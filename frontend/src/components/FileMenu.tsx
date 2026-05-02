import React, { useState, useRef, useEffect } from 'react'
import { useDoc } from '../contexts/documentContext'
import { useRecentFiles } from '../hooks/useRecentFiles'
import TemplateSelector from './TemplateSelector'

export default function FileMenu(){
  const [open, setOpen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const doc = useDoc()
  const { recentFiles, addRecentFile, clearRecentFiles } = useRecentFiles()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!open) return
    function handleClick(e: MouseEvent){
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return ()=> document.removeEventListener('mousedown', handleClick)
  },[open])

  const menuItemStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '6px 12px',
    borderRadius: 3,
    fontSize: 12,
    color: 'var(--text-primary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  }

  return (
    <>
      <div className="relative" ref={ref} style={{ position: 'relative' }}>
        <button 
          onClick={()=>setOpen(v=>!v)} 
          style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', borderRadius: 0 }}
          onMouseEnter={(e)=>(e.currentTarget.style.color='var(--text-primary)')}
          onMouseLeave={(e)=>(e.currentTarget.style.color='var(--text-secondary)')}
        >
          File
        </button>
        {open && (
          <div className="dropdown-menu" style={{ top: '100%', left: 0, minWidth: 220, marginTop: 4 }}>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={()=>{ doc.newDoc(); setOpen(false) }}>New</button>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={()=>{ setShowTemplates(true); setOpen(false) }}>New from Template...</button>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={async ()=>{ await doc.openDoc(); setOpen(false) }}>Open...</button>
            
            {recentFiles.length > 0 && (
              <>
                <div style={{ borderTop: '1px solid var(--border-strong)', margin: '4px 0' }} />
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', padding: '4px 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Files</div>
                {recentFiles.slice(0, 5).map((file, idx) => (
                  <button
                    key={idx}
                    style={{...menuItemStyle, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                    onMouseLeave={e=>e.currentTarget.style.background='none'}
                    onClick={async ()=>{ 
                      await doc.openDoc() 
                      addRecentFile(file.path, file.title)
                      setOpen(false) 
                    }}
                    title={file.path}
                  >
                    {file.title}
                  </button>
                ))}
                {recentFiles.length > 0 && (
                  <button style={{...menuItemStyle, fontSize: 11, color: 'var(--text-secondary)'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={clearRecentFiles}>Clear Recent</button>
                )}
              </>
            )}

            <div style={{ borderTop: '1px solid var(--border-strong)', margin: '4px 0' }} />
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={async ()=>{ await doc.saveDoc(); setOpen(false) }}>Save</button>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={async ()=>{ await doc.saveAs(); setOpen(false) }}>Save As...</button>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={async ()=>{ await doc.exportPdf(); setOpen(false) }}>Export → PDF</button>
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={async ()=>{ await doc.exportDocx(); setOpen(false) }}>Export → DOCX</button>
            <div style={{ borderTop: '1px solid var(--border-strong)', margin: '4px 0' }} />
            <button style={menuItemStyle} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='none'} onClick={()=>{ window.close() }}>Exit</button>
          </div>
        )}
      </div>
      
      {showTemplates && (
        <TemplateSelector onClose={()=>setShowTemplates(false)} />
      )}
    </>
  )
}
