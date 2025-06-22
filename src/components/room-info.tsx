"use client";

import { useBuildingStore } from "@/store/room.store";
import { useEffect, useState } from "react";
import data from "@/data/floors.json";

export function RoomInfo() {
  const { selectedRoom, setOpenRoomInfo, openRoomInfo } = useBuildingStore();
  const [userFloor, setUserFloor] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRoom) {
      setOpenRoomInfo(true);
    }
  }, [selectedRoom, setOpenRoomInfo]);

  const floorOrder = ["b1", "1", "2", "3", "4"];

  const getFloorName = (floorSlug: string) => {
    const floor = data.find((f) => f.slug === `floor${floorSlug}`);
    return floor?.name || `Floor ${floorSlug.toUpperCase()}`;
  };

  const getFloorRoute = (from: string, to: string) => {
    const fromIndex = floorOrder.indexOf(from.toLowerCase());
    const toIndex = floorOrder.indexOf(to.toLowerCase());
    if (fromIndex === -1 || toIndex === -1) return [];

    const route = [];

    if (fromIndex < toIndex) {
      for (let i = fromIndex; i <= toIndex; i++) {
        route.push({ floor: floorOrder[i], action: "up" });
      }
    } else {
      for (let i = fromIndex; i >= toIndex; i--) {
        route.push({ floor: floorOrder[i], action: "down" });
      }
    }

    return route;
  };

  return (
    <>
      {selectedRoom && openRoomInfo && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full md:max-w-screen-lg bg-white p-4 shadow-lg z-50 border border-gray-200 mx-2 md:mx-0">
          <div className="flex flex-col items-center justify-between mb-2 relative py-10">
            <button
              className="absolute top-1 md:top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setOpenRoomInfo(false);
                setUserFloor(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-lg font-semibold mb-2">{selectedRoom.name}</h2>
            <p className="text-sm text-gray-600 mb-2 text-center">
              {selectedRoom.description}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Category: <span className="capitalize font-medium">{selectedRoom.category || "General"}</span>
            </p>

            {!userFloor ? (
              <>
                <p className="text-sm mb-2 text-gray-700">Where are you currently?</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.map((f) => (
                    <button
                      key={f.slug}
                      onClick={() => setUserFloor(f.slug.replace("floor", ""))}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-sm"
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-4 text-center">
                  Route from <strong>{getFloorName(userFloor)}</strong> to{" "}
                  <strong>{getFloorName(selectedRoom.floor)} - {selectedRoom.name}</strong>
                </p>

                <div className="w-full flex flex-col gap-2 items-center text-sm text-gray-600">
                  {getFloorRoute(userFloor, selectedRoom.floor).map((step, index, arr) => (
                    <div key={step.floor} className="flex items-center gap-2">
                      {index === 0 ? (
                        <span>Start at {getFloorName(step.floor)}</span>
                      ) : (
                        <>
                          <span className="text-xl">
                            {step.action === "up" ? "↑" : "↓"}
                          </span>
                          <span>
                            Go {step.action === "up" ? "up" : "down"} to {getFloorName(step.floor)}
                          </span>
                        </>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-2 text-green-600 font-medium mt-2">
                    <span>→</span>
                    <span>Arrive at {selectedRoom.name}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
