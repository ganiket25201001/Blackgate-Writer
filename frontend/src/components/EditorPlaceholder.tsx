import React from 'react'

export default function EditorPlaceholder(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Business Proposal</h1>
      <p className="text-sm text-text-secondary mb-4">This is a placeholder for the rich text editor. Tiptap will be integrated in a later step.</p>
      <h2 className="font-semibold mt-6">Overview</h2>
      <ul className="list-disc ml-6 mt-2 text-sm text-text-secondary">
        <li>Point one</li>
        <li>Point two</li>
      </ul>
      <pre className="mt-6 bg-black/5 p-3 rounded text-xs">// code block placeholder</pre>
    </div>
  )
}
