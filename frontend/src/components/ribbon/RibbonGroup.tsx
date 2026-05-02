import React from 'react'

export default function RibbonGroup({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-content">{children}</div>
      <div className="ribbon-group-label">{title}</div>
    </div>
  )
}
