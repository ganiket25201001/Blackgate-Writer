import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function RibbonDropdown({ label, value, options, onSelect, wide=false }: { label?: string; value: string | number; options: Array<string | number>; onSelect: (v: string | number) => void; wide?: boolean }){
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
      <button 
        onClick={()=>setOpen(v=>!v)} 
        className={wide ? 'ribbon-font-select' : 'ribbon-size-select'}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{value}</span>
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ top: '100%', left: 0, minWidth: wide ? '160px' : '80px' }}>
          {options.map(o=> (
            <div 
              key={String(o)} 
              onClick={()=>{ onSelect(o); setOpen(false) }} 
              className="dropdown-item"
              style={{ fontFamily: wide && typeof o === 'string' ? o : undefined }}
            >
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
