import React, { useState, useRef, useEffect } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import RibbonGroup from './ribbon/RibbonGroup'
import RibbonButton from './ribbon/RibbonButton'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import TablePicker from './insert/TablePicker'
import FileMenu from './FileMenu'

const tabs = ['Home','Insert','Design','Layout','Review']

import { 
  ClipboardPaste, Scissors, Copy, Paintbrush, 
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough as StrikeIcon, 
  Subscript, Superscript, Type, Highlighter, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Table2,
  List, ListOrdered, ListTree, IndentDecrease, IndentIncrease, ArrowUpDown, Pilcrow,
  Code, CodeXml, Braces, Search, Replace, MousePointer2, Mic, ChevronDown
} from 'lucide-react'

/* ─── Code dropdown ─── */
function CodeDropdown(){
  const editor = useEditorInstance()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!open) return
    const h = (e: MouseEvent)=>{ if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return ()=> document.removeEventListener('mousedown', h)
  },[open])

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(v=>!v)} className="rb" title="Code" style={{ display: 'flex', gap: 2 }}>
        <CodeXml size={14} /><ChevronDown size={8} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ top: '100%', left: 0, minWidth: 180 }}>
          <div className="dropdown-item" style={{ display: 'flex', justifyContent: 'space-between' }}
            onClick={()=>{ if (editor) editor.chain().focus().toggleCodeBlock().run(); setOpen(false) }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Code size={14} /> Code</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Ctrl+Alt+Shift+C</span>
          </div>
          <div className="dropdown-item" style={{ display: 'flex', justifyContent: 'space-between' }}
            onClick={()=>{ if (editor) editor.chain().focus().toggleCode().run(); setOpen(false) }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Braces size={14} /> Inline code</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Ctrl+`</span>
          </div>
          <div className="dropdown-item" style={{ display: 'flex', justifyContent: 'space-between' }}
            onClick={()=>{ if (editor) editor.chain().focus().toggleCodeBlock().run(); setOpen(false) }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CodeXml size={14} /> Code block</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Ctrl+Alt+`</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ━━━━━ HOME RIBBON ━━━━━ */
function HomeRibbon(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()

  return (
    <div className="ribbon-content">
      
      {/* ── Clipboard ── */}
      <RibbonGroup title="Clipboard">
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="rb-large" onClick={()=>document.execCommand('paste')} title="Paste (Ctrl+V)">
            <ClipboardPaste size={22} style={{ color: '#fbbf24' }} />
            <span>Paste</span>
          </button>
          <div className="rb-stack">
            <button onClick={()=>document.execCommand('cut')} title="Cut (Ctrl+X)"><Scissors size={13} /> Cut</button>
            <button onClick={()=>document.execCommand('copy')} title="Copy (Ctrl+C)"><Copy size={13} /> Copy</button>
            <button title="Format Painter"><Paintbrush size={13} /> Format Painter</button>
          </div>
        </div>
      </RibbonGroup>

      {/* ── Font ── */}
      <RibbonGroup title="Font">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <RibbonDropdown wide value={state.fontFamily} options={["Inter","Arial","Times New Roman","Roboto","Georgia","Courier New"]} onSelect={(v)=>{
              dispatch({type:'set', payload:{fontFamily: String(v)}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-family': String(v) }).run()
            }} />
            <RibbonDropdown value={state.fontSize} options={[8,9,10,11,12,14,16,18,20,24,28,36,48,72]} onSelect={(v)=>{
              dispatch({type:'set', payload:{fontSize: Number(v)}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-size': v+'px' }).run()
            }} />
            <div className="divider-v" />
            <button className="rb" title="Increase Font Size" onClick={()=>{
              const ns = Math.min(72, state.fontSize+1)
              dispatch({type:'set', payload:{fontSize: ns}})
            }}>A<sup style={{fontSize:8}}>▲</sup></button>
            <button className="rb" title="Decrease Font Size" onClick={()=>{
              const ns = Math.max(6, state.fontSize-1)
              dispatch({type:'set', payload:{fontSize: ns}})
            }}>A<sub style={{fontSize:8}}>▼</sub></button>
            <button className="rb" title="Change Case" style={{ display: 'flex', gap: 1 }}>
              Aa <ChevronDown size={8} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RibbonButton title="Bold (Ctrl+B)" active={state.bold} onClick={()=>{ if (editor) editor.chain().focus().toggleBold().run(); dispatch({type:'toggle', payload:'bold'})}}><BoldIcon size={14} /></RibbonButton>
            <RibbonButton title="Italic (Ctrl+I)" active={state.italic} onClick={()=>{ if (editor) editor.chain().focus().toggleItalic().run(); dispatch({type:'toggle', payload:'italic'})}}><ItalicIcon size={14} /></RibbonButton>
            <RibbonButton title="Underline (Ctrl+U)" active={state.underline} onClick={()=>{ if (editor) editor.chain().focus().toggleUnderline().run(); dispatch({type:'toggle', payload:'underline'})}}><UnderlineIcon size={14} /></RibbonButton>
            <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>{ if (editor) editor.chain().focus().toggleStrike().run(); dispatch({type:'toggle', payload:'strike'})}}><StrikeIcon size={14} /></RibbonButton>
            <RibbonButton title="Subscript" active={state.subscript} onClick={()=>dispatch({type:'toggle', payload:'subscript'})}><Subscript size={14} /></RibbonButton>
            <RibbonButton title="Superscript" active={state.superscript} onClick={()=>dispatch({type:'toggle', payload:'superscript'})}><Superscript size={14} /></RibbonButton>
            <div className="divider-v" />
            <RibbonColorPicker label="Font Color" color={state.textColor} onChange={(c)=>{ if (editor) editor.chain().focus().setColor(c).run(); dispatch({type:'set', payload:{textColor:c}})}} icon={<span style={{fontSize:14,fontWeight:700}}>A</span>} />
            <RibbonColorPicker label="Text Highlight" color={state.highlightColor} onChange={(c)=>{ if (editor) editor.chain().focus().toggleHighlight({ color: c }).run(); dispatch({type:'set', payload:{highlightColor:c}})}} icon={<Highlighter size={14} />} />
          </div>
        </div>
      </RibbonGroup>

      {/* ── Paragraph ── */}
      <RibbonGroup title="Paragraph">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RibbonButton title="Bulleted List" active={state.list==='bulleted'} onClick={()=>{ if (editor) editor.chain().focus().toggleBulletList().run(); dispatch({type:'set', payload:{list: state.list==='bulleted' ? 'none' : 'bulleted'}})} }>
              <List size={14} /><ChevronDown size={8} style={{marginLeft:1}} />
            </RibbonButton>
            <RibbonButton title="Numbered List" active={state.list==='numbered'} onClick={()=>{ if (editor) editor.chain().focus().toggleOrderedList().run(); dispatch({type:'set', payload:{list: state.list==='numbered' ? 'none' : 'numbered'}})} }>
              <ListOrdered size={14} /><ChevronDown size={8} style={{marginLeft:1}} />
            </RibbonButton>
            <RibbonButton title="Multilevel List" onClick={()=>{}}>
              <ListTree size={14} /><ChevronDown size={8} style={{marginLeft:1}} />
            </RibbonButton>
            <div className="divider-v" />
            <RibbonButton title="Decrease Indent" onClick={()=>{ if (editor) editor.chain().focus().liftListItem('listItem').run() }}>
              <IndentDecrease size={14} />
            </RibbonButton>
            <RibbonButton title="Increase Indent" onClick={()=>{ if (editor) editor.chain().focus().sinkListItem('listItem').run() }}>
              <IndentIncrease size={14} />
            </RibbonButton>
            <RibbonButton title="Show/Hide ¶" onClick={()=> useStore.getState().toggleFormatMarks()}>
              <Pilcrow size={14} />
            </RibbonButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RibbonButton title="Align Left (Ctrl+L)" active={state.alignment==='left'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}}) }}><AlignLeft size={14} /></RibbonButton>
            <RibbonButton title="Center (Ctrl+E)" active={state.alignment==='center'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}}) }}><AlignCenter size={14} /></RibbonButton>
            <RibbonButton title="Align Right (Ctrl+R)" active={state.alignment==='right'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}}) }}><AlignRight size={14} /></RibbonButton>
            <RibbonButton title="Justify (Ctrl+J)" active={state.alignment==='justify'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}}) }}><AlignJustify size={14} /></RibbonButton>
            <div className="divider-v" />
            <RibbonButton title="Line Spacing" onClick={()=>{}}><ArrowUpDown size={14} /></RibbonButton>
            <CodeDropdown />
          </div>
        </div>
      </RibbonGroup>

      {/* ── Styles ── */}
      <RibbonGroup title="Styles">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 2 }}>
          {([
            { key: 'Normal', preview: 'AaBbCcDd', style: {} },
            { key: 'Heading 1', preview: 'AaBbCcDd', style: { fontWeight: 600 } },
            { key: 'Heading 2', preview: 'AaBbCcDd', style: { fontWeight: 600, fontSize: '12px' } },
            { key: 'Title', preview: 'AaBbC', style: { fontSize: '16px', fontWeight: 300 } },
          ] as const).map(s=> (
            <button 
              key={s.key} 
              className={`style-card ${state.style === s.key ? 'active' : ''}`}
              onClick={()=>{
                dispatch({type:'set', payload:{style: s.key}})
                if (!editor) return
                if (s.key === 'Normal') editor.chain().focus().setParagraph().run()
                else if (s.key === 'Heading 1') editor.chain().focus().toggleHeading({level:1}).run()
                else if (s.key === 'Heading 2') editor.chain().focus().toggleHeading({level:2}).run()
                else if (s.key === 'Title') editor.chain().focus().toggleHeading({level:1}).run()
              }}
            >
              <span className="style-preview" style={s.style}>{s.preview}</span>
              <span className="style-label">{s.key}</span>
            </button>
          ))}
        </div>
      </RibbonGroup>

      {/* ── Editing ── */}
      <RibbonGroup title="Editing">
        <div className="rb-stack" style={{ justifyContent: 'center', paddingTop: 2 }}>
          <button title="Find (Ctrl+F)"><Search size={13} /> Find</button>
          <button title="Replace (Ctrl+H)"><Replace size={13} /> Replace</button>
          <button onClick={()=>{ if (editor) editor.chain().focus().selectAll().run() }} title="Select All (Ctrl+A)">
            <MousePointer2 size={13} /> Select <ChevronDown size={8} style={{marginLeft:2}} />
          </button>
        </div>
      </RibbonGroup>

      {/* ── Voice ── */}
      <RibbonGroup title="Voice">
        <button className="rb-large" title="Dictate">
          <Mic size={22} style={{ color: '#60a5fa' }} />
          <span>Dictate</span>
        </button>
      </RibbonGroup>

    </div>
  )
}

/* ━━━━━ INSERT RIBBON ━━━━━ */
function InsertRibbon(){
  const editor = useEditorInstance()
  const [showTablePicker, setShowTablePicker] = useState(false)

  async function insertImage(){
    const { open } = await import('@tauri-apps/api/dialog')
    const selected = await open({ multiple: false, filters: [{ name: 'Images', extensions: ['png','jpg','jpeg','gif','svg'] }] }) as string | null
    if (!selected || !editor) return
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
    <div className="ribbon-content">
      <RibbonGroup title="Pages">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertPageBreak} title="Page Break"><span style={{ fontSize: 13 }}>📄</span> Page Break</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Tables">
        <div style={{ position: 'relative' }}>
          <button className="rb-large" onClick={()=>setShowTablePicker(v=>!v)} title="Insert Table">
            <Table2 size={22} />
            <span>Table</span>
          </button>
          {showTablePicker && <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50 }}><TablePicker onInsert={insertTable} /></div>}
        </div>
      </RibbonGroup>

      <RibbonGroup title="Illustrations">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertImage} title="Insert Image">🖼️ Image</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Links">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertLink} title="Insert Link">🔗 Link</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Text">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertTextBox} title="Text Box">📝 Text Box</button>
          <button onClick={()=>{ if(editor) editor.chain().focus().insertContent('<div style="text-align:center;border-top:1px solid #ccc;padding-top:8px;font-size:10px;">Header</div>').run() }}>📋 Header/Footer</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Symbols">
        <div style={{ display: 'flex', gap: 2, paddingTop: 4 }}>
          <button className="rb" onClick={()=>insertSymbol('©')} title="Copyright">©</button>
          <button className="rb" onClick={()=>insertSymbol('®')} title="Registered">®</button>
          <button className="rb" onClick={()=>insertSymbol('™')} title="Trademark">™</button>
          <button className="rb" onClick={()=>insertSymbol('–')} title="En Dash">–</button>
          <button className="rb" onClick={()=>insertSymbol('—')} title="Em Dash">—</button>
          <button className="rb" onClick={()=>insertSymbol('…')} title="Ellipsis">…</button>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ PLACEHOLDER RIBBONS ━━━━━ */
function DesignRibbon(){
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Document Formatting">
        <div style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
          Theme and style options coming soon
        </div>
      </RibbonGroup>
    </div>
  )
}

function LayoutRibbon(){
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Page Setup">
        <div style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
          Margins, orientation, and size options coming soon
        </div>
      </RibbonGroup>
    </div>
  )
}

function ReviewRibbon(){
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Proofing">
        <div style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: 12 }}>
          Spell check and review tools coming soon
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ MAIN RIBBON ━━━━━ */
export default function Ribbon(){
  const [active, setActive] = useState('Home')
  return (
    <div className="ribbon">
      <div className="tab-bar">
        <div style={{ marginRight: 8 }}>
          <FileMenu />
        </div>
        {tabs.map(t=> (
          <button key={t} onClick={()=>setActive(t)} className={t===active ? 'active' : ''}>{t}</button>
        ))}
      </div>
      {active === 'Home' && <HomeRibbon />}
      {active === 'Insert' && <InsertRibbon />}
      {active === 'Design' && <DesignRibbon />}
      {active === 'Layout' && <LayoutRibbon />}
      {active === 'Review' && <ReviewRibbon />}
    </div>
  )
}
