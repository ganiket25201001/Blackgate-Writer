import React from 'react'

export default function SidebarSection({ title, children }: { title: string; children: React.ReactNode }){
  return (
    <div className="mb-4">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
