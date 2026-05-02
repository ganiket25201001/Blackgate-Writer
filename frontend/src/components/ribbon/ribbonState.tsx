import React, { createContext, useContext, useReducer, ReactNode } from 'react'

type State = {
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
  style: 'Normal' | 'Heading 1' | 'Heading 2' | 'Title'
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
  showLineNumbers: boolean
}

type Action = { type: string; payload?: any }

const initialState: State = {
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
  textColor: '#E6EEF8',
  highlightColor: '#ffffff00'
  ,lineSpacing: 1.15
  ,spacingBefore: 0
  ,spacingAfter: 0
  ,indentLeft: 0
  ,indentRight: 0
  ,listStyle: 'disc'
  ,pageColor: '#ffffff'
  ,pageMargins: { top: 32, right: 32, bottom: 32, left: 32 }
  ,showLineNumbers: false
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toggle':
      return { ...state, [action.payload]: !state[action.payload as keyof State] }
    case 'set':
      return { ...state, ...(action.payload as Partial<State>) }
    default:
      return state
  }
}

const RibbonContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined)

export function RibbonProvider({ children }: { children: ReactNode }){
  const [state, dispatch] = useReducer(reducer, initialState)
  return <RibbonContext.Provider value={{ state, dispatch }}>{children}</RibbonContext.Provider>
}

export function useRibbon(){
  const ctx = useContext(RibbonContext)
  if (!ctx) throw new Error('useRibbon must be used within RibbonProvider')
  return ctx
}
