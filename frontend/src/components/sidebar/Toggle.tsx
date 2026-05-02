import React from 'react'

export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (b:boolean)=>void; label?: string }){
  return (
    <div className="toggle-wrap">
      <div className="toggle-label">{label}</div>
      <button onClick={()=>onChange(!checked)} className={`toggle-track ${checked ? 'on' : 'off'}`}>
        <div className="toggle-thumb" />
      </button>
    </div>
  )
}
