import React from 'react'

export default function ClosePrompt({ 
  onSave, 
  onDontSave, 
  onCancel 
}: { 
  onSave: ()=>void; 
  onDontSave: ()=>void; 
  onCancel: ()=>void; 
}) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: '#252526', border: '1px solid #454545',
        borderRadius: 8, width: 400, padding: 24,
        boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
        color: 'var(--text-primary)'
      }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 500 }}>Save changes to the document?</h2>
        <p style={{ margin: '0 0 24px 0', fontSize: 13, color: 'var(--text-secondary)' }}>
          If you don't save, your changes will be lost.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button 
            onClick={onSave}
            style={{ 
              padding: '6px 16px', background: 'var(--accent)', color: 'white', 
              border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button 
            onClick={onDontSave}
            style={{ 
              padding: '6px 16px', background: 'transparent', color: 'var(--text-primary)', 
              border: '1px solid var(--border-strong)', borderRadius: 4, cursor: 'pointer'
            }}
          >
            Don't Save
          </button>
          <button 
            onClick={onCancel}
            style={{ 
              padding: '6px 16px', background: 'transparent', color: 'var(--text-primary)', 
              border: '1px solid var(--border-strong)', borderRadius: 4, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
