import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export type RibbonState = {
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  strike: boolean
  superscript: boolean
  subscript: boolean
  alignment: 'left' | 'center' | 'right' | 'justify'
  list: 'none' | 'bulleted' | 'numbered'
  style: 'Normal' | 'No Spacing' | 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Title'
  textColor: string
  highlightColor: string
  lineSpacing: number
  spacingBefore: number
  spacingAfter: number
  indentLeft: number
  indentRight: number
  listStyle: string
  pageColor: string
  pageMargins: { top:number; right:number; bottom:number; left:number }
  pageOrientation: 'portrait' | 'landscape'
  pageSize: 'letter' | 'a4' | 'legal'
  showLineNumbers: boolean
  showRuler: boolean
  showFormatMarks: boolean
  spellCheck: boolean
}

type Action = { type: string; payload?: any }

const initialState: RibbonState = {
  fontFamily: 'Inter',
  fontSize: 11,
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  superscript: false,
  subscript: false,
  alignment: 'left',
  list: 'none',
  style: 'Normal',
  textColor: '#000000',
  highlightColor: '#ffffff00',
  lineSpacing: 1.15,
  spacingBefore: 0,
  spacingAfter: 8,
  indentLeft: 0,
  indentRight: 0,
  listStyle: 'disc',
  pageColor: '#ffffff',
  pageMargins: { top: 32, right: 32, bottom: 32, left: 32 },
  pageOrientation: 'portrait',
  pageSize: 'letter',
  showLineNumbers: false,
  showRuler: true,
  showFormatMarks: false,
  spellCheck: true,
}

function reducer(state: RibbonState, action: Action): RibbonState {
  switch (action.type) {
    case 'toggle':
      return { ...state, [action.payload]: !state[action.payload as keyof RibbonState] }
    case 'set': {
      // Filter out undefined values so we don't clobber existing state
      const clean: Record<string,any> = {}
      for (const [k,v] of Object.entries(action.payload || {})) {
        if (v !== undefined) clean[k] = v
      }
      return { ...state, ...clean }
    }
    default:
      return state
  }
}

const RibbonContext = createContext<{ state: RibbonState; dispatch: React.Dispatch<Action> } | undefined>(undefined)

export function RibbonProvider({ children }: { children: ReactNode }){
  const [state, dispatch] = useReducer(reducer, initialState)
  return <RibbonContext.Provider value={{ state, dispatch }}>{children}</RibbonContext.Provider>
}

export function useRibbon(){
  const ctx = useContext(RibbonContext)
  if (!ctx) throw new Error('useRibbon must be used within RibbonProvider')
  return ctx
}
