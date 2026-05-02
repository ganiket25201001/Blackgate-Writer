import create from 'zustand'

type Store = {
  zoom: number
  setZoom: (z:number)=>void
  leftOpen: boolean
  toggleLeft: ()=>void
  leftTab: 'pages'|'outline'
  setLeftTab: (t:'pages'|'outline')=>void
  rightOpen: boolean
  toggleRight: ()=>void
  showFormatMarks: boolean
  toggleFormatMarks: ()=>void
}

export const useStore = create<Store>((set)=>({
  zoom: 1,
  setZoom: (z)=>set({ zoom: z }),
  leftOpen: true,
  toggleLeft: ()=>set(s=>({ leftOpen: !s.leftOpen })),
  leftTab: 'pages',
  setLeftTab: (t)=>set({ leftTab: t }),
  rightOpen: true,
  toggleRight: ()=>set(s=>({ rightOpen: !s.rightOpen })),
  showFormatMarks: false,
  toggleFormatMarks: ()=>set(s=>({ showFormatMarks: !s.showFormatMarks })),
}))
