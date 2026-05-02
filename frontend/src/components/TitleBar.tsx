import React, { useState } from 'react'
import Logo from '../assets/logo.svg'
import FileMenu from './FileMenu'
import { useDoc } from '../contexts/documentContext'

export default function TitleBar({ onShowAbout, onShowSettings }: { onShowAbout?: ()=>void; onShowSettings?: ()=>void }){
  const { state } = useDoc()
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-panel border-b border-black/20">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Blackgate" className="w-8 h-8" />
        <div className="flex items-center gap-2">
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
          <div className="font-semibold">BLACKGATE Writer</div>
        </div>
        <div className="text-sm text-text-secondary ml-3">{state.title} • <span className={`${state.saved ? 'text-blue-400' : 'text-yellow-400'}`}>{state.saved ? 'Saved' : 'Unsaved'}</span></div>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-3 py-1 rounded hover:bg-white/5">_</button>
        <button className="px-3 py-1 rounded hover:bg-white/5">□</button>
        <button className="px-3 py-1 rounded hover:bg-red-600">✕</button>
      </div>
    </div>
  )
}
