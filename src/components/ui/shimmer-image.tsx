"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function ShimmerImage({
  alt,
  className,
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-0 block animate-pulse bg-gradient-to-r from-[#edf2ef] via-white to-[#edf2ef] bg-[length:220%_100%] transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100"
        )}
      />
      <Image
        {...props}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
        }}
      />
    </>
  )
}
