import React from 'react'
import { EditorContent } from '@tiptap/react'
import { useEditorInstance } from './editorContext'
import { useStore } from '../../store/useStore'

export default function EditorCanvas(){
  const editor = useEditorInstance()
  const zoom = useStore(s=>s.zoom)
  
  return (
    <div className="editor-area">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Ruler */}
        <div className="editor-ruler">
          <div className="ruler-marks">
            {Array.from({length: 17}).map((_,i)=> (
              <div key={i} style={{ 
                position: 'absolute', 
                left: `${(i/16)*100}%`, 
                bottom: 0, 
                height: i % 2 === 0 ? 10 : 5, 
                width: 1, 
                background: 'rgba(255,255,255,0.2)' 
              }}>
                {i % 2 === 0 && i > 0 && i < 16 && (
                  <span style={{ position: 'absolute', top: -12, left: -4, fontSize: 8, color: 'var(--text-secondary)' }}>{i/2}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Paper */}
        <div 
          className="editor-page" 
          style={{ 
            padding: 32,
            transform: `scale(${zoom})`, 
            transformOrigin: 'top center',
            marginTop: 2
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
