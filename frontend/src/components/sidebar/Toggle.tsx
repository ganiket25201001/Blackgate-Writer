import React from 'react'

export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (b:boolean)=>void; label?: string }){
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm">{label}</div>
      <button onClick={()=>onChange(!checked)} className={`w-10 h-6 rounded-full p-1 ${checked ? 'bg-accent' : 'bg-white/5'}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
    </div>
  )
}
