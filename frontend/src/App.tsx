import React, { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar'
import Ribbon from './components/Ribbon'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import StatusBar from './components/StatusBar'
import AboutWindow from './components/AboutWindow'
import SettingsWindow from './components/SettingsWindow'
import TemplateSelector from './components/TemplateSelector'
import FindReplace from './components/FindReplace'
import { RibbonProvider } from './components/ribbon/ribbonState'
import EditorProvider from './components/editor/EditorProvider'
import EditorCanvas from './components/editor/EditorContent'
import { useDoc } from './contexts/documentContext'
import { SettingsProvider } from './contexts/settingsContext'
import { useRecentFiles } from './hooks/useRecentFiles'
import { useAutoSave } from './hooks/useAutoSave'
import { useSettings } from './contexts/settingsContext'

function ErrorDisplay({ error, onDismiss }: { error?: string; onDismiss: ()=>void }){
  if (!error) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, 
      background: 'rgba(127,29,29,0.9)', color: '#fecaca',
      padding: '12px 16px', borderRadius: 8, 
      border: '1px solid rgba(239,68,68,0.3)',
      maxWidth: 360, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      zIndex: 40, backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16
    }}>
      <p style={{ fontSize: 13, margin: 0 }}>{error}</p>
      <button onClick={onDismiss} style={{ color: '#fecaca', fontWeight: 700, fontSize: 16 }}>✕</button>
    </div>
  )
}

function AppContent(){
  const { state, saveDoc, newDoc, openDoc, saveAs, exportPdf } = useDoc()
  const { error, setError } = useDoc()
  const { addRecentFile } = useRecentFiles()
  const { settings } = useSettings()
  const { isSaving } = useAutoSave(settings.autoSaveInterval)
  const [showAbout, setShowAbout] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showFind, setShowFind] = useState(false)

  // Track recent files on save
  useEffect(() => {
    if (state.saved && state.path) {
      addRecentFile(state.path, state.title)
    }
  }, [state.saved, state.path, state.title, addRecentFile])

  // Comprehensive keyboard shortcuts (Word-compatible)
  useEffect(()=>{
    function handler(e: KeyboardEvent){
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      const key = e.key.toLowerCase()

      // Ctrl+S = Save
      if (ctrl && !shift && key === 's'){
        e.preventDefault()
        saveDoc().catch(err=>console.error('Save error:', err))
        return
      }
      // Ctrl+Shift+S = Save As
      if (ctrl && shift && key === 's'){
        e.preventDefault()
        saveAs().catch(err=>console.error('SaveAs error:', err))
        return
      }
      // Ctrl+N = New document
      if (ctrl && !shift && key === 'n'){
        e.preventDefault()
        newDoc()
        return
      }
      // Ctrl+O = Open document
      if (ctrl && !shift && key === 'o'){
        e.preventDefault()
        openDoc().catch(err=>console.error('Open error:', err))
        return
      }
      // Ctrl+P = Export PDF
      if (ctrl && !shift && key === 'p'){
        e.preventDefault()
        exportPdf().catch(err=>console.error('Export PDF error:', err))
        return
      }
      // Ctrl+F = Find
      if (ctrl && !shift && key === 'f'){
        e.preventDefault()
        setShowFind(true)
        return
      }
      // Ctrl+H = Replace
      if (ctrl && !shift && key === 'h'){
        e.preventDefault()
        setShowFind(true)
        return
      }
      // Escape = Close dialogs
      if (key === 'escape'){
        if (showFind) setShowFind(false)
        if (showAbout) setShowAbout(false)
        if (showSettings) setShowSettings(false)
        if (showTemplates) setShowTemplates(false)
      }
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  },[saveDoc, saveAs, newDoc, openDoc, exportPdf, showFind, showAbout, showSettings, showTemplates])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <TitleBar onShowAbout={()=>setShowAbout(true)} onShowSettings={()=>setShowSettings(true)} />
      <RibbonProvider>
        <Ribbon />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftSidebar />
          <EditorProvider>
            <EditorCanvas />
          </EditorProvider>
          <RightSidebar />
        </div>
      </RibbonProvider>
      <StatusBar />
      <ErrorDisplay error={error} onDismiss={()=>setError('')} />
      
      {showAbout && (
        <div onClick={()=>setShowAbout(false)}>
          <AboutWindow />
        </div>
      )}
      
      {showSettings && (
        <SettingsWindow onClose={()=>setShowSettings(false)} />
      )}

      {showTemplates && (
        <TemplateSelector onClose={()=>setShowTemplates(false)} />
      )}
      {showFind && (
        <FindReplace onClose={()=>setShowFind(false)} />
      )}
    </div>
  )
}

function AppWithSettings(){
  useEffect(()=>{
    document.documentElement.classList.add('dark')
  },[])

  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

export default AppWithSettings
