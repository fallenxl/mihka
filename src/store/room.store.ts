import { create } from "zustand";
import floorsData from "@/data/floors.json";

export interface Room {
  id: string;
  name: string;
  description: string;
  category: string;
  floor: string;
}

interface Floor {
  name: string;
  slug: string;
  path: string;
  description: string;
  rooms: Room[];
}

interface BuildingState {
  floors: Floor[];
  selectedFloor: Floor;
  selectedRoom: Room | null;
  openRoomInfo: boolean;
  getRoomsByQuery: (query: string) => Room[];
  setOpenRoomInfo: (open: boolean) => void;
  setSelectedFloorBySlug: (slug: string) => void;
  setSelectedRoomById: (roomId: string) => void;
  clearSelectedRoom: () => void;
  getRoomById: (roomId: string) => Room | null;
}

export const useBuildingStore = create<BuildingState>((set, get) => {
  const defaultFloor = floorsData[0];

  return {
    floors: floorsData,
    selectedFloor: defaultFloor,
    selectedRoom: null,
    openRoomInfo: false,

    setSelectedFloorBySlug: (slug) => {
      const floor = get().floors.find((f) => f.slug === slug);
      if (floor) {
        set({ selectedFloor: floor, selectedRoom: null });
      }
    },
    getRoomsByQuery: (query) => {
      const lowerQuery = query.toLowerCase();
      return floorsData
        .flatMap((floor) => floor.rooms)
        .filter((room) =>
          room.name.toLowerCase().includes(lowerQuery) ||
          room.description.toLowerCase().includes(lowerQuery) ||
          (room.category && room.category.toLowerCase().includes(lowerQuery))
        );
    },
    setSelectedRoomById: (roomId) => {

      const room = floorsData
        .flatMap((floor) => floor.rooms)
        .find((r) => r.id === roomId);
      if (room) {
        set({ selectedRoom: room, openRoomInfo: true });

      }
    },
    setOpenRoomInfo: (open) => {
      set({ openRoomInfo: open });
    },
    clearSelectedRoom: () => {
      set({ selectedRoom: null });
    },

    getRoomById: (roomId) => {
      for (const floor of get().floors) {
        const room = floor.rooms.find((r) => r.id === roomId);
        if (room) return room;
      }
      return null;
    },
  };
});
