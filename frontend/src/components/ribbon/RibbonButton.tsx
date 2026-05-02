import React from 'react'

export default function RibbonButton({ active=false, title, onClick, children }: { active?: boolean; title: string; onClick?: () => void; children: React.ReactNode }){
  return (
    <button onClick={onClick} title={title} className={`flex items-center justify-center w-9 h-9 rounded ${active ? 'bg-accent/80 text-black' : 'hover:bg-white/5'} focus:outline-none`}> 
      {children}
    </button>
  )
}
