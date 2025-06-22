"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Search, MapPin, Layers, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SVGRender } from "@/components/SVGRender";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import data from "@/data/floors.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoomInfo } from "@/components/room-info";
export default function BuildingMapApp() {

  const [floorSelected, setFloorSelected] = useState<string>("floor4");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchRoom = useCallback((query: string) => {
    if (!query) {
      setFloorSelected("floor4");
      return;
    }
    const room = data.find((floor) =>
      floor.rooms.some((room) =>
        room.name.toLowerCase().includes(query.toLowerCase())
      )
    );
    if (room) {
      setFloorSelected(room.slug);
      const foundRoom = room.rooms.find((r) =>
        r.name.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      setFloorSelected("floor4");
    }
  }, []);

  useEffect(() => {
    handleSearchRoom(searchQuery);
  }, [searchQuery, handleSearchRoom]);


  return (
    <div className="fixed inset-0 overflow-hidden">
      <RoomInfo />
      {/* Fixed Search Toggle Button */}
      {!showSearch && (
        <Button
          className="absolute top-4 left-4 z-20  md:hidden"
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
      <Select defaultValue={floorSelected} onValueChange={(value) => setFloorSelected(value)} >
        <SelectTrigger
        
        className="w-[150px] z-10 fixed bottom-4 md:top-1/2 left-4 bg-white">
          <SelectValue placeholder="Floor" />
        </SelectTrigger>
        <SelectContent >
          {data.map((floor) => (
            <SelectItem
              key={floor.slug}
              value={floor.slug}
              onClick={() => {
                setFloorSelected(floor.slug);
              }}
            >
              {floor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      <Card
        className={`absolute  md:max-w-screen-lg mx-auto top-4 z-10 p-4 transition-all duration-300 ${
          showSearch
            ? "block left-4 right-4 md:right-4"
            : "hidden md:block left-16 right-4 md:left-4 md:right-4"
        } `}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
      </Card>

      {/* Contenedor de mapa interactivo */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        pinch={{ step: 5 }}
        centerOnInit={false}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Botones de zoom */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <Button onClick={() => zoomIn()}>
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button onClick={() => zoomOut()}>
                <ZoomOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Contenedor del SVG */}
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-fit h-fit mx-auto"
            >
              <div className=" w-screen h-screen flex items-center justify-center relative">
                <SVGRender svg={floorSelected} />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
