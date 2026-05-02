import React, { useState, useRef, useEffect } from 'react'

const COLORS = [
  '#E6EEF8','#FFFFFF','#000000','#F59E0B','#10B981','#EF4444','#3B82F6',
  '#8B5CF6','#EC4899','#F97316','#06B6D4','#84CC16','#6366F1','#14B8A6'
]

export default function RibbonColorPicker({ label, color, onChange, icon }: { label?: string; color: string; onChange: (c:string)=>void; icon?: React.ReactNode }){
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!open) return
    function handleClick(e: MouseEvent){
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return ()=> document.removeEventListener('mousedown', handleClick)
  },[open])

  return (
    <div className="relative" ref={ref}>
      <button title={label} onClick={()=>setOpen(v=>!v)} className="color-btn">
        {icon || <span style={{ fontSize: '14px', fontWeight: 700, lineHeight: 1 }}>A</span>}
        <div className="color-bar" style={{ background: color || '#3B82F6' }} />
      </button>
      {open && (
        <div className="color-grid">
          {COLORS.map(c=> (
            <button 
              key={c} 
              onClick={()=>{ onChange(c); setOpen(false) }} 
              style={{ background: c }} 
            />
          ))}
          <button 
            onClick={()=>{ 
              const custom = prompt('Enter color hex:')
              if (custom) { onChange(custom); setOpen(false) }
            }}
            style={{ background: 'linear-gradient(135deg, red, yellow, green, blue)', gridColumn: 'span 2' }}
            title="Custom color"
          />
        </div>
      )}
    </div>
  )
}
