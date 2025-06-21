"use client"
import { useEffect, useRef, useState } from "react"

export function SVGRender({ svg: Map }: { svg: any }) {
  const svgRef = useRef<HTMLDivElement>(null)
  const [svgData, setSvgData] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetch(`/maps/${Map}.svg`)
      .then((response) => response.text())
      .then((data) => setSvgData(data))
      .catch((error) => {
        console.error("Error loading SVG:", error)
      })
  }, [Map, mounted])

  useEffect(() => {
    if (!svgData || !svgRef.current) return

    const svgElement = svgRef.current.querySelector("svg")
    if (svgElement) {
      svgElement.style.pointerEvents = "none"
      svgElement.style.userSelect = "none"
      ;(svgElement.style as any).webkitUserSelect = "none"
      ;(svgElement.style as any).webkitTouchCallout = "none"
      ;(svgElement.style as any).webkitUserDrag = "none"

      const interactiveElements = svgElement.querySelectorAll("[data-room], .room, .interactive")
      interactiveElements.forEach((element) => {
        ;(element as HTMLElement).style.pointerEvents = "auto"
        ;(element as HTMLElement).style.cursor = "pointer"
      })
      console.log(interactiveElements)
    }
  }, [svgData])

  // ✅ Importante: solo renderizar después de montar
  if (!mounted) return null

  return (
    <div
      className="flex items-center justify-center w-full h-full bg-transparent"
      style={{
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <div
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svgData }}
        className="max-w-full max-h-full"
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />
    </div>
  )
}
