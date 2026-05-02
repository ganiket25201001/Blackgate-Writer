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
    <div className="fixed bottom-6 right-6 bg-red-900/80 text-red-100 px-4 py-3 rounded border border-red-700 max-w-sm shadow-lg z-40 backdrop-blur">
      <div className="flex justify-between items-start gap-4">
        <p className="text-sm">{error}</p>
        <button onClick={onDismiss} className="text-red-100 hover:text-red-50 font-bold">✕</button>
      </div>
    </div>
  )
}

function AppContent(){
  const { state, saveDoc } = useDoc()
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

  useEffect(()=>{
    function handler(e: KeyboardEvent){
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
        e.preventDefault()
        saveDoc().catch(err=>console.error('Save shortcut error:', err))
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f'){
        e.preventDefault()
        setShowFind(true)
      }
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  },[saveDoc])

  return (
    <div className="h-screen flex flex-col bg-bg text-text-primary">
      <TitleBar onShowAbout={()=>setShowAbout(true)} onShowSettings={()=>setShowSettings(true)} />
      <RibbonProvider>
        <Ribbon />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <main className="flex-1 p-6 overflow-auto flex justify-center items-start">
            <EditorProvider>
              <EditorCanvas />
            </EditorProvider>
          </main>
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
