"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Search, MapPin, Layers, ZoomIn, ZoomOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { SVGRender } from "@/components/SVGRender"
export default function BuildingMapApp() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [dragDistance, setDragDistance] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  

  // Prevenir scroll y drag nativo en móvil
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault()
    }

    const preventDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    const preventContextMenu = (e: Event) => {
      e.preventDefault()
    }

    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.height = "100%"
    document.body.style.userSelect = "none";
    (document.body.style as any).webkitUserSelect = "none";
    (document.body.style as any).webkitTouchCallout = "none"

    document.addEventListener("touchmove", preventDefault, { passive: false })
    document.addEventListener("dragstart", preventDragStart)
    document.addEventListener("contextmenu", preventContextMenu)

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      (document.body.style as any).webkitTouchCallout = ""
      document.removeEventListener("touchmove", preventDefault)
      document.removeEventListener("dragstart", preventDragStart)
      document.removeEventListener("contextmenu", preventContextMenu)
    }
  }, [])

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragDistance(0)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      const distance = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2))

      setDragDistance(distance)
      setPosition({ x: newX, y: newY })
    },
    [isDragging, dragStart, position],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setTimeout(() => setDragDistance(0), 100)
  }, [])

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // e.preventDefault()
      const touch = e.touches[0]
      setIsDragging(true)
      setDragDistance(0)
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
    },
    [position],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const touch = e.touches[0]
      const newX = touch.clientX - dragStart.x
      const newY = touch.clientY - dragStart.y
      const distance = Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2))

      setDragDistance(distance)
      setPosition({ x: newX, y: newY })
    },
    [isDragging, dragStart, position],
  )

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setTimeout(() => setDragDistance(0), 100)
  }, [])

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.5))
  }

  const handleRoomClick = (e: React.MouseEvent | React.TouchEvent, roomId: string) => {
    e.stopPropagation()
    // Solo seleccionar si no se ha arrastrado mucho
    if (dragDistance < 10) {
      setSelectedRoom(roomId)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-100 overflow-hidden">
      {/* Fixed Search Toggle Button */}
     {!showSearch &&  <Button className="absolute top-4 left-4 z-20  md:hidden" size="icon" onClick={() => setShowSearch(!showSearch)}>
        <Search className="w-4 h-4" />
      </Button>}

      <Card
        className={`absolute  md:max-w-screen-lg mx-auto top-4 z-10 p-4 transition-all duration-300 ${
          showSearch ? "left-4 right-4 md:right-4" : "left-16 right-4 md:left-4 md:right-4"
        } ${showSearch ? "block" : "hidden md:block"}`}
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

      {/* Fixed Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white shadow-lg w-12 h-12 md:w-10 md:h-10"
        >
          <ZoomIn className="w-5 h-5 md:w-4 md:h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white shadow-lg w-12 h-12 md:w-10 md:h-10"
        >
          <ZoomOut className="w-5 h-5 md:w-4 md:h-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <div
          className="origin-center transition-transform duration-10 relative"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: "600px",
            height: "500px",
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: "-300px",
            marginTop: "-250px",
          }}
        >
          {/* <Floor3 width={100} height={100} /> */}
            <SVGRender svg={'floor3'} />
        </div>
      </div>
    </div>
  )
}
