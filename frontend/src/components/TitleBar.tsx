import React from 'react'
import Logo from '../assets/logo.png'
import { useDoc } from '../contexts/documentContext'

export default function TitleBar({ onShowAbout, onShowSettings }: { onShowAbout?: ()=>void; onShowSettings?: ()=>void }){
  const { state } = useDoc()

  return (
    <div className="titlebar">
      <div className="titlebar-logo">
        <img src={Logo} alt="Blackgate" />
        <span>BLACKGATE Writer</span>
      </div>
      
      <div className="titlebar-center">
        <span style={{ color: 'var(--text-primary)' }}>{state.title}</span>
        <span style={{ color: 'var(--text-secondary)' }}>·</span>
        <span style={{ color: state.saved ? '#60a5fa' : '#fbbf24' }}>
          {state.saved ? 'Saved' : 'Unsaved'}
        </span>
      </div>

      <div className="titlebar-controls">
        <button title="Minimize">—</button>
        <button title="Maximize">□</button>
        <button className="close-btn" title="Close">✕</button>
      </div>
    </div>
  )
}
