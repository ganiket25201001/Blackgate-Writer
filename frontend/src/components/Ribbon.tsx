import React, { useState } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import RibbonGroup from './ribbon/RibbonGroup'
import RibbonButton from './ribbon/RibbonButton'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import { useEditorInstance } from './editor/editorContext'
import TablePicker from './insert/TablePicker'

const tabs = ['Home','Insert','Design','Layout','Review']

function HomeRibbon(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()

  return (
    <div className="px-4 py-3 border-t border-black/10 text-sm text-text-secondary">
      <div className="flex gap-4 items-start">
        <RibbonGroup title="Clipboard">
          <RibbonButton title="Paste" onClick={()=>{}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </RibbonButton>
          <RibbonButton title="Cut" onClick={()=>{}}>✂</RibbonButton>
          <RibbonButton title="Copy" onClick={()=>{}}>📋</RibbonButton>
          <RibbonButton title="Format Painter" onClick={()=>{}}>🖌</RibbonButton>
        </RibbonGroup>

        <RibbonGroup title="Font">
          <RibbonDropdown value={state.fontFamily} options={["Inter","Arial","Times New Roman","Roboto"]} onSelect={(v)=>dispatch({type:'set', payload:{fontFamily: v}})} />
          <RibbonDropdown value={state.fontSize} options={[8,9,10,11,12,14,16,18,20,24,28,36]} onSelect={(v)=>dispatch({type:'set', payload:{fontSize: Number(v)}})} />
          <RibbonButton title="Bold" active={state.bold} onClick={()=>{
            if (editor) editor.chain().focus().toggleBold().run()
            dispatch({type:'toggle', payload:'bold'})
          }}><b>B</b></RibbonButton>
          <RibbonButton title="Italic" active={state.italic} onClick={()=>dispatch({type:'toggle', payload:'italic'})}><i>I</i></RibbonButton>
          <RibbonButton title="Underline" active={state.underline} onClick={()=>dispatch({type:'toggle', payload:'underline'})}><u>U</u></RibbonButton>
          <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>dispatch({type:'toggle', payload:'strike'})}>S</RibbonButton>
          <RibbonColorPicker label="Text color" color={state.textColor} onChange={(c)=>{ if (editor) editor.chain().focus().setColor(c).run(); dispatch({type:'set', payload:{textColor:c}})}} />
          <RibbonColorPicker label="Highlight" color={state.highlightColor} onChange={(c)=>{ if (editor) editor.chain().focus().toggleHighlight({ color: c }).run(); dispatch({type:'set', payload:{highlightColor:c}})}} />
          <RibbonButton title="Superscript" active={state.superscript} onClick={()=>dispatch({type:'toggle', payload:'superscript'})}>xⁿ</RibbonButton>
          <RibbonButton title="Subscript" active={state.subscript} onClick={()=>dispatch({type:'toggle', payload:'subscript'})}>xₙ</RibbonButton>
        </RibbonGroup>

        <RibbonGroup title="Paragraph">
          <RibbonButton title="Align left" active={state.alignment==='left'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}})}}>≡</RibbonButton>
          <RibbonButton title="Align center" active={state.alignment==='center'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}})}}>≡</RibbonButton>
          <RibbonButton title="Align right" active={state.alignment==='right'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}})}}>≡</RibbonButton>
          <RibbonButton title="Justify" active={state.alignment==='justify'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}})}}>≡</RibbonButton>
          <RibbonButton title="Bulleted list" active={state.list==='bulleted'} onClick={()=>{ if (editor) editor.chain().focus().toggleBulletList().run(); dispatch({type:'set', payload:{list: state.list==='bulleted' ? 'none' : 'bulleted'}})}}>•</RibbonButton>
          <RibbonButton title="Numbered list" active={state.list==='numbered'} onClick={()=>{ if (editor) editor.chain().focus().toggleOrderedList().run(); dispatch({type:'set', payload:{list: state.list==='numbered' ? 'none' : 'numbered'}})}}>1.</RibbonButton>
          <RibbonButton title="Line spacing" onClick={()=>{}}>↕</RibbonButton>
          <RibbonButton title="Decrease indent" onClick={()=>{}}>⟲</RibbonButton>
          <RibbonButton title="Increase indent" onClick={()=>{}}>⟳</RibbonButton>
        </RibbonGroup>

        <RibbonGroup title="Styles">
          <RibbonDropdown value={state.style} options={["Normal","Heading 1","Heading 2","Title"]} onSelect={(v)=>dispatch({type:'set', payload:{style: v}})} />
        </RibbonGroup>

        <RibbonGroup title="Editing">
          <RibbonButton title="Find" onClick={()=>{}}>🔎</RibbonButton>
          <RibbonButton title="Replace" onClick={()=>{}}>↔</RibbonButton>
          <RibbonButton title="Select All" onClick={()=>{ if (editor) editor.chain().focus().selectAll().run() }}>⤫</RibbonButton>
        </RibbonGroup>
      </div>
    </div>
  )
}

export default function Ribbon(){
  const [active, setActive] = useState('Home')
  return (
    <div className="flex flex-col bg-panel border-b border-black/20">
      <div className="flex px-4 py-2 gap-4 items-center">
        {tabs.map(t=> (
          <button key={t} onClick={()=>setActive(t)} className={`px-3 py-1 rounded ${t===active ? 'bg-bg text-text-primary' : 'hover:bg-white/5 text-text-secondary'}`}>{t}</button>
        ))}
      </div>
      {active === 'Home' && <HomeRibbon />}
      {active === 'Insert' && <InsertRibbon />}
    </div>
  )
}

function InsertRibbon(){
  const editor = useEditorInstance()
  const [showTablePicker, setShowTablePicker] = useState(false)

  async function insertImage(){
    const { open } = await import('@tauri-apps/api/dialog')
    const selected = await open({ multiple: false, filters: [{ name: 'Images', extensions: ['png','jpg','jpeg','gif','svg'] }] }) as string | null
    if (!selected || !editor) return
    // call Tauri read_file_base64
    try{
        const { invoke } = await import('@tauri-apps/api/tauri')
        const base64 = await invoke('read_file_base64', { path: selected }) as string
        const ext = selected.split('.').pop() || 'png'
        const dataUrl = `data:image/${ext};base64,${base64}`
        editor.chain().focus().setImage({ src: dataUrl, alt: selected.split(/\\|\//).pop() }).run()
      }catch(e){
        console.error('insertImage error', e)
      }
  }

  function insertLink(){
    if (!editor) return
    const href = prompt('Enter URL')
    if (!href) return
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
  }

  function insertPageBreak(){
    if (!editor) return
    editor.chain().focus().setHorizontalRule().run()
  }

  function insertTextBox(){
    if (!editor) return
    editor.chain().focus().insertContent('<div class="p-3 border border-white/5 rounded">Text box</div>').run()
  }

  function insertSymbol(sym:string){
    if (!editor) return
    editor.chain().focus().insertContent(sym).run()
  }

  function insertTable(rows:number, cols:number){
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTablePicker(false)
  }

  return (
    <div className="px-4 py-3 border-t border-black/10 text-sm text-text-secondary">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <button onClick={insertImage} className="btn">Image</button>
          <button onClick={()=>setShowTablePicker(v=>!v)} className="btn">Table</button>
          <button onClick={insertTextBox} className="btn">Text Box</button>
          <button onClick={()=>{ /* header/footer placeholder */ alert('Header/Footer insert placeholder') }} className="btn">Header / Footer</button>
          <button onClick={insertPageBreak} className="btn">Page Break</button>
          <button onClick={insertLink} className="btn">Link</button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-text-secondary">Symbols</div>
          <button onClick={()=>insertSymbol('©')} className="btn">©</button>
          <button onClick={()=>insertSymbol('®')} className="btn">®</button>
          <button onClick={()=>insertSymbol('–')} className="btn">–</button>
        </div>
      </div>

      {showTablePicker && <div className="mt-3"><TablePicker onInsert={insertTable} /></div>}
    </div>
  )
}
