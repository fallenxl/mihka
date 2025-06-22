"use client";

import { useBuildingStore } from "@/store/room.store";
import { useEffect, useState } from "react";

export function RoomInfo() {

  const { selectedRoom, setOpenRoomInfo, openRoomInfo } = useBuildingStore();

  useEffect(() => {
    if (selectedRoom) {
        alert(`Selected Room: ${selectedRoom.name}`);
        setOpenRoomInfo(true);
        }
    }, [selectedRoom, setOpenRoomInfo]);
  return (
    <>
      {(selectedRoom && openRoomInfo) && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:max-w-screen-lg bg-white p-4 shadow-lg z-50 border border-gray-200 mx-2 md:mx-0">
          <div className="flex flex-col items-center justify-between mb-2 relative  py-10">
              <button
                className="absolute top-1 md:top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setOpenRoomInfo(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-lg font-semibold mb-2">
                {selectedRoom.name}
              </h2>
            
            <p className="text-sm text-gray-600 mb-2 text-center">
              {selectedRoom.description}
            </p>
            <p className="text-sm text-gray-500">
              Category:{" "}
              <span className="capitalize font-medium">
                {selectedRoom.category || "General"}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
