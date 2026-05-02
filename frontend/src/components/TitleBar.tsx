import React, { useState, useRef, useEffect } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import Logo from '../assets/logo.png'
import { useDoc } from '../contexts/documentContext'
import { Search } from 'lucide-react'

export default function TitleBar({ onShowAbout, onShowSettings }: { onShowAbout?: ()=>void; onShowSettings?: ()=>void }){
  const { state, quickSaveToDocuments } = useDoc()
  const [searchFocused, setSearchFocused] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(state.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTempTitle(state.title)
  }, [state.title])

  const handleTitleSubmit = () => {
    setEditingTitle(false)
    if (tempTitle.trim() && tempTitle !== state.title) {
      quickSaveToDocuments(tempTitle.trim())
    } else {
      setTempTitle(state.title)
    }
  }

  useEffect(() => {
    // Listen for the custom about event from the Help ribbon
    const handleAbout = () => onShowAbout?.()
    document.addEventListener('show-about', handleAbout)
    return () => document.removeEventListener('show-about', handleAbout)
  }, [onShowAbout])

  return (
    <div className="titlebar">
      <div className="titlebar-logo">
        <img src={Logo} alt="Blackgate" />
        <span>BLACKGATE Writer</span>
      </div>
      
      <div className="titlebar-center">
        {/* Search Bar */}
        <div 
          className="titlebar-search" 
          onClick={()=>inputRef.current?.focus()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: searchFocused ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)',
            padding: '2px 8px', borderRadius: 4, width: 240, height: 26,
            border: searchFocused ? '1px solid var(--accent)' : '1px solid transparent',
            transition: 'all 0.15s ease',
            cursor: 'text'
          }}
        >
          <Search size={12} style={{ color: searchFocused ? '#666' : 'rgba(255,255,255,0.6)' }} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search" 
            onFocus={()=>setSearchFocused(true)}
            onBlur={()=>setSearchFocused(false)}
            onKeyDown={(e)=>{
              if (e.key === 'Enter') {
                // Trigger Find functionality
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true }))
                e.currentTarget.blur()
              }
            }}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: searchFocused ? '#000' : 'rgba(255,255,255,0.9)',
              fontSize: 12, width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>
          {editingTitle ? (
            <input 
              autoFocus
              value={tempTitle}
              onChange={e=>setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={e=>{ if(e.key==='Enter') handleTitleSubmit(); else if(e.key==='Escape'){ setTempTitle(state.title); setEditingTitle(false); } }}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--accent)', color: 'white', borderRadius: 3, padding: '2px 4px', fontSize: 13, width: 140, outline: 'none' }}
            />
          ) : (
            <span 
              style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 13, cursor: 'pointer', padding: '2px 4px', borderRadius: 3 }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              onClick={()=>setEditingTitle(true)}
              title="Click to rename and quick save"
            >
              {state.title}
            </span>
          )}
          <span style={{ color: 'var(--text-secondary)' }}>·</span>
          <span style={{ color: state.saved ? 'var(--text-secondary)' : '#fbbf24', fontSize: 11 }}>
            {state.saved ? 'Saved' : 'Saving...'}
          </span>
        </div>
      </div>

      <div className="titlebar-controls">
        <button title="Minimize" onClick={()=>appWindow.minimize()}>—</button>
        <button title="Maximize" onClick={()=>appWindow.toggleMaximize()}>□</button>
        <button className="close-btn" title="Close" onClick={()=>appWindow.close()}>✕</button>
      </div>
    </div>
  )
}
