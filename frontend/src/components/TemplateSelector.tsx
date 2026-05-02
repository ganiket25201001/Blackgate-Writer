import React from 'react'
import { TEMPLATES } from '../templates/documentTemplates'
import { useDoc } from '../contexts/documentContext'

export default function TemplateSelector({ onClose }: { onClose: () => void }) {
  const { dispatch } = useDoc()

  const selectTemplate = (content: string, name: string) => {
    dispatch({ type: 'set', payload: { title: `${name}.bgdoc`, content, saved: true, path: undefined } })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-panel rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-panel border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Choose a Template</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">✕</button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              onClick={() => selectTemplate(template.content, template.name)}
              className="p-6 border border-white/10 rounded-lg hover:bg-white/5 hover:border-accent transition text-left"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-text-secondary">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
