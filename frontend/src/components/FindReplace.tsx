import React, { useState } from 'react'
import { useEditorInstance } from './editor/editorContext'

export default function FindReplace({ onClose }: { onClose: ()=>void }){
  const editor = useEditorInstance()
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)

  const doFind = ()=>{
    if (!editor) return
    const html = editor.getHTML()
    const flags = caseSensitive ? 'g' : 'gi'
    try {
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
      const newHtml = html.replace(regex, (m)=>`<mark>${m}</mark>`)
      editor.commands.setContent(newHtml)
    } catch (e) {
      console.error('Find error', e)
    }
  }

  const doReplace = ()=>{
    if (!editor) return
    const html = editor.getHTML()
    const flags = caseSensitive ? 'g' : 'gi'
    try {
      const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
      const newHtml = html.replace(regex, replace)
      editor.commands.setContent(newHtml)
    } catch (e) {
      console.error('Replace error', e)
    }
  }

  const doReplaceAll = ()=>{
    doReplace()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24">
      <div className="bg-panel rounded shadow-lg border border-white/10 w-[600px] p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Find & Replace</h3>
          <button onClick={onClose} className="text-text-secondary">✕</button>
        </div>

        <div className="mt-3 space-y-3">
          <input className="w-full p-2 bg-white/5 rounded" placeholder="Find" value={find} onChange={(e)=>setFind(e.target.value)} />
          <input className="w-full p-2 bg-white/5 rounded" placeholder="Replace" value={replace} onChange={(e)=>setReplace(e.target.value)} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={caseSensitive} onChange={(e)=>setCaseSensitive(e.target.checked)} /> Case sensitive</label>
          <div className="flex gap-2 justify-end">
            <button onClick={doFind} className="px-3 py-1 bg-white/5 rounded">Find</button>
            <button onClick={doReplace} className="px-3 py-1 bg-accent text-white rounded">Replace</button>
            <button onClick={doReplaceAll} className="px-3 py-1 bg-accent/80 text-white rounded">Replace All</button>
          </div>
        </div>
      </div>
    </div>
  )
}
