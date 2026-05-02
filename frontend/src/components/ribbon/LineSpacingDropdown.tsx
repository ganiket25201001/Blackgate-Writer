import React, { useState, useRef, useEffect } from 'react'
import { ArrowUpDown, Check } from 'lucide-react'

const SPACING_OPTIONS = [
  { label: '1.0', value: 1.0 },
  { label: '1.15', value: 1.15 },
  { label: '1.5', value: 1.5 },
  { label: '2.0', value: 2.0 },
  { label: '2.5', value: 2.5 },
  { label: '3.0', value: 3.0 },
]

export default function LineSpacingDropdown({ current, onSelect }: { current: number; onSelect: (v: number)=>void }){
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="rb" onClick={(e)=>{ e.stopPropagation(); setOpen(v=>!v) }} title="Line Spacing">
        <ArrowUpDown size={14} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ top: '100%', left: 0, minWidth: 140, marginTop: 2 }}>
          <div style={{ padding: '4px 10px', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Line Spacing</div>
          {SPACING_OPTIONS.map(opt => (
            <div 
              key={opt.value}
              className="dropdown-item"
              onClick={()=>{ onSelect(opt.value); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ width: 14, display: 'inline-flex' }}>
                {Math.abs(current - opt.value) < 0.01 && <Check size={12} style={{ color: 'var(--accent)' }} />}
              </span>
              {opt.label}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border-strong)', margin: '4px 0' }} />
          <div className="dropdown-item" style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
            Add Space Before Paragraph
          </div>
          <div className="dropdown-item" style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
            Add Space After Paragraph
          </div>
        </div>
      )}
    </div>
  )
}
