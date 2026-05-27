"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#25332e",
          "--normal-border": "#d8dfdc",
          "--border-radius": "var(--radius)",
          "--success-bg": "#f2fbf7",
          "--success-text": "#063f34",
          "--success-border": "#b7d8cd",
          "--error-bg": "#fff7f7",
          "--error-text": "#7a1d1d",
          "--error-border": "#f0b8b8",
          "--info-bg": "#f8fbfa",
          "--info-text": "#25332e",
          "--info-border": "#d8dfdc",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
