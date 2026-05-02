import { useEffect, useRef } from 'react'
import { useDoc } from '../contexts/documentContext'

export function useAutoSave(intervalMs: number = 30000) {
  const { state, saveDoc } = useDoc()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedRef = useRef<string>(state.content)

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Only auto-save if content changed and not already saved
    if (state.content !== lastSavedRef.current && !state.saved) {
      timeoutRef.current = setTimeout(() => {
        saveDoc().catch(err => console.error('Auto-save error:', err))
        lastSavedRef.current = state.content
      }, intervalMs)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [state.content, state.saved, intervalMs, saveDoc])

  return { isSaving: !state.saved && state.content !== lastSavedRef.current }
}
