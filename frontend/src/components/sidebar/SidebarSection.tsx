import React from 'react'

export default function SidebarSection({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="sidebar-section">
      <div className="sidebar-section-title">{title}</div>
      {children}
    </div>
  )
}
