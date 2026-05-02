import React from 'react'

export default function NumberInput({ value, onChange, label, min, max }: { value: number; onChange: (v:number)=>void; label?: string; min?: number; max?: number }){
  return (
    <div className="flex items-center gap-2">
      {label && <div className="text-xs text-text-secondary w-24">{label}</div>}
      <input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="w-20 bg-white/5 rounded px-2 py-1 text-sm" min={min} max={max} />
    </div>
  )
}
