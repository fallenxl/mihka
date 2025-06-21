"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { Search, MapPin, Layers, ZoomIn, ZoomOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
// import Image from "next/image"
import { SVGRender } from "@/components/SVGRender"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

export default function BuildingMapApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId)
  }



  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Fixed Search Toggle Button */}
     {!showSearch &&  <Button className="absolute top-4 left-4 z-20  md:hidden" size="icon" onClick={() => setShowSearch(!showSearch)}>
        <Search className="w-4 h-4" />
      </Button>}

      <Card
        className={`absolute  md:max-w-screen-lg mx-auto top-4 z-10 p-4 transition-all duration-300 ${
          showSearch ? "block left-4 right-4 md:right-4" : "hidden md:block left-16 right-4 md:left-4 md:right-4"
        } `}
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar aulas, laboratorios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setShowSearch(false)}>
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
              <Button onClick={() => zoomIn()}><ZoomIn className="w-5 h-5" /></Button>
              <Button onClick={() => zoomOut()}><ZoomOut className="w-5 h-5" /></Button>
            </div>

            {/* Contenedor del SVG */}
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-fit h-fit mx-auto"
            >
              <div className="relative w-screen h-screen">
                <SVGRender svg="floor3" />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}
