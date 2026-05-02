import React from 'react'

export default function NumberInput({ value, onChange, label, min, max, unit }: { value: number; onChange: (v:number)=>void; label?: string; min?: number; max?: number; unit?: string }){
  return (
    <div className="num-input-wrap">
      {label && <div className="num-input-label">{label}</div>}
      <div className="num-input">
        <input 
          type="text" 
          value={unit ? `${value} ${unit}` : value} 
          onChange={e=>{
            const num = parseFloat(e.target.value.replace(/[^0-9.-]/g,''))
            if (!isNaN(num)) onChange(num)
          }} 
          min={min} 
          max={max} 
        />
        <div className="spinners">
          <button onClick={()=>onChange(Math.min(max ?? Infinity, value+1))} title="Increase">▲</button>
          <button onClick={()=>onChange(Math.max(min ?? -Infinity, value-1))} title="Decrease">▼</button>
        </div>
      </div>
    </div>
  )
}
