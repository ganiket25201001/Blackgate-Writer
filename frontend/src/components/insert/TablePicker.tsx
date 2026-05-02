import React, { useState } from 'react'

export default function TablePicker({ onInsert }: { onInsert: (r:number,c:number)=>void }){
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  return (
    <div className="p-3 bg-panel rounded shadow-md">
      <div className="mb-2 text-sm font-medium">Insert Table</div>
      <div className="flex gap-2 items-center mb-2">
        <label className="text-xs text-text-secondary">Rows</label>
        <input type="number" value={rows} min={1} max={20} onChange={e=>setRows(Number(e.target.value))} className="w-16 bg-white/5 rounded px-2 py-1" />
        <label className="text-xs text-text-secondary">Cols</label>
        <input type="number" value={cols} min={1} max={10} onChange={e=>setCols(Number(e.target.value))} className="w-16 bg-white/5 rounded px-2 py-1" />
      </div>
      <div className="flex justify-end">
        <button onClick={()=>onInsert(rows,cols)} className="btn">Insert</button>
      </div>
    </div>
  )
}
