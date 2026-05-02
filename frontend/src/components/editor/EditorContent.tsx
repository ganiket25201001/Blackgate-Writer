import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorInstance } from './editorContext'
import { useStore } from '../../store/useStore'
import { useRibbon } from '../ribbon/ribbonState'

export default function EditorCanvas(){
  const editor = useEditorInstance()
  const zoom = useStore(s=>s.zoom)
  const { state } = useRibbon()

  // A4 size roughly in px at 96 DPI
  const pageWidth = 794
  const pageHeight = 1123
  
  return (
    <div className="editor-area">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Ruler */}
        <div className="editor-ruler" style={{ width: pageWidth, position: 'relative', marginBottom: 4, height: 16, background: '#f3f4f6', border: '1px solid #d1d5db' }}>
           {/* Gray left margin */}
           <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: state.pageMargins.left, background: '#e5e7eb', borderRight: '1px solid #9ca3af' }} />
           {/* Gray right margin */}
           <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: state.pageMargins.right, background: '#e5e7eb', borderLeft: '1px solid #9ca3af' }} />
           
           {/* Tick marks inside text area */}
           <div style={{ position: 'absolute', left: state.pageMargins.left, right: state.pageMargins.right, top: 0, bottom: 0, overflow: 'hidden' }}>
             {Array.from({length: 40}).map((_, i) => (
               <div key={i} style={{ 
                 position: 'absolute', left: i * 20, bottom: 0, width: 1, 
                 height: i % 4 === 0 ? 8 : 4, background: '#9ca3af' 
               }}>
                 {i % 4 === 0 && <span style={{ position: 'absolute', top: -14, left: 2, fontSize: 9, color: '#6b7280' }}>{i/4}</span>}
               </div>
             ))}
           </div>
        </div>
        
        {/* Paper */}
        <div 
          className="editor-page" 
          style={{ 
            width: pageWidth,
            minHeight: pageHeight,
            paddingTop: state.pageMargins.top,
            paddingRight: state.pageMargins.right,
            paddingBottom: state.pageMargins.bottom,
            paddingLeft: state.pageMargins.left,
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center',
            backgroundColor: state.pageColor || 'white',
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${pageHeight}px, #2b2b2b ${pageHeight}px, #2b2b2b ${pageHeight + 20}px)`
          }}
        >
          {editor ? <EditorContent editor={editor} /> : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: '#999' }}>
              Loading editor...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
