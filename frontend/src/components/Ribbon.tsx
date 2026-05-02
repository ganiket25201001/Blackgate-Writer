import React, { useState } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import RibbonGroup from './ribbon/RibbonGroup'
import RibbonButton from './ribbon/RibbonButton'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import { useEditorInstance } from './editor/editorContext'
import TablePicker from './insert/TablePicker'

const tabs = ['Home','Insert','Design','Layout','Review']

import { 
  ClipboardPaste, Scissors, Copy, Paintbrush, 
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough as StrikeIcon, 
  Subscript, Superscript, Baseline, Highlighter, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, ListTree, ArrowUpDown, ChevronDown,
  Code, Search, Replace, MousePointer2, Mic
} from 'lucide-react'

function HomeRibbon(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()

  return (
    <div className="px-4 py-3 border-t border-black/10 text-xs text-text-secondary">
      <div className="flex gap-6 items-start">
        
        {/* Clipboard */}
        <RibbonGroup title="Clipboard">
          <div className="flex gap-2">
            <button className="flex flex-col items-center justify-center gap-1 hover:bg-white/5 p-2 rounded">
              <ClipboardPaste size={24} className="text-yellow-500" />
              <span>Paste</span>
            </button>
            <div className="flex flex-col gap-1 justify-center">
              <button className="flex items-center gap-1 hover:bg-white/5 px-1 rounded"><Scissors size={14} /> Cut</button>
              <button className="flex items-center gap-1 hover:bg-white/5 px-1 rounded"><Copy size={14} /> Copy</button>
              <button className="flex items-center gap-1 hover:bg-white/5 px-1 rounded"><Paintbrush size={14} /> Format Painter</button>
            </div>
          </div>
        </RibbonGroup>

        {/* Font */}
        <RibbonGroup title="Font">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <RibbonDropdown value={state.fontFamily} options={["Inter","Arial","Times New Roman","Roboto"]} onSelect={(v)=>dispatch({type:'set', payload:{fontFamily: v}})} />
              <RibbonDropdown value={state.fontSize} options={[8,9,10,11,12,14,16,18,20,24,28,36]} onSelect={(v)=>dispatch({type:'set', payload:{fontSize: Number(v)}})} />
              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button className="hover:bg-white/5 p-1 rounded">A^</button>
                <button className="hover:bg-white/5 p-1 rounded">A_</button>
                <button className="hover:bg-white/5 p-1 rounded ml-1">Aa <ChevronDown size={12} className="inline"/></button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <RibbonButton title="Bold" active={state.bold} onClick={()=>{ if (editor) editor.chain().focus().toggleBold().run(); dispatch({type:'toggle', payload:'bold'})}}><BoldIcon size={14} /></RibbonButton>
              <RibbonButton title="Italic" active={state.italic} onClick={()=>{ if (editor) editor.chain().focus().toggleItalic().run(); dispatch({type:'toggle', payload:'italic'})}}><ItalicIcon size={14} /></RibbonButton>
              <RibbonButton title="Underline" active={state.underline} onClick={()=>{ if (editor) editor.chain().focus().toggleUnderline().run(); dispatch({type:'toggle', payload:'underline'})}}><UnderlineIcon size={14} /></RibbonButton>
              <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>{ if (editor) editor.chain().focus().toggleStrike().run(); dispatch({type:'toggle', payload:'strike'})}}><StrikeIcon size={14} /></RibbonButton>
              <RibbonButton title="Subscript" active={state.subscript} onClick={()=>dispatch({type:'toggle', payload:'subscript'})}><Subscript size={14} /></RibbonButton>
              <RibbonButton title="Superscript" active={state.superscript} onClick={()=>dispatch({type:'toggle', payload:'superscript'})}><Superscript size={14} /></RibbonButton>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <RibbonColorPicker label="Text color" color={state.textColor} onChange={(c)=>{ if (editor) editor.chain().focus().setColor(c).run(); dispatch({type:'set', payload:{textColor:c}})}} />
              <RibbonColorPicker label="Highlight" color={state.highlightColor} onChange={(c)=>{ if (editor) editor.chain().focus().toggleHighlight({ color: c }).run(); dispatch({type:'set', payload:{highlightColor:c}})}} />
            </div>
          </div>
        </RibbonGroup>

        {/* Paragraph */}
        <RibbonGroup title="Paragraph">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <RibbonButton title="Bulleted list" active={state.list==='bulleted'} onClick={()=>{ if (editor) editor.chain().focus().toggleBulletList().run(); dispatch({type:'set', payload:{list: state.list==='bulleted' ? 'none' : 'bulleted'}})} }><List size={14} /><ChevronDown size={10} className="ml-1"/></RibbonButton>
              <RibbonButton title="Numbered list" active={state.list==='numbered'} onClick={()=>{ if (editor) editor.chain().focus().toggleOrderedList().run(); dispatch({type:'set', payload:{list: state.list==='numbered' ? 'none' : 'numbered'}})} }><ListOrdered size={14} /><ChevronDown size={10} className="ml-1"/></RibbonButton>
              <RibbonButton title="Multilevel list" onClick={()=>{}}><ListTree size={14} /><ChevronDown size={10} className="ml-1"/></RibbonButton>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button className="hover:bg-white/5 p-1 rounded">⟲</button>
              <button className="hover:bg-white/5 p-1 rounded">⟳</button>
            </div>
            <div className="flex items-center gap-1">
              <RibbonButton title="Align left" active={state.alignment==='left'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}}) }}><AlignLeft size={14} /></RibbonButton>
              <RibbonButton title="Align center" active={state.alignment==='center'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}}) }}><AlignCenter size={14} /></RibbonButton>
              <RibbonButton title="Align right" active={state.alignment==='right'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}}) }}><AlignRight size={14} /></RibbonButton>
              <RibbonButton title="Justify" active={state.alignment==='justify'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}}) }}><AlignJustify size={14} /></RibbonButton>
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <RibbonButton title="Line spacing" onClick={()=>{}}><ArrowUpDown size={14} /></RibbonButton>
              <RibbonButton title="Code Block" onClick={()=>{ if (editor) editor.chain().focus().toggleCodeBlock().run() }}><Code size={14} /><ChevronDown size={10} className="ml-1"/></RibbonButton>
            </div>
          </div>
        </RibbonGroup>

        {/* Styles */}
        <RibbonGroup title="Styles">
          <div className="flex items-center gap-1 overflow-hidden max-w-xs">
            <button className={`border ${state.style==='Normal' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'} rounded p-2 flex flex-col items-center min-w-16`} onClick={()=>dispatch({type:'set', payload:{style: 'Normal'}})}>
              <span className="text-base text-text-primary">AaBbCcDd</span>
              <span className="text-xs mt-1">Normal</span>
            </button>
            <button className={`border ${state.style==='Heading 1' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'} rounded p-2 flex flex-col items-center min-w-16`} onClick={()=>dispatch({type:'set', payload:{style: 'Heading 1'}})}>
              <span className="text-lg font-bold text-text-primary">AaBbCcDd</span>
              <span className="text-xs mt-1">Heading 1</span>
            </button>
            <button className={`border ${state.style==='Heading 2' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'} rounded p-2 flex flex-col items-center min-w-16`} onClick={()=>dispatch({type:'set', payload:{style: 'Heading 2'}})}>
              <span className="text-base font-bold text-text-primary">AaBbCcDd</span>
              <span className="text-xs mt-1">Heading 2</span>
            </button>
            <button className={`border ${state.style==='Title' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'} rounded p-2 flex flex-col items-center min-w-16`} onClick={()=>dispatch({type:'set', payload:{style: 'Title'}})}>
              <span className="text-xl text-text-primary">AaBbC</span>
              <span className="text-xs mt-1">Title</span>
            </button>
          </div>
        </RibbonGroup>

        {/* Editing */}
        <RibbonGroup title="Editing">
          <div className="flex flex-col gap-1 justify-center">
            <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded"><Search size={14} /> Find</button>
            <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded"><Replace size={14} /> Replace</button>
            <button className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded" onClick={()=>{ if (editor) editor.chain().focus().selectAll().run() }}><MousePointer2 size={14} /> Select</button>
          </div>
        </RibbonGroup>

        {/* Voice */}
        <RibbonGroup title="Voice">
          <button className="flex flex-col items-center justify-center gap-1 hover:bg-white/5 p-2 rounded">
            <Mic size={24} className="text-blue-400" />
            <span>Dictate</span>
          </button>
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
