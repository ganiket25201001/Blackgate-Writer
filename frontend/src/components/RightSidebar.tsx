import React, { useState, useEffect } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import { useEditorInstance } from './editor/editorContext'
import SidebarSection from './sidebar/SidebarSection'
import NumberInput from './sidebar/NumberInput'
import Toggle from './sidebar/Toggle'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import RibbonButton from './ribbon/RibbonButton'

export default function RightSidebar(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()
  const [open, setOpen] = useState(true)

  useEffect(()=>{
    // sync page color to editor page
    const el = document.querySelector('.editor-page') as HTMLElement | null
    if (el) el.style.background = state.pageColor
    // margins
    if (el){
      el.style.paddingTop = state.pageMargins.top + 'px'
      el.style.paddingRight = state.pageMargins.right + 'px'
      el.style.paddingBottom = state.pageMargins.bottom + 'px'
      el.style.paddingLeft = state.pageMargins.left + 'px'
      if (state.showLineNumbers) el.classList.add('show-line-numbers')
      else el.classList.remove('show-line-numbers')
    }
  },[state.pageColor, state.pageMargins, state.showLineNumbers])

  function toggleStyle(styleKey: keyof typeof state){
    dispatch({ type: 'toggle', payload: styleKey })
  }

  return (
    <aside className={`transition-all duration-300 ${open ? 'w-72 p-4' : 'w-12 p-2'} bg-panel border-l border-black/20 overflow-auto`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`font-semibold ${open ? '' : 'hidden'}`}>Format</div>
        <button onClick={()=>setOpen(o=>!o)} title={open ? 'Collapse' : 'Expand'} className="w-8 h-8 rounded hover:bg-white/5">{open ? '‹' : '›'}</button>
      </div>

      {open ? (
        <div>
          <SidebarSection title="Font">
            <div className="flex items-center gap-2">
              <RibbonDropdown value={state.fontFamily} options={["Inter","Arial","Roboto","Times New Roman"]} onSelect={(v)=>{ dispatch({type:'set', payload:{fontFamily: v}}); if (editor) editor.chain().focus().setMark('textStyle', { 'font-family': String(v) }).run() }} />
              <input type="number" value={state.fontSize} onChange={e=>{ const v=Number(e.target.value); dispatch({type:'set', payload:{fontSize:v}}); if(editor) editor.chain().focus().setMark('textStyle', { 'font-size': v+'px' }).run()}} className="w-20 bg-white/5 rounded px-2 py-1 text-sm" />
            </div>
            <div className="flex gap-2">
              <RibbonButton title="Bold" active={state.bold} onClick={()=>{ if(editor) editor.chain().focus().toggleBold().run(); toggleStyle('bold') }}>B</RibbonButton>
              <RibbonButton title="Italic" active={state.italic} onClick={()=>{ if(editor) editor.chain().focus().toggleItalic().run(); toggleStyle('italic') }}>I</RibbonButton>
              <RibbonButton title="Underline" active={state.underline} onClick={()=>{ if(editor) editor.chain().focus().toggleUnderline().run(); toggleStyle('underline') }}>U</RibbonButton>
              <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>{ if(editor) editor.chain().focus().toggleStrike().run(); toggleStyle('strike') }}>S</RibbonButton>
              <RibbonColorPicker label="Text color" color={state.textColor} onChange={(c)=>{ dispatch({type:'set', payload:{textColor:c}}); if(editor) editor.chain().focus().setColor(c).run() }} />
              <RibbonColorPicker label="Highlight" color={state.highlightColor} onChange={(c)=>{ dispatch({type:'set', payload:{highlightColor:c}}); if(editor) editor.chain().focus().toggleHighlight({ color: c }).run() }} />
            </div>
          </SidebarSection>

          <SidebarSection title="Paragraph">
            <div className="flex gap-2">
              <RibbonButton title="Left" active={state.alignment==='left'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}})}}>L</RibbonButton>
              <RibbonButton title="Center" active={state.alignment==='center'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}})}}>C</RibbonButton>
              <RibbonButton title="Right" active={state.alignment==='right'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}})}}>R</RibbonButton>
              <RibbonButton title="Justify" active={state.alignment==='justify'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}})}}>J</RibbonButton>
            </div>
            <div className="mt-2">
              <div className="text-xs text-text-secondary mb-1">Line spacing</div>
              <input type="range" min="1" max="3" step="0.1" value={state.lineSpacing} onChange={e=>{ const v=Number(e.target.value); dispatch({type:'set', payload:{lineSpacing:v}}); if(editor) editor.chain().focus().setMark('textStyle', { 'line-height': String(v) }).run() }} />
            </div>
            <NumberInput value={state.spacingBefore} onChange={(v)=>{ dispatch({type:'set', payload:{spacingBefore:v}}); if (editor) editor.chain().focus().setMark('textStyle', { 'margin-top': v+'px' }).run() }} label="Spacing before" />
            <NumberInput value={state.spacingAfter} onChange={(v)=>{ dispatch({type:'set', payload:{spacingAfter:v}}); if (editor) editor.chain().focus().setMark('textStyle', { 'margin-bottom': v+'px' }).run() }} label="Spacing after" />
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs text-text-secondary mb-2">Indentation</div>
              <div className="flex gap-2">
                <NumberInput value={state.indentLeft} onChange={(v)=>{ dispatch({type:'set', payload:{indentLeft:v}}); if (editor) editor.chain().focus().setNode('paragraph', { style: `margin-left:${v}px` }).run() }} label="Left" />
                <NumberInput value={state.indentRight} onChange={(v)=>{ dispatch({type:'set', payload:{indentRight:v}}); if (editor) editor.chain().focus().setNode('paragraph', { style: `margin-right:${v}px` }).run() }} label="Right" />
              </div>
            </div>
          </SidebarSection>

          <SidebarSection title="Bullets & Numbering">
            <div className="flex gap-2 mb-2">
              <RibbonButton title="Bulleted" active={state.list==='bulleted'} onClick={()=>{ if(editor) editor.chain().focus().toggleBulletList().run(); dispatch({type:'set', payload:{list: state.list==='bulleted' ? 'none' : 'bulleted'}})}}>•</RibbonButton>
              <RibbonButton title="Numbered" active={state.list==='numbered'} onClick={()=>{ if(editor) editor.chain().focus().toggleOrderedList().run(); dispatch({type:'set', payload:{list: state.list==='numbered' ? 'none' : 'numbered'}})}}>1.</RibbonButton>
              <RibbonDropdown value={state.listStyle} options={["disc","circle","square","decimal"]} onSelect={(v)=>dispatch({type:'set', payload:{listStyle: String(v)}})} />
            </div>
          </SidebarSection>

          <SidebarSection title="Code">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs text-text-secondary mb-1">Code Color Theme</div>
                <RibbonDropdown value="Night Owl" options={["Night Owl","Dracula","GitHub Dark","Monokai"]} onSelect={()=>{}} />
              </div>
              <Toggle checked={state.showLineNumbers} onChange={(b)=>dispatch({type:'set', payload:{showLineNumbers: b}})} label="Show Line Numbers" />
            </div>
          </SidebarSection>

          <SidebarSection title="Page">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs text-text-secondary mb-1">Page Color</div>
                <RibbonColorPicker label="" color={state.pageColor} onChange={(c)=>dispatch({type:'set', payload:{pageColor:c}})} />
              </div>
              <div>
                <div className="text-xs text-text-secondary mb-2">Page Margins</div>
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput value={state.pageMargins.top} onChange={(v)=>dispatch({type:'set', payload:{pageMargins:{...state.pageMargins, top:v}}})} label="Top" />
                  <NumberInput value={state.pageMargins.bottom} onChange={(v)=>dispatch({type:'set', payload:{pageMargins:{...state.pageMargins, bottom:v}}})} label="Bottom" />
                  <NumberInput value={state.pageMargins.left} onChange={(v)=>dispatch({type:'set', payload:{pageMargins:{...state.pageMargins, left:v}}})} label="Left" />
                  <NumberInput value={state.pageMargins.right} onChange={(v)=>dispatch({type:'set', payload:{pageMargins:{...state.pageMargins, right:v}}})} label="Right" />
                </div>
              </div>
            </div>
          </SidebarSection>
        </div>
      ) : null}
    </aside>
  )
}
