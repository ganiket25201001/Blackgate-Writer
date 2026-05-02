import React, { useState } from 'react'
import { useSettings } from '../contexts/settingsContext'

export default function SettingsWindow({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  const handleReset = () => {
    if (window.confirm('Reset all settings to defaults?')) {
      resetSettings()
      setLocalSettings(settings)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-panel rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-panel border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appearance */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-accent">Appearance</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Theme</label>
              <select
                value={localSettings.theme}
                onChange={(e) => setLocalSettings({ ...localSettings, theme: e.target.value as 'dark' | 'light' })}
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Default Font</label>
              <select
                value={localSettings.defaultFont}
                onChange={(e) => setLocalSettings({ ...localSettings, defaultFont: e.target.value })}
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
              >
                <option>Segoe UI</option>
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Georgia</option>
                <option>Courier New</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.showLineNumbers}
                onChange={(e) => setLocalSettings({ ...localSettings, showLineNumbers: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Show line numbers</span>
            </label>
          </div>

          {/* File Management */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-accent">File Management</h3>
            
            <label className="flex items-center justify-between">
              <span className="text-sm">Auto-Save</span>
              <input
                type="checkbox"
                checked={localSettings.enableAutoSave}
                onChange={(e) => setLocalSettings({ ...localSettings, enableAutoSave: e.target.checked })}
                className="rounded"
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="text-sm">Auto-Save Interval (seconds)</label>
              <input
                type="number"
                min="5"
                max="300"
                step="5"
                value={Math.round(localSettings.autoSaveInterval / 1000)}
                onChange={(e) => setLocalSettings({ ...localSettings, autoSaveInterval: parseInt(e.target.value) * 1000 })}
                className="bg-white/5 border border-white/10 rounded px-3 py-2 w-24 text-sm"
              />
            </div>
            <label className="flex items-center justify-between">
              <span className="text-sm">Enable Spell Check</span>
              <input
                type="checkbox"
                checked={!!localSettings.enableSpellCheck}
                onChange={(e) => setLocalSettings({ ...localSettings, enableSpellCheck: e.target.checked })}
                className="rounded"
              />
            </label>
          </div>

          {/* Language */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-lg font-semibold text-accent">Language</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm">Language</label>
              <select
                value={localSettings.language}
                onChange={(e) => setLocalSettings({ ...localSettings, language: e.target.value as any })}
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>

            <p className="text-xs text-text-secondary italic pt-2">Language change will take effect after restart.</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-6 border-t border-white/10">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm font-medium"
            >
              Reset to Defaults
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-accent text-white hover:bg-blue-600 text-sm font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
