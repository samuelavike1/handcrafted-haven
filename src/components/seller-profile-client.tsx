"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

type SellerProfileClientProps = {
  name: string
  email: string
  studioName?: string
  location?: string
  story?: string
}

export default function SellerProfileClient(props: SellerProfileClientProps) {
    const t = useTranslations("sellerProfile")
    const [name, setName] = useState(props.name)
    const [studioName, setStudioName] = useState(props.studioName ?? "")
    const [location, setLocation] = useState(props.location ?? "")
    const [story, setStory] = useState(props.story ?? "")
    const [isSaving, setIsSaving] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsSaving(true)
        try {
            const response = await fetch("/api/sellers/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, studioName, location, story }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error ?? t("errorMsg"))
            toast.success(t("successTitle"), { description: t("successDesc") })
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t("errorMsg"))
        } finally {
            setIsSaving(false)
        }
    }

    async function handlePasswordSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsChangingPassword(true)
        try {
            const response = await fetch("/api/sellers/password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error ?? "Could not change password.")
            setCurrentPassword("")
            setNewPassword("")
            toast.success("Password changed", { description: "Your password has been updated." })
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not change password.")
        } finally {
            setIsChangingPassword(false)
        }
    }

    return (
         <>
  <div className="rounded-lg border border-[#d8dfdc] bg-white p-6">
    <h2 className="text-xl font-black text-[#063f34]">{t("title")}</h2>
    <p className="mt-1 text-sm text-[#6d7a75]">{t("subtitle")}</p>

    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("name")}</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("studioName")}</span>
        <input
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("location")}</span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 h-9 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
        />
      </label>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("story")}</span>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 py-2 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
        />
      </label>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white disabled:opacity-70"
      >
        {isSaving && <Loader2 className="animate-spin" size={14} />}
        {t("saveChanges")}
      </button>
    </form>
  </div>
<div className="mt-6 rounded-lg border border-[#d8dfdc] bg-white p-6">
        <h2 className="text-xl font-black text-[#063f34]">{t("changePasswordTitle")}</h2>
        <p className="mt-1 text-sm text-[#6d7a75]">{t("changePasswordSubtitle")}</p>

        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("currentPassword")}</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-[#53615c]">{t("newPassword")}</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-[#d8dfdc] bg-white px-3 text-sm outline-none focus:border-[#063f34] focus:ring-4 focus:ring-[#063f34]/8"
            />
          </label>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="inline-flex items-center gap-2 rounded-lg bg-[#063f34] px-4 py-2 text-sm font-bold text-white disabled:opacity-70"
          >
            {isChangingPassword && <Loader2 className="animate-spin" size={14} />}
            {t("changePasswordBtn")}
          </button>
        </form>
      </div>  
      </>
)
}