import React from 'react'

export default function RibbonGroup({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="flex flex-col items-start bg-white/2 rounded px-3 py-2">
      <div className="mb-2 text-xs text-text-secondary">{title}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  )
}
