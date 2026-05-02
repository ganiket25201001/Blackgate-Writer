import React, { useState } from 'react'
import { useDoc } from '../contexts/documentContext'
import { useRecentFiles } from '../hooks/useRecentFiles'
import TemplateSelector from './TemplateSelector'

export default function FileMenu(){
  const [open, setOpen] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const doc = useDoc()
  const { recentFiles, addRecentFile, clearRecentFiles } = useRecentFiles()

  return (
    <>
      <div className="relative">
        <button onClick={()=>setOpen(v=>!v)} className="px-3 py-1 rounded hover:bg-white/5">File</button>
        {open && (
          <div className="absolute mt-2 left-0 bg-panel rounded shadow-lg w-56 p-2 z-30">
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={()=>{ doc.newDoc(); setOpen(false) }}>New</div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={()=>{ setShowTemplates(true); setOpen(false) }}>New from Template...</div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={async ()=>{ await doc.openDoc(); setOpen(false) }}>Open...</div>
            
            {recentFiles.length > 0 && (
              <>
                <div className="border-t border-white/10 my-2"></div>
                <div className="text-xs text-text-secondary px-2 py-1 font-semibold">Recent Files</div>
                {recentFiles.slice(0, 5).map((file, idx) => (
                  <div
                    key={idx}
                    onClick={async ()=>{ 
                      // @ts-ignore
                      await doc.openDoc() 
                      addRecentFile(file.path, file.title)
                      setOpen(false) 
                    }}
                    className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm truncate"
                    title={file.path}
                  >
                    {file.title}
                  </div>
                ))}
                {recentFiles.length > 0 && (
                  <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-xs text-text-secondary" onClick={clearRecentFiles}>Clear Recent</div>
                )}
              </>
            )}

            <div className="border-t border-white/10 my-2"></div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={async ()=>{ await doc.saveDoc(); setOpen(false) }}>Save</div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={async ()=>{ await doc.saveAs(); setOpen(false) }}>Save As...</div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={async ()=>{ await doc.exportPdf(); setOpen(false) }}>Export → PDF</div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={async ()=>{ await doc.exportDocx(); setOpen(false) }}>Export → DOCX</div>
            <div className="border-t border-white/10 my-2"></div>
            <div className="py-1 px-2 hover:bg-white/5 rounded cursor-pointer text-sm" onClick={()=>{ window.close() }}>Exit</div>
          </div>
        )}
      </div>
      
      {showTemplates && (
        <TemplateSelector onClose={()=>setShowTemplates(false)} />
      )}
    </>
  )
}
