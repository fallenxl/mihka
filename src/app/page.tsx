// BuildingMapApp.tsx
"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Search, ZoomIn, ZoomOut, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SVGRender } from "@/components/SVGRender";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomInfo } from "@/components/room-info";
import { Room, useBuildingStore } from "@/store/room.store";

export default function BuildingMapApp() {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const {
    floors,
    selectedFloor,
    setSelectedFloorBySlug,
    getRoomsByQuery,
    setSelectedRoomById,
  } = useBuildingStore();

  const [floorSelected, setFloorSelected] = useState<string>(
    selectedFloor.slug
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  useEffect(() => {
    const results = getRoomsByQuery(searchQuery);
    setFilteredRooms(results);
  }, [searchQuery, getRoomsByQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );
  return (
    <div className="fixed inset-0 overflow-hidden">
      <RoomInfo />

      {!showSearch && (
        <Button
          className="absolute top-4 left-4 z-20 md:hidden"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-4 h-4" />
        </Button>
      )}

      <Button
        className="absolute top-4 right-4 z-20 hidden md:flex"
        size="icon"
        onClick={() => setShowSearch(!showSearch)}
      >
        <Search className="w-4 h-4" />
      </Button>

      <Select
        value={floorSelected}
        onValueChange={(value) => setFloorSelected(value)}
      >
        <SelectTrigger className="w-[150px] z-10 fixed bottom-4 md:top-1/2 left-4 bg-white">
          <SelectValue placeholder="Floor" />
        </SelectTrigger>
        <SelectContent>
          {floors.map((floor) => (
            <SelectItem
              key={floor.slug}
              value={floor.slug}
              onClick={() => setSelectedFloorBySlug(floor.slug)}
            >
              {floor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card
        className={`absolute md:max-w-screen-lg mx-auto top-4 z-10 p-4 transition-all duration-300 ${
          showSearch
            ? "block left-4 right-4 md:right-4"
            : "hidden md:block left-16 right-4 md:left-4 md:right-4"
        }`}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearch(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Results */}
        {searchQuery && filteredRooms.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto px-4 z-10 relative">
            {filteredRooms.map((room) => {
              const roomFloor = floors.find((f) =>
                f.rooms.some((r) => r.id === room.id)
              );

              return (
                <Card
                  key={room.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => {
                    if (roomFloor) {
                      setSelectedFloorBySlug(roomFloor.slug);
                      setFloorSelected(roomFloor.slug);

                      // Espera un poco a que se renderice el nuevo SVG
                      setTimeout(() => {
                        const svgElement = document.getElementById(room.id)
                        if (svgElement instanceof SVGGraphicsElement && transformRef.current) {
                          const bbox = svgElement.getBBox();

                          // Centrar en el punto medio del bounding box
                          const centerX = bbox.x + bbox.width / 2;
                          const centerY = bbox.y + bbox.height / 1;

                          transformRef.current.setTransform(
                            -centerX + window.innerWidth / 2,
                            -centerY + window.innerHeight / 2,
                            1.5
                          );
                        }
                      }, 300);
                    }

                    setSelectedRoomById(room.id);
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="font-semibold">{room.name}</div>
                  <div className="text-sm text-gray-600">
                    {room.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 capitalize">
                    {room.category}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        pinch={{ step: 5 }}
        centerOnInit={false}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <Button onClick={() => zoomIn()}>
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button onClick={() => zoomOut()}>
                <ZoomOut className="w-5 h-5" />
              </Button>
            </div>

            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-fit h-fit mx-auto"
            >
              <div className="w-screen h-screen flex items-center justify-center relative">
                <SVGRender svg={floorSelected} />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
