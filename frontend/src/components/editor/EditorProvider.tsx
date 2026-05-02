import React, { useEffect } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { EditorProvider as Provider } from './editorContext'
import { useRibbon } from '../ribbon/ribbonState'

export default function EditorProvider({ children }: { children: React.ReactNode }){
  const { dispatch } = useRibbon()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1,2,3] } }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading','paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: `
      <h1>Business Proposal</h1>
      <p>This is a placeholder for the Blackgate Writer document. Use the ribbon to format text.</p>
      <h2>Overview</h2>
      <ul>
        <li>Point one</li>
        <li>Point two</li>
      </ul>
      <pre>// code block placeholder</pre>
    `,
    onSelectionUpdate: ({ editor }) => {
      const textStyle = editor.getAttributes('textStyle') || {}
      const colorAttr = editor.getAttributes('color') || {}
      const highlightAttr = editor.getAttributes('highlight') || {}
      const alignment = editor.getAttributes('textAlign')?.textAlign || 'left'
      const listState = editor.isActive('bulletList') ? 'bulleted' : editor.isActive('orderedList') ? 'numbered' : 'none'

      dispatch({ type: 'set', payload: {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        superscript: editor.isActive('superscript'),
        subscript: editor.isActive('subscript'),
        alignment,
        list: listState,
        fontFamily: textStyle['font-family'] || textStyle.fontFamily || undefined || undefined,
        fontSize: textStyle['font-size'] ? parseInt(String(textStyle['font-size'])) : undefined,
        textColor: colorAttr.color || textStyle.color || undefined,
        highlightColor: highlightAttr.color || undefined
      }})
    }
  })

  useEffect(()=>{
    return () => { editor?.destroy() }
  },[editor])

  return <Provider editor={editor}>{children}</Provider>
}
