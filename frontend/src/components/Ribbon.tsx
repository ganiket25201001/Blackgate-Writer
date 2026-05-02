import React, { useState, useRef, useEffect } from 'react'
import { useRibbon } from './ribbon/ribbonState'
import RibbonGroup from './ribbon/RibbonGroup'
import RibbonButton from './ribbon/RibbonButton'
import RibbonDropdown from './ribbon/RibbonDropdown'
import RibbonColorPicker from './ribbon/RibbonColorPicker'
import LineSpacingDropdown from './ribbon/LineSpacingDropdown'
import { useEditorInstance } from './editor/editorContext'
import { useStore } from '../store/useStore'
import { useSettings } from '../contexts/settingsContext'
import TablePicker from './insert/TablePicker'
import FileMenu from './FileMenu'

const tabs = ['Home','Insert','Design','Layout','References','Review','View','Help']

import { 
  ClipboardPaste, Scissors, Copy, Paintbrush, 
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, Strikethrough as StrikeIcon, 
  Subscript, Superscript, Highlighter, Eraser,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Table2,
  List, ListOrdered, ListTree, IndentDecrease, IndentIncrease, Pilcrow,
  Code, CodeXml, Braces, Search, Replace, MousePointer2, Mic, ChevronDown,
  Image as ImageIcon, Shapes, Smile, PieChart, Focus, Link2, Bookmark, 
  Hash, LayoutTemplate, SquareAsterisk, CalendarDays, CaseUpper, CheckCircle,
  Eye, BookOpen, FileText, Globe, Columns, ZoomIn, Scaling, Ruler,
  SpellCheck, MessageSquarePlus, MessageSquareX, History, FileCheck, Check, X, ArrowRight, ArrowLeft,
  Palette, CaseSensitive, BookMarked, Quote, PanelTop, ArrowDownToLine, Droplets, Grid3X3, ArrowUpFromLine, BookUp, ShieldQuestion
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

/* ─── Change Case dropdown ─── */
function ChangeCaseDropdown(){
  const editor = useEditorInstance()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!open) return
    const h = (e: MouseEvent)=>{ if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return ()=> document.removeEventListener('mousedown', h)
  },[open])

  const applyCase = (type: 'lower' | 'upper' | 'capitalize') => {
    if (!editor) return
    const { state, view } = editor
    const { from, to } = state.selection
    if (from === to) return

    const tr = state.tr
    const textNodes: Array<{pos: number, node: any}> = []
    
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isText) textNodes.push({ pos, node })
    })

    for (let i = textNodes.length - 1; i >= 0; i--) {
      const { pos, node } = textNodes[i]
      const start = Math.max(from, pos)
      const end = Math.min(to, pos + node.nodeSize)
      const text = node.text?.slice(start - pos, end - pos) || ''
      
      let newText = text
      if (type === 'lower') newText = text.toLowerCase()
      else if (type === 'upper') newText = text.toUpperCase()
      else if (type === 'capitalize') newText = text.replace(/\b\w/g, (c: string) => c.toUpperCase())
      
      tr.replaceWith(start, end, state.schema.text(newText, node.marks))
    }
    
    view.dispatch(tr)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(v=>!v)} className="rb" title="Change Case" style={{ display: 'flex', gap: 1 }}>
        Aa <ChevronDown size={8} />
      </button>
      {open && (
        <div className="dropdown-menu" style={{ top: '100%', left: 0, minWidth: 150 }}>
          <div className="dropdown-item" onClick={()=>applyCase('lower')}>lowercase</div>
          <div className="dropdown-item" onClick={()=>applyCase('upper')}>UPPERCASE</div>
          <div className="dropdown-item" onClick={()=>applyCase('capitalize')}>Capitalize Each Word</div>
        </div>
      )}
    </div>
  )
}

let cachedLocalFonts: string[] | null = null;

/* ━━━━━ HOME RIBBON ━━━━━ */
function HomeRibbon(){
  const { state, dispatch } = useRibbon()
  const editor = useEditorInstance()
  const [fontOptions, setFontOptions] = useState<string[]>(
    cachedLocalFonts || ["Inter","Arial","Times New Roman","Roboto","Georgia","Courier New"]
  )

  useEffect(() => {
    if (cachedLocalFonts) return
    if ('queryLocalFonts' in window) {
      (window as any).queryLocalFonts().then((fonts: any[]) => {
        const families = Array.from(new Set(fonts.map(f => f.family))).sort() as string[]
        if (families.length > 0) {
           cachedLocalFonts = families
           setFontOptions(families)
        }
      }).catch((e:any) => console.log("Local fonts permission denied or failed", e))
    }
  }, [])

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
            <RibbonDropdown wide value={state.fontFamily || 'Inter'} options={fontOptions} onSelect={(v)=>{
              dispatch({type:'set', payload:{fontFamily: String(v)}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-family': String(v) }).run()
            }} />
            <RibbonDropdown value={state.fontSize || 11} options={[8,9,10,11,12,14,16,18,20,24,28,36,48,72]} onSelect={(v)=>{
              dispatch({type:'set', payload:{fontSize: Number(v)}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-size': v+'px' }).run()
            }} />
            <div className="divider-v" />
            <button className="rb" title="Increase Font Size (Ctrl+Shift+>)" onClick={()=>{
              const ns = Math.min(72, (state.fontSize || 11)+1)
              dispatch({type:'set', payload:{fontSize: ns}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-size': ns+'px' }).run()
            }}>A<sup style={{fontSize:8}}>▲</sup></button>
            <button className="rb" title="Decrease Font Size (Ctrl+Shift+<)" onClick={()=>{
              const ns = Math.max(6, (state.fontSize || 11)-1)
              dispatch({type:'set', payload:{fontSize: ns}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'font-size': ns+'px' }).run()
            }}>A<sub style={{fontSize:8}}>▼</sub></button>
            <ChangeCaseDropdown />
            <div className="divider-v" />
            <button className="rb" title="Clear All Formatting" onClick={()=>{
               if (editor) editor.chain().focus().unsetAllMarks().clearNodes().run()
            }}>
              <Eraser size={14} style={{ color: '#fbbf24' }}/>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RibbonButton title="Bold (Ctrl+B)" active={state.bold} onClick={()=>{ if (editor) editor.chain().focus().toggleBold().run(); dispatch({type:'toggle', payload:'bold'})}}><BoldIcon size={14} /></RibbonButton>
            <RibbonButton title="Italic (Ctrl+I)" active={state.italic} onClick={()=>{ if (editor) editor.chain().focus().toggleItalic().run(); dispatch({type:'toggle', payload:'italic'})}}><ItalicIcon size={14} /></RibbonButton>
            <RibbonButton title="Underline (Ctrl+U)" active={state.underline} onClick={()=>{ if (editor) editor.chain().focus().toggleUnderline().run(); dispatch({type:'toggle', payload:'underline'})}}><UnderlineIcon size={14} /></RibbonButton>
            <RibbonButton title="Strikethrough" active={state.strike} onClick={()=>{ if (editor) editor.chain().focus().toggleStrike().run(); dispatch({type:'toggle', payload:'strike'})}}><StrikeIcon size={14} /></RibbonButton>
            <RibbonButton title="Subscript" active={state.subscript} onClick={()=>{ if (editor) editor.chain().focus().toggleSubscript().run(); dispatch({type:'toggle', payload:'subscript'})}}><Subscript size={14} /></RibbonButton>
            <RibbonButton title="Superscript" active={state.superscript} onClick={()=>{ if (editor) editor.chain().focus().toggleSuperscript().run(); dispatch({type:'toggle', payload:'superscript'})}}><Superscript size={14} /></RibbonButton>
            <div className="divider-v" />
            <RibbonColorPicker label="Text Highlight" color={state.highlightColor} onChange={(c)=>{ if (editor) editor.chain().focus().toggleHighlight({ color: c }).run(); dispatch({type:'set', payload:{highlightColor:c}})}} icon={<Highlighter size={14} />} />
            <RibbonColorPicker label="Font Color" color={state.textColor} onChange={(c)=>{ if (editor) editor.chain().focus().setColor(c).run(); dispatch({type:'set', payload:{textColor:c}})}} icon={<span style={{fontSize:14,fontWeight:700}}>A</span>} />
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
            <div className="divider-v" />
            <RibbonButton title="Show/Hide ¶" active={state.showFormatMarks} onClick={()=> useStore.getState().toggleFormatMarks()}>
              <Pilcrow size={14} />
            </RibbonButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RibbonButton title="Align Left (Ctrl+L)" active={state.alignment==='left'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('left').run(); dispatch({type:'set', payload:{alignment:'left'}}) }}><AlignLeft size={14} /></RibbonButton>
            <RibbonButton title="Center (Ctrl+E)" active={state.alignment==='center'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('center').run(); dispatch({type:'set', payload:{alignment:'center'}}) }}><AlignCenter size={14} /></RibbonButton>
            <RibbonButton title="Align Right (Ctrl+R)" active={state.alignment==='right'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('right').run(); dispatch({type:'set', payload:{alignment:'right'}}) }}><AlignRight size={14} /></RibbonButton>
            <RibbonButton title="Justify (Ctrl+J)" active={state.alignment==='justify'} onClick={()=>{ if (editor) editor.chain().focus().setTextAlign('justify').run(); dispatch({type:'set', payload:{alignment:'justify'}}) }}><AlignJustify size={14} /></RibbonButton>
            <div className="divider-v" />
            <LineSpacingDropdown current={state.lineSpacing} onSelect={(v)=>{
              dispatch({type:'set', payload:{lineSpacing:v}})
              if (editor) editor.chain().focus().setMark('textStyle', { 'line-height': String(v) }).run()
            }} />
            <div className="divider-v" />
            <button className="rb" title="Borders"><Grid3X3 size={14} /><ChevronDown size={8} style={{marginLeft:1}}/></button>
            <CodeDropdown />
          </div>
        </div>
      </RibbonGroup>

      {/* ── Styles ── */}
      <RibbonGroup title="Styles">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 2 }}>
          {([
            { key: 'Normal', preview: 'AaBbCcDd', style: {} },
            { key: 'No Spacing', preview: 'AaBbCcDd', style: { lineHeight: 1 } },
            { key: 'Heading 1', preview: 'AaBbCcDd', style: { fontWeight: 600, color: '#60a5fa' } },
            { key: 'Heading 2', preview: 'AaBbCcDd', style: { fontWeight: 600, fontSize: '12px', color: '#60a5fa' } },
            { key: 'Heading 3', preview: 'AaBbCcDd', style: { fontWeight: 600, fontSize: '11px', color: '#60a5fa' } },
            { key: 'Title', preview: 'AaBbC', style: { fontSize: '16px', fontWeight: 300 } },
          ] as const).map(s=> (
            <button 
              key={s.key} 
              className={`style-card ${state.style === s.key ? 'active' : ''}`}
              onClick={()=>{
                dispatch({type:'set', payload:{style: s.key}})
                if (!editor) return
                if (s.key === 'Normal') editor.chain().focus().setParagraph().run()
                else if (s.key === 'No Spacing') { editor.chain().focus().setParagraph().run(); editor.chain().focus().setMark('textStyle', { 'line-height': '1' }).run() }
                else if (s.key === 'Heading 1') editor.chain().focus().toggleHeading({level:1}).run()
                else if (s.key === 'Heading 2') editor.chain().focus().toggleHeading({level:2}).run()
                else if (s.key === 'Heading 3') editor.chain().focus().toggleHeading({level:3}).run()
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
          <button title="Find (Ctrl+F)" onClick={()=>{ document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', ctrlKey: true })) }}><Search size={13} /> Find</button>
          <button title="Replace (Ctrl+H)" onClick={()=>{ document.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', ctrlKey: true })) }}><Replace size={13} /> Replace</button>
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

  function insertTable(rows:number, cols:number){
    if (!editor) return
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTablePicker(false)
  }

  return (
    <div className="ribbon-content">
      <RibbonGroup title="Pages">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Cover Page"><LayoutTemplate size={13} /> Cover Page <ChevronDown size={8}/></button>
          <button onClick={insertPageBreak} title="Blank Page"><FileText size={13} /> Blank Page</button>
          <button onClick={insertPageBreak} title="Page Break"><ArrowDownToLine size={13} /> Page Break</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Tables">
        <div style={{ position: 'relative' }}>
          <button className="rb-large" onClick={()=>setShowTablePicker(v=>!v)} title="Insert Table">
            <Table2 size={22} style={{ color: '#60a5fa' }}/>
            <span>Table <ChevronDown size={10} style={{display:'inline', marginLeft:2}}/></span>
          </button>
          {showTablePicker && <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50 }}><TablePicker onInsert={insertTable} /></div>}
        </div>
      </RibbonGroup>

      <RibbonGroup title="Illustrations">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button onClick={insertImage} title="Pictures" className="rb-large" style={{width: 60}}>
            <ImageIcon size={22} style={{ color: '#34d399' }}/>
            <span>Pictures</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Shapes"><Shapes size={13} /> Shapes <ChevronDown size={8}/></button>
            <button title="Icons"><Smile size={13} /> Icons</button>
            <button title="Chart"><PieChart size={13} /> Chart</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Links">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertLink} title="Link"><Link2 size={13} /> Link <ChevronDown size={8}/></button>
          <button title="Bookmark"><Bookmark size={13} /> Bookmark</button>
          <button title="Cross-reference"><ArrowRight size={13} /> Cross-reference</button>
        </div>
      </RibbonGroup>
      
      <RibbonGroup title="Header & Footer">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Header"><PanelTop size={13} /> Header <ChevronDown size={8}/></button>
          <button title="Footer"><PanelTop size={13} style={{transform: 'rotate(180deg)'}} /> Footer <ChevronDown size={8}/></button>
          <button title="Page Number"><Hash size={13} /> Page Number <ChevronDown size={8}/></button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Text">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button onClick={insertTextBox} title="Text Box"><CaseUpper size={13} /> Text Box <ChevronDown size={8}/></button>
          <button title="Date & Time"><CalendarDays size={13} /> Date & Time</button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Symbols">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Equation" style={{width: 60}}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems:'center', justifyContent:'center' }}>π</span>
            <span>Equation</span>
          </button>
          <button className="rb-large" title="Symbol" style={{width: 60}}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems:'center', justifyContent:'center' }}>Ω</span>
            <span>Symbol</span>
          </button>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ DESIGN RIBBON ━━━━━ */
function DesignRibbon(){
  const { state, dispatch } = useRibbon()
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Themes">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
          <button className="rb-large" title="Themes">
            <Palette size={22} style={{ color: '#fbbf24' }}/>
            <span>Themes <ChevronDown size={10} style={{display:'inline'}}/></span>
          </button>
          <div className="divider-v" />
          <div style={{ display: 'flex', gap: 4 }}>
            {['Office', 'Colorful', 'Dark', 'Ocean', 'Forest'].map((theme, i) => (
               <button key={theme} className="style-card" style={{ width: 64, height: 48, position: 'relative' }}>
                 <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 20, display: 'flex' }}>
                   <div style={{ flex: 1, background: `hsl(${i*60}, 70%, 50%)` }} />
                   <div style={{ flex: 1, background: `hsl(${i*60+30}, 70%, 50%)` }} />
                 </div>
                 <span className="style-label" style={{ position: 'absolute', bottom: 4, left: 0, right: 0 }}>{theme}</span>
               </button>
            ))}
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Document Formatting">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Colors"><Palette size={13} /> Colors <ChevronDown size={8}/></button>
          <button title="Fonts"><CaseUpper size={13} /> Fonts <ChevronDown size={8}/></button>
          <button title="Effects"><Shapes size={13} /> Effects <ChevronDown size={8}/></button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Page Background">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Watermark"><Droplets size={13} /> Watermark <ChevronDown size={8}/></button>
          <button title="Page Borders"><Grid3X3 size={13} /> Page Borders</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8 }}>
            <span style={{ fontSize: 11 }}>Page Color</span>
            <RibbonColorPicker label="Page Color" color={state.pageColor} onChange={(c)=>dispatch({type:'set', payload:{pageColor:c}})} />
          </div>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ LAYOUT RIBBON ━━━━━ */
function LayoutRibbon(){
  const { state, dispatch } = useRibbon()
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Page Setup">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
           <button className="rb-large" title="Margins">
              <LayoutTemplate size={22} style={{ color: '#60a5fa' }}/>
              <span>Margins <ChevronDown size={10} style={{display:'inline'}}/></span>
           </button>
           <button className="rb-large" title="Orientation">
              <FileText size={22} style={{ color: '#fbbf24' }}/>
              <span>Orientation <ChevronDown size={10} style={{display:'inline'}}/></span>
           </button>
           <button className="rb-large" title="Size">
              <Scaling size={22} style={{ color: '#34d399' }}/>
              <span>Size <ChevronDown size={10} style={{display:'inline'}}/></span>
           </button>
           <button className="rb-large" title="Columns">
              <Columns size={22} />
              <span>Columns <ChevronDown size={10} style={{display:'inline'}}/></span>
           </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Breaks"><ArrowDownToLine size={13} /> Breaks <ChevronDown size={8}/></button>
            <button title="Line Numbers"><ListOrdered size={13} /> Line Numbers <ChevronDown size={8}/></button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Paragraph">
        <div style={{ display: 'flex', gap: 16, padding: '4px 12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Indent</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, width: 24 }}>Left:</span>
              <input type="number" value={state.indentLeft} onChange={e=>dispatch({type:'set', payload:{indentLeft:Number(e.target.value)}})} className="num-input" style={{ width: 48, height: 20 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, width: 24 }}>Right:</span>
              <input type="number" value={state.indentRight} onChange={e=>dispatch({type:'set', payload:{indentRight:Number(e.target.value)}})} className="num-input" style={{ width: 48, height: 20 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Spacing</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, width: 36 }}>Before:</span>
              <input type="number" value={state.spacingBefore} onChange={e=>dispatch({type:'set', payload:{spacingBefore:Number(e.target.value)}})} className="num-input" style={{ width: 48, height: 20 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, width: 36 }}>After:</span>
              <input type="number" value={state.spacingAfter} onChange={e=>dispatch({type:'set', payload:{spacingAfter:Number(e.target.value)}})} className="num-input" style={{ width: 48, height: 20 }} />
            </div>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Arrange">
         <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
           <div className="rb-stack">
            <button title="Position"><LayoutTemplate size={13} /> Position <ChevronDown size={8}/></button>
            <button title="Wrap Text"><Quote size={13} /> Wrap Text <ChevronDown size={8}/></button>
           </div>
           <div className="rb-stack">
            <button title="Bring Forward"><ArrowUpFromLine size={13} /> Bring Forward <ChevronDown size={8}/></button>
            <button title="Send Backward"><ArrowDownToLine size={13} /> Send Backward <ChevronDown size={8}/></button>
           </div>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ REFERENCES RIBBON ━━━━━ */
function ReferencesRibbon(){
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Table of Contents">
         <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Table of Contents">
            <ListTree size={22} style={{ color: '#60a5fa' }}/>
            <span>Table of Contents <ChevronDown size={10} style={{display:'inline'}}/></span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Add Text"><CaseUpper size={13} /> Add Text <ChevronDown size={8}/></button>
            <button title="Update Table"><History size={13} /> Update Table</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Footnotes">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Insert Footnote">
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems:'center', justifyContent:'center' }}>ab<sup>1</sup></span>
            <span>Insert Footnote</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Insert Endnote"><span style={{fontSize:14, fontWeight:700}}>ab<sup>i</sup></span> Insert Endnote</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Citations & Bibliography">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Insert Citation"><Quote size={13} /> Insert Citation <ChevronDown size={8}/></button>
          <button title="Manage Sources"><BookMarked size={13} /> Manage Sources</button>
          <button title="Bibliography"><BookUp size={13} /> Bibliography <ChevronDown size={8}/></button>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ REVIEW RIBBON ━━━━━ */
function ReviewRibbon(){
  const { settings, updateSettings } = useSettings()
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Proofing">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Spelling & Grammar (F7)">
            <SpellCheck size={22} style={{ color: '#60a5fa' }}/>
            <span>Spelling & Grammar</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Thesaurus"><BookOpen size={13} /> Thesaurus</button>
            <button title="Word Count"><FileCheck size={13} /> Word Count</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Comments">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="New Comment">
            <MessageSquarePlus size={22} style={{ color: '#fbbf24' }}/>
            <span>New Comment</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Delete"><MessageSquareX size={13} /> Delete <ChevronDown size={8}/></button>
            <button title="Previous"><ArrowLeft size={13} /> Previous</button>
            <button title="Next"><ArrowRight size={13} /> Next</button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Tracking">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Track Changes">
            <History size={22} style={{ color: '#34d399' }}/>
            <span>Track Changes <ChevronDown size={10} style={{display:'inline'}}/></span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Display for Review"><Eye size={13} /> Display for Review <ChevronDown size={8}/></button>
            <button title="Show Markup"><ShieldQuestion size={13} /> Show Markup <ChevronDown size={8}/></button>
          </div>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Changes">
        <div className="rb-stack" style={{ paddingTop: 4, justifyContent: 'center', height: '100%' }}>
          <button title="Accept"><CheckCircle size={13} style={{ color: '#34d399' }}/> Accept <ChevronDown size={8}/></button>
          <button title="Reject"><X size={13} style={{ color: '#ef4444' }}/> Reject <ChevronDown size={8}/></button>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ VIEW RIBBON ━━━━━ */
function ViewRibbon(){
  const { zoom, setZoom, toggleLeft } = useStore()
  const { state, dispatch } = useRibbon()

  return (
    <div className="ribbon-content">
      <RibbonGroup title="Views">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Read Mode">
            <BookOpen size={22} style={{ color: '#60a5fa' }}/>
            <span>Read Mode</span>
          </button>
          <button className="rb-large" title="Print Layout">
            <FileText size={22} style={{ color: '#fbbf24' }}/>
            <span>Print Layout</span>
          </button>
          <button className="rb-large" title="Web Layout">
            <Globe size={22} style={{ color: '#34d399' }}/>
            <span>Web Layout</span>
          </button>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Show">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={state.showRuler} onChange={(e)=>dispatch({type:'set', payload:{showRuler:e.target.checked}})} />
            Ruler
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>
            <input type="checkbox" />
            Gridlines
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '2px 8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={useStore.getState().leftOpen} onChange={()=>toggleLeft()} />
            Navigation Pane
          </label>
        </div>
      </RibbonGroup>

      <RibbonGroup title="Zoom">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Zoom" onClick={()=>setZoom(1)}>
            <ZoomIn size={22} />
            <span>Zoom <ChevronDown size={10} style={{display:'inline'}}/></span>
          </button>
          <button className="rb-large" title="100%" onClick={()=>setZoom(1)}>
            <span style={{ fontSize: 16, fontWeight: 700, padding: 2 }}>100%</span>
            <span>100%</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="One Page"><FileText size={13} /> One Page</button>
            <button title="Multiple Pages"><Columns size={13} /> Multiple Pages</button>
            <button title="Page Width"><Scaling size={13} /> Page Width</button>
          </div>
        </div>
      </RibbonGroup>
    </div>
  )
}

/* ━━━━━ HELP RIBBON ━━━━━ */
function HelpRibbon(){
  return (
    <div className="ribbon-content">
      <RibbonGroup title="Help">
        <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
          <button className="rb-large" title="Help">
            <ShieldQuestion size={22} style={{ color: '#60a5fa' }}/>
            <span>Help</span>
          </button>
          <div className="divider-v" />
          <div className="rb-stack">
            <button title="Contact Support"><MessageSquarePlus size={13} /> Contact Support</button>
            <button title="Show Training"><BookOpen size={13} /> Show Training</button>
          </div>
        </div>
      </RibbonGroup>
      <RibbonGroup title="Feedback">
        <div className="rb-stack" style={{ paddingTop: 4 }}>
          <button title="Feedback"><Smile size={13} /> Feedback</button>
          <button title="About BLACKGATE Writer" onClick={()=>{ document.dispatchEvent(new CustomEvent('show-about')) }}><ShieldQuestion size={13} /> About</button>
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
      {active === 'References' && <ReferencesRibbon />}
      {active === 'Review' && <ReviewRibbon />}
      {active === 'View' && <ViewRibbon />}
      {active === 'Help' && <HelpRibbon />}
    </div>
  )
}
