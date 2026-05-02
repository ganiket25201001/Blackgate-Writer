import React from 'react'

export default function RibbonButton({ active=false, title, onClick, children, className='' }: { active?: boolean; title: string; onClick?: () => void; children: React.ReactNode; className?: string }){
  return (
    <button 
      onClick={onClick} 
      title={title} 
      className={`rb ${active ? 'active' : ''} ${className}`}
    > 
      {children}
    </button>
  )
}
