import React, { createContext, useContext, useReducer, useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { open, save } from '@tauri-apps/api/dialog'

type DocState = {
  title: string
  path?: string
  saved: boolean
  content: string
  lastSaved?: Date
}

type Action = { type: string; payload?: any }

const initial: DocState = { title: 'Untitled.bgdoc', path: undefined, saved: true, content: '' }

function reducer(state: DocState, action: Action): DocState{
  switch(action.type){
    case 'set': return { ...state, ...(action.payload || {}) }
    case 'content': return { ...state, content: action.payload, saved: false }
    default: return state
  }
}

const DocContext = createContext<{
  state: DocState
  dispatch: React.Dispatch<Action>
  error?: string
  setError: (msg: string) => void
  newDoc: ()=>void
  openDoc: ()=>Promise<void>
  saveDoc: ()=>Promise<void>
  saveAs: ()=>Promise<void>
  exportPdf: ()=>Promise<void>
  exportDocx: ()=>Promise<void>
}>({} as any)

export function DocProvider({ children }: { children: React.ReactNode }){
  const [state, dispatch] = useReducer(reducer, initial)
  const [error, setError] = useState<string>()

  async function newDoc(){
    dispatch({ type: 'set', payload: { title: 'Untitled.bgdoc', path: undefined, content: '', saved: true } })
    setError(undefined)
  }

  async function openDoc(){
    try{
      const selected = await open({ multiple: false, filters: [{ name: 'Documents', extensions: ['bgdoc','txt','md','html','docx'] }] }) as string | null
      if (!selected) return
      const content = await invoke('read_file', { path: selected }) as string
      // if .bgdoc assume JSON
      if (selected.endsWith('.bgdoc')){
        try{
          const obj = JSON.parse(content)
          dispatch({ type: 'set', payload: { title: obj.title || selected.split(/\\|\//).pop(), path: selected, content: obj.content || '', saved: true, lastSaved: new Date() } })
        }catch{
          dispatch({ type: 'set', payload: { title: selected.split(/\\|\//).pop(), path: selected, content, saved: true, lastSaved: new Date() } })
        }
      } else {
        dispatch({ type: 'set', payload: { title: selected.split(/\\|\//).pop(), path: selected, content, saved: true, lastSaved: new Date() } })
      }
      setError(undefined)
    }catch(e){
      const msg = `Failed to open document: ${e instanceof Error ? e.message : String(e)}`
      setError(msg)
      console.error(msg)
    }
  }

  async function saveDoc(){
    try{
      if (state.path){
        // if bgdoc save JSON
        if (state.path.endsWith('.bgdoc')){
          const obj = { title: state.title, content: state.content, savedAt: new Date().toISOString() }
          await invoke('write_file', { path: state.path, content_base64: btoa(JSON.stringify(obj)) })
        } else {
          await invoke('write_file', { path: state.path, content_base64: btoa(state.content) })
        }
        dispatch({ type: 'set', payload: { saved: true, lastSaved: new Date() } })
        setError(undefined)
      } else {
        await saveAs()
      }
    }catch(e){
      const msg = `Failed to save document: ${e instanceof Error ? e.message : String(e)}`
      setError(msg)
      console.error(msg)
    }
  }

  async function saveAs(){
    try{
      const selected = await save({ defaultPath: state.title }) as string | null
      if (!selected) return
      if (selected.endsWith('.bgdoc')){
        const obj = { title: state.title, content: state.content, savedAt: new Date().toISOString() }
        await invoke('write_file', { path: selected, content_base64: btoa(JSON.stringify(obj)) })
      } else {
        await invoke('write_file', { path: selected, content_base64: btoa(state.content) })
      }
      dispatch({ type: 'set', payload: { path: selected, title: selected.split(/\\|\//).pop(), saved: true, lastSaved: new Date() } })
      setError(undefined)
    }catch(e){
      const msg = `Failed to save as: ${e instanceof Error ? e.message : String(e)}`
      setError(msg)
      console.error(msg)
    }
  }

  async function exportPdf(){
    try{
      // @ts-ignore
      const base64 = await (window as any).generatePdfBase64?.(state.content)
      if (!base64) {
        setError('PDF export not implemented yet')
        return
      }
      const target = await save({ defaultPath: (state.title?.replace(/\.\w+$/, '') || 'export') + '.pdf' }) as string | null
      if (!target) return
      await invoke('write_file', { path: target, content_base64: base64 })
      setError(undefined)
    }catch(e){
      const msg = `Failed to export PDF: ${e instanceof Error ? e.message : String(e)}`
      setError(msg)
      console.error(msg)
    }
  }

  async function exportDocx(){
    try{
      // @ts-ignore
      const base64 = await (window as any).generateDocxBase64?.(state.content)
      if (!base64) {
        setError('DOCX export not implemented yet')
        return
      }
      const target = await save({ defaultPath: (state.title?.replace(/\.\w+$/, '') || 'export') + '.docx' }) as string | null
      if (!target) return
      await invoke('write_file', { path: target, content_base64: base64 })
      setError(undefined)
    }catch(e){
      const msg = `Failed to export DOCX: ${e instanceof Error ? e.message : String(e)}`
      setError(msg)
      console.error(msg)
    }
  }

  return (
    <DocContext.Provider value={{ state, dispatch, error, setError, newDoc, openDoc, saveDoc, saveAs, exportPdf, exportDocx }}>
      {children}
    </DocContext.Provider>
  )
}

export function useDoc(){
  return useContext(DocContext)
}
