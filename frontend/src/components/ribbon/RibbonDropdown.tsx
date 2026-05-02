import React, { useState } from 'react'

export default function RibbonDropdown({ label, value, options, onSelect }: { label?: string; value: string | number; options: Array<string | number>; onSelect: (v: string | number) => void }){
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={()=>setOpen(v=>!v)} className="px-3 py-1 bg-white/5 rounded flex items-center gap-2 text-sm">{value} <svg width="12" height="12" viewBox="0 0 24 24" className="ml-1"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      {open && (
        <div className="absolute z-20 mt-1 right-0 bg-panel rounded shadow-lg p-2 w-40">
          {options.map(o=> (
            <div key={String(o)} onClick={()=>{ onSelect(o); setOpen(false) }} className="px-2 py-1 hover:bg-white/5 rounded cursor-pointer">{o}</div>
          ))}
        </div>
      )}
    </div>
  )
}
