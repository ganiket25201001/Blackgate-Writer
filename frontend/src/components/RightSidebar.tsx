import React, { useEffect } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import SidebarSection from './sidebar/SidebarSection'
import NumberInput from './sidebar/NumberInput'
import Toggle from './sidebar/Toggle'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import RibbonButton from './ribbon/RibbonButton'
import { 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Table2,
  List, ListOrdered, ListTree, ListChecks,
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough as StrikeIcon,
  Subscript, Superscript, Highlighter, WrapText
} from 'lucide-react'

export default function RightSidebar(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()
  const { rightOpen, toggleRight } = useStore()

  useEffect(()=>{
    const el = document.querySelector('.editor-page') as HTMLElement | null
    if (el){
      if (state.showLineNumbers) el.classList.add('show-line-numbers')
      else el.classList.remove('show-line-numbers')
    }
  },[state.showLineNumbers])

  return (
    <aside className={`right-sidebar ${rightOpen ? 'open' : 'collapsed'}`}>
      {rightOpen && (
        <>
          <div className="right-sidebar-header">
            <div className="title">
              <span className="accent-tri" />
              Format
            </div>
            <button onClick={toggleRight} style={{ color: 'var(--text-secondary)', fontSize: 14 }} title="Close">✕</button>
          </div>

          {/* ── Font ── */}
          <SidebarSection title="Font">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <RibbonDropdown wide value={state.fontFamily} options={["Inter","Arial","Roboto","Times New Roman","Georgia"]} onSelect={(v)=>{ 
                dispatch({type:'set', payload:{fontFamily: String(v)}}); 
                if (editor) editor.chain().focus().setMark('textStyle', { 'font-family': String(v) }).run() 
              }} />
              <input 
                type="number" 
                value={state.fontSize} 
                onChange={e=>{ 
                  const v=Number(e.target.value); 
                  dispatch({type:'set', payload:{fontSize:v}}); 
                  if(editor) editor.chain().focus().setMark('textStyle', { 'font-size': v+'px' }).run()
                }} 
                style={{ width: 48, padding: '4px 6px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-strong)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 12, textAlign: 'center' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 8 }}>
              <RibbonButton title="Bold" active={state.bold} onClick={()=>{ if(editor) editor.chain().focus().toggleBold().run(); dispatch({type:'toggle', payload:'bold'}) }}><BoldIcon size={14} /></RibbonButton>
              <RibbonButton title="Italic" active={state.italic} onClick={()=>{ if(editor) editor.chain().focus().toggleItalic().run(); dispatch({type:'toggle', payload:'italic'}) }}><ItalicIcon size={14} /></RibbonButton>
              <RibbonButton title="Underline" active={state.underline} onClick={()=>{ if(editor) editor.chain().focus().toggleUnderline().run(); dispatch({type:'toggle', payload:'underline'}) }}><UnderlineIcon size={14} /></RibbonButton>
              <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>{ if(editor) editor.chain().focus().toggleStrike().run(); dispatch({type:'toggle', payload:'strike'}) }}><StrikeIcon size={14} /></RibbonButton>
              <div className="divider-v" />
              <RibbonButton title="Subscript" active={state.subscript} onClick={()=>dispatch({type:'toggle', payload:'subscript'})}><Subscript size={14} /></RibbonButton>
              <RibbonButton title="Superscript" active={state.superscript} onClick={()=>dispatch({type:'toggle', payload:'superscript'})}><Superscript size={14} /></RibbonButton>
              <RibbonButton title="Squiggle" onClick={()=>{}}><WrapText size={14} /></RibbonButton>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Text Color</span>
                <RibbonColorPicker label="Text Color" color={state.textColor} onChange={(c)=>{ dispatch({type:'set', payload:{textColor:c}}); if(editor) editor.chain().focus().setColor(c).run() }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Highlight</span>
                <RibbonColorPicker label="Highlight" color={state.highlightColor} onChange={(c)=>{ dispatch({type:'set', payload:{highlightColor:c}}); if(editor) editor.chain().focus().toggleHighlight({ color: c }).run() }} icon={<Highlighter size={12} />} />
              </div>
            </div>
          </SidebarSection>

          {/* ── Paragraph ── */}
          <SidebarSection title="Paragraph">
            <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
              <RibbonButton title="Left" active={state.alignment==='left'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}})}}><AlignLeft size={15} /></RibbonButton>
              <RibbonButton title="Center" active={state.alignment==='center'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}})}}><AlignCenter size={15} /></RibbonButton>
              <RibbonButton title="Right" active={state.alignment==='right'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}})}}><AlignRight size={15} /></RibbonButton>
              <RibbonButton title="Justify" active={state.alignment==='justify'} onClick={()=>{ if(editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}})}}><AlignJustify size={15} /></RibbonButton>
              <RibbonButton title="Table" onClick={()=>{}}><Table2 size={15} /></RibbonButton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <NumberInput value={state.lineSpacing} onChange={(v)=>{ dispatch({type:'set', payload:{lineSpacing:v}}); if(editor) editor.chain().focus().setMark('textStyle', { 'line-height': String(v) }).run() }} label="Line Spacing" min={0.5} max={5} />
              <NumberInput value={state.spacingBefore} onChange={(v)=>{ dispatch({type:'set', payload:{spacingBefore:v}}) }} label="Spacing Before" unit="pt" />
              <NumberInput value={state.spacingAfter} onChange={(v)=>{ dispatch({type:'set', payload:{spacingAfter:v}}) }} label="Spacing After" unit="pt" />
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>Indentation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <NumberInput value={state.indentLeft} onChange={(v)=>{ dispatch({type:'set', payload:{indentLeft:v}}) }} label="Left" unit='"' />
                <NumberInput value={state.indentRight} onChange={(v)=>{ dispatch({type:'set', payload:{indentRight:v}}) }} label="Right" unit='"' />
              </div>
            </div>
          </SidebarSection>

          {/* ── Bullets & Numbering ── */}
          <SidebarSection title="Bullets & Numbering">
            <div style={{ display: 'flex', gap: 4 }}>
              <RibbonButton title="Bulleted" active={state.list==='bulleted'} onClick={()=>{ if(editor) editor.chain().focus().toggleBulletList().run(); dispatch({type:'set', payload:{list: state.list==='bulleted' ? 'none' : 'bulleted'}})}}><List size={16} /></RibbonButton>
              <RibbonButton title="Numbered" active={state.list==='numbered'} onClick={()=>{ if(editor) editor.chain().focus().toggleOrderedList().run(); dispatch({type:'set', payload:{list: state.list==='numbered' ? 'none' : 'numbered'}})}}><ListOrdered size={16} /></RibbonButton>
              <RibbonButton title="Multilevel" onClick={()=>{}}><ListTree size={16} /></RibbonButton>
              <RibbonButton title="Checklist" onClick={()=>{}}><ListChecks size={16} /></RibbonButton>
            </div>
          </SidebarSection>

          {/* ── Code ── */}
          <SidebarSection title="Code">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Code Color Theme</div>
                <RibbonDropdown wide value="Night Owl" options={["Night Owl","Dracula","GitHub Dark","Monokai","One Dark Pro"]} onSelect={()=>{}} />
              </div>
              <Toggle checked={state.showLineNumbers} onChange={(b)=>dispatch({type:'set', payload:{showLineNumbers: b}})} label="Show Line Numbers" />
            </div>
          </SidebarSection>

          {/* ── Page ── */}
          <SidebarSection title="Page">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 70 }}>Page Color</span>
                <RibbonColorPicker label="Page Color" color={state.pageColor} onChange={(c)=>dispatch({type:'set', payload:{pageColor:c}})} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Page Margins</div>
                <RibbonDropdown wide value="Normal" options={["Normal","Narrow","Moderate","Wide"]} onSelect={(v)=>{
                  const presets: Record<string,{top:number;right:number;bottom:number;left:number}> = {
                    'Normal': {top:32,right:32,bottom:32,left:32},
                    'Narrow': {top:16,right:16,bottom:16,left:16},
                    'Moderate': {top:32,right:24,bottom:32,left:24},
                    'Wide': {top:32,right:48,bottom:32,left:48},
                  }
                  const m = presets[String(v)] || presets.Normal
                  dispatch({type:'set', payload:{pageMargins: m}})
                }} />
              </div>
            </div>
          </SidebarSection>
        </>
      )}
    </aside>
  )
}
