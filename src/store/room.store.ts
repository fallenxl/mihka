import { create } from "zustand"
import floorsData from "@/data/floors.json"

interface Room {
  id: string
  name: string
  description: string
  category: string
}

interface Floor {
  name: string
  slug: string
  path: string
  description: string
  rooms: Room[]
}

interface BuildingState {
  floors: Floor[]
  selectedFloor: Floor
  selectedRoom: Room | null

  setSelectedFloorBySlug: (slug: string) => void
  setSelectedRoomById: (roomId: string) => void
  clearSelectedRoom: () => void
  getRoomById: (roomId: string) => Room | null
}

export const useBuildingStore = create<BuildingState>((set, get) => {
  const defaultFloor = floorsData[0]

  return {
    floors: floorsData,
    selectedFloor: defaultFloor,
    selectedRoom: null,

    setSelectedFloorBySlug: (slug) => {
      const floor = get().floors.find((f) => f.slug === slug)
      if (floor) {
        set({ selectedFloor: floor, selectedRoom: null })
      }
    },

    setSelectedRoomById: (roomId) => {
      const floor = get().selectedFloor
      const room = floor.rooms.find((r) => r.id === roomId)
      if (room) {
        set({ selectedRoom: room })
      }
    },

    clearSelectedRoom: () => {
      set({ selectedRoom: null })
    },

    getRoomById: (roomId) => {
      for (const floor of get().floors) {
        const room = floor.rooms.find((r) => r.id === roomId)
        if (room) return room
      }
      return null
    },
  }
})
