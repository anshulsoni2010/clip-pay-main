import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { InstagramModal } from "@/components/instausermodel"

export function InstagramAuthForm() {
  const [isInstagramModalOpen, setInstagramModalOpen] = useState(false)
  const [instagramUsername, setInstagramUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleInstagramSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!instagramUsername) {
      setError("Please enter a username.")
      return
    }

    try {
      const response = await fetch("/api/instagram", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagramUsername }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to update")

      setSuccess("Instagram username updated successfully!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
      setInstagramModalOpen(false)
      setInstagramUsername("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  return (
    <div>
      <Button
        onClick={() => setInstagramModalOpen(true)}
        className="w-full h-11 bg-white hover:bg-zinc-200 border border-zinc-400 text-black flex items-center justify-center gap-2"
      >
        Connect Instagram Account
      </Button>

      {isInstagramModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold text-center">
              Enter Instagram Username
            </h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <input
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Instagram Username"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setInstagramModalOpen(false)}
                className="bg-gray-300 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInstagramSubmit}
                className="bg-blue-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      <InstagramModal
        isOpen={isInstagramModalOpen}
        onClose={() => setInstagramModalOpen(false)}
        onSubmit={handleInstagramSubmit}
      />
    </div>
  )
}
