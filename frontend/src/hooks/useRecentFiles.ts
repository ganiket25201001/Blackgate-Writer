import { useEffect, useState, useCallback } from 'react'

export interface RecentFile {
  path: string
  title: string
  timestamp: number
}

const STORAGE_KEY = 'blackgate_recent_files'
const MAX_RECENT = 10

export function useRecentFiles() {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setRecentFiles(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to load recent files:', e)
    }
  }, [])

  // Add file to recent list
  const addRecentFile = useCallback((path: string, title: string) => {
    setRecentFiles(prev => {
      // Remove if already exists
      const filtered = prev.filter(f => f.path !== path)
      // Add to front
      const updated = [{ path, title, timestamp: Date.now() }, ...filtered]
      // Keep only MAX_RECENT
      const trimmed = updated.slice(0, MAX_RECENT)
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
      } catch (e) {
        console.error('Failed to save recent files:', e)
      }
      return trimmed
    })
  }, [])

  // Clear recent files
  const clearRecentFiles = useCallback(() => {
    setRecentFiles([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Failed to clear recent files:', e)
    }
  }, [])

  return { recentFiles, addRecentFile, clearRecentFiles }
}
