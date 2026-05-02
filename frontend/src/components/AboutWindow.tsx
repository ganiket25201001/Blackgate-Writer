import React from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { useState, useEffect } from 'react'

export default function AboutWindow(){
  const [version, setVersion] = useState('0.1.0')

  useEffect(()=>{
    getVersion().then(v=>setVersion(v)).catch(()=>{})
  },[])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-panel rounded-lg p-8 max-w-md border border-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Blackgate Writer</h1>
          <p className="text-text-secondary mb-1">Professional Document Editing</p>
          <p className="text-sm text-text-secondary mb-6">Version {version}</p>
          
          <div className="mb-6 text-left text-sm text-text-secondary">
            <p className="mb-2"><span className="text-accent font-semibold">Blackgate Writer</span> is a modern, powerful alternative to Microsoft Word, built with React, Tauri, and Tiptap.</p>
            <p className="mb-2"><span className="text-accent">Features:</span></p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Rich text editing with Tiptap</li>
              <li>Image and table insertion</li>
              <li>Professional formatting toolbar</li>
              <li>Document navigation and outline</li>
              <li>File operations (New, Open, Save)</li>
              <li>Export to PDF and DOCX</li>
            </ul>
          </div>

          <div className="text-xs text-text-secondary mb-4">
            <p>© 2026 Blackgate IT Solution</p>
            <p>All rights reserved.</p>
          </div>
          
          <button onClick={()=>window.close()} className="btn w-full">Close</button>
        </div>
      </div>
    </div>
  )
}
