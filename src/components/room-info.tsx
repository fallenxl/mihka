"use client";

import { useBuildingStore } from "@/store/room.store";
import { useEffect, useState } from "react";

export function RoomInfo() {
  const [showInfo, setShowInfo] = useState(false);
  const { selectedRoom } = useBuildingStore();

  return (
    <>
      {selectedRoom && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:max-w-screen-lg bg-white p-4 shadow-lg z-50 border border-gray-200 mx-2 md:mx-0">
          <h2 className="text-lg font-semibold mb-2">{selectedRoom.name}</h2>
          <p className="text-sm text-gray-600 mb-2">
            {selectedRoom.description}
          </p>
          <p className="text-sm text-gray-500">
            Category:{" "}
            <span className="capitalize font-medium">
              {selectedRoom.category || "General"}
            </span>
          </p>
        </div>
      )}
    </>
  );
}
