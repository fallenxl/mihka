"use client";
import { getRoomById } from "@/services/room";
import { useBuildingStore } from "@/store/room.store";
import { use, useEffect, useRef, useState } from "react";

export function SVGRender({ svg: Map }: { svg: any }) {
  const svgRef = useRef<HTMLDivElement>(null);
  const [svgData, setSvgData] = useState<string>("");
  const { setSelectedRoomById, selectedRoom } = useBuildingStore();

  useEffect(() => {
    fetch(`/maps/${Map}.svg`)
      .then((response) => response.text())
      .then((data) => setSvgData(data))
      .catch((error) => {
        console.error("Error loading SVG:", error);
      });
  }, [Map]);

  const cleanUp = () => {
    svgRef.current?.querySelectorAll(".room").forEach((element) => {
      element.classList.remove("room-selected");
    });
  };

useEffect(() => {
  const svgContainer = svgRef.current;
  if (!svgContainer) return;

  const onClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target || !svgContainer.contains(target)) return;
    if (target.classList.contains("room")) {
      const roomId = target.getAttribute("id");
      if (roomId) {
        if (selectedRoom && selectedRoom.id === roomId) {
          setSelectedRoomById("");
          return;
        }
        const roomData = getRoomById(roomId);
        if (roomData) {
          setSelectedRoomById(roomId);
          cleanUp();
          target.classList.add("room-selected");
        }
      }
    }
  };

  // 💡 Espera a que el innerHTML se procese
  const timeout = setTimeout(() => {
    svgContainer.addEventListener("click", onClick);
  }, 100);

  return () => {
    clearTimeout(timeout);
    svgContainer.removeEventListener("click", onClick);
    cleanUp();
  };
}, [svgData]);


  useEffect(() => {
  if (selectedRoom && svgRef.current) {
    const timeout = setTimeout(() => {
      cleanUp();
      const roomElement = svgRef.current?.querySelector(`#${selectedRoom.id}`);
      if (roomElement) {
        roomElement.classList.add("room-selected");
      }
    }, 100); // da tiempo a que el DOM procese el innerHTML

    return () => clearTimeout(timeout);
  }
}, [selectedRoom, svgData]);

  return (
    <>
      <div
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svgData }}
        className="w-full h-full relative"
        style={{
          pointerEvents: "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />
    </>
  );
}
