import React, { useEffect } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import ImageExt from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import SubscriptExt from '@tiptap/extension-subscript'
import SuperscriptExt from '@tiptap/extension-superscript'
import { Extension } from '@tiptap/core'

export const FontSizeAndFamily = Extension.create({
  name: 'fontSizeAndFamily',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          'font-size': {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes['font-size']) return {}
              return { style: `font-size: ${attributes['font-size']}` }
            },
          },
          'font-family': {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes['font-family']) return {}
              return { style: `font-family: ${attributes['font-family']}` }
            },
          },
          'line-height': {
            default: null,
            parseHTML: element => element.style.lineHeight?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes['line-height']) return {}
              return { style: `line-height: ${attributes['line-height']}` }
            },
          }
        },
      },
    ]
  },
})

import { EditorProvider as Provider } from './editorContext'
import { useRibbon } from '../ribbon/ribbonState'
import { useSettings } from '../../contexts/settingsContext'
import { useDoc } from '../../contexts/documentContext'

export default function EditorProvider({ children }: { children: React.ReactNode }){
  const { dispatch } = useRibbon()
  const { settings } = useSettings()
  const { dispatch: docDispatch } = useDoc()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1,2,3] } }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading','paragraph'] }),
      ImageExt.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      SubscriptExt,
      SuperscriptExt,
      FontSizeAndFamily,
    ],
    content: `
      <h1>Business Proposal</h1>
      <p><em>Prepared for: Acme Corporation</em></p>
      <p><em>Date: May 24, 2024</em></p>
      <h2>1. Executive Summary</h2>
      <p>This proposal outlines a strategic partnership between Blackgate Solutions and Acme Corporation to drive innovation, increase operational efficiency, and deliver measurable results. Our approach combines industry expertise with innovative technology to help Acme Corporation achieve its business objectives.</p>
      <h2>2. Objectives</h2>
      <p>The primary objectives of this partnership are:</p>
      <ul>
        <li>Increase operational efficiency by streamlining key business processes.</li>
        <li>Reduce costs through automation and optimization.</li>
        <li>Enhance customer satisfaction by improving service delivery.</li>
        <li>Drive growth through data-driven decision making.</li>
      </ul>
      <h2>3. Proposed Solution</h2>
      <p>Blackgate Solutions will implement a tailored suite of services designed to address Acme Corporation's unique challenges and goals.</p>
      <h3>3.1 Key Components</h3>
      <ol>
        <li>Process Automation – Implement advanced automation tools to reduce manual effort and minimize errors.</li>
      </ol>
      <pre><code>function calculateROI(cost, benefit, time) {
  const totalBenefit = benefit * time;
  const roi = ((totalBenefit - cost) / cost) * 100;
  return roi.toFixed(2) + '%';
}</code></pre>
    `,
    onSelectionUpdate: ({ editor }) => {
      const textStyle = editor.getAttributes('textStyle') || {}
      const colorAttr = editor.getAttributes('color') || {}
      const highlightAttr = editor.getAttributes('highlight') || {}
      const alignment = editor.getAttributes('textAlign')?.textAlign || 'left'
      const listState = editor.isActive('bulletList') ? 'bulleted' : editor.isActive('orderedList') ? 'numbered' : 'none'

      // Determine style from heading level
      let style: string | undefined
      if (editor.isActive('heading', { level: 1 })) style = 'Heading 1'
      else if (editor.isActive('heading', { level: 2 })) style = 'Heading 2'
      else if (editor.isActive('heading', { level: 3 })) style = 'Heading 3'
      else style = 'Normal'

      dispatch({ type: 'set', payload: {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        superscript: editor.isActive('superscript'),
        subscript: editor.isActive('subscript'),
        alignment,
        list: listState,
        style,
        fontFamily: textStyle['font-family'] || textStyle.fontFamily,
        fontSize: textStyle['font-size'] ? parseInt(String(textStyle['font-size'])) : undefined,
        textColor: colorAttr.color || textStyle.color,
        highlightColor: highlightAttr.color,
      }})
    },
    onUpdate: ({ editor }) => {
      // Keep doc context content in sync for save/export
      const html = editor.getHTML()
      docDispatch({ type: 'content', payload: html })
    },
  })

  // Apply/destroy editor, and sync spellcheck attribute when settings change
  useEffect(()=>{
    if (!editor) return
    try {
      if ((editor as any).view?.dom) {
        ;(editor as any).view.dom.spellcheck = !!settings.enableSpellCheck
      }
    } catch (e) {
      console.error('Failed to set spellcheck on editor DOM:', e)
    }

    return () => { editor?.destroy() }
  },[editor, settings.enableSpellCheck])

  return <Provider editor={editor}>{children}</Provider>
}
