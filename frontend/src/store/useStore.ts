import create from 'zustand'

type Store = {
  zoom: number
  setZoom: (z:number)=>void
  leftOpen: boolean
  toggleLeft: ()=>void
  leftTab: 'pages'|'outline'
  setLeftTab: (t:'pages'|'outline')=>void
}

export const useStore = create<Store>((set)=>({
  zoom: 1,
  setZoom: (z)=>set({ zoom: z }),
  leftOpen: true,
  toggleLeft: ()=>set(s=>({ leftOpen: !s.leftOpen })),
  leftTab: 'pages',
  setLeftTab: (t)=>set({ leftTab: t })
}))
