import React, { useState } from 'react'

const COLORS = ['#E6EEF8','#FFFFFF','#F59E0B','#10B981','#EF4444','#3B82F6','#8B5CF6']

export default function RibbonColorPicker({ label, color, onChange }: { label?: string; color: string; onChange: (c:string)=>void }){
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button title={label} onClick={()=>setOpen(v=>!v)} className="w-9 h-9 rounded flex items-center justify-center hover:bg-white/5">
        <span className="w-5 h-3 rounded" style={{ background: color || 'transparent', display: 'inline-block' }} />
      </button>
      {open && (
        <div className="absolute z-20 mt-2 right-0 bg-panel rounded shadow-lg p-2 grid grid-cols-4 gap-2">
          {COLORS.map(c=> (
            <button key={c} onClick={()=>{ onChange(c); setOpen(false) }} style={{ background: c }} className="w-6 h-6 rounded" />
          ))}
        </div>
      )}
    </div>
  )
}
