import React, { useState } from 'react'
import Logo from '../assets/logo.png'
import FileMenu from './FileMenu'
import { useDoc } from '../contexts/documentContext'

export default function TitleBar({ onShowAbout, onShowSettings }: { onShowAbout?: ()=>void; onShowSettings?: ()=>void }){
  const { state } = useDoc()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="relative flex items-center justify-between px-4 py-2 bg-panel border-b border-black/20 h-12">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Blackgate" className="w-6 h-6" />
        <div className="font-semibold text-sm tracking-wide">BLACKGATE Writer</div>
        <div className="flex items-center gap-1 ml-4">
          <FileMenu />
          <div className="relative">
            <button onClick={()=>setShowHelp(!showHelp)} className="px-3 py-1 rounded hover:bg-white/10 text-sm">Help</button>
            {showHelp && (
              <div className="absolute top-full left-0 mt-1 bg-panel border border-white/10 rounded shadow-lg z-50 min-w-40">
                <button onClick={()=>{ onShowSettings?.(); setShowHelp(false) }} className="block w-full text-left px-4 py-2 hover:bg-white/10 text-sm">Settings</button>
                <button onClick={()=>{ onShowAbout?.(); setShowHelp(false) }} className="block w-full text-left px-4 py-2 hover:bg-white/10 text-sm">About Blackgate Writer</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-sm">
        <span className="text-text-primary">{state.title}</span>
        <span className="mx-2 text-text-secondary">•</span>
        <span className={`${state.saved ? 'text-blue-400' : 'text-yellow-400'}`}>{state.saved ? 'Saved' : 'Unsaved'}</span>
      </div>

      <div className="flex items-center gap-2 text-text-secondary">
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5">—</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5">□</button>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600 hover:text-white">✕</button>
      </div>
    </div>
  )
}
