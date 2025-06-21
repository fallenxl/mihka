"use client";
import Image from "next/image";
import data from "@/data/mappings.json";
import { useEffect, useRef, useState } from "react";
export function SVGRender({ svg:Map }: { svg: any }) {
    const svgRef = useRef<HTMLImageElement>(null);
    const [svgData, setSvgData] = useState<string>('');
    useEffect(() => {
      fetch(`/maps/${Map}.svg`).then((response) => {
        return response.text();
      }).then((data) => {
        console.log('SVG data fetched:', data);
        setSvgData(data);
      })
    }, []);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div dangerouslySetInnerHTML={{ __html: svgData }} className="max-w-full max-h-full" />
    </div>
   
  );
}