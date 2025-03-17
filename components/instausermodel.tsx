import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase-server"

interface InstagramModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (username: string) => void
}

export function InstagramModal({ isOpen, onClose, onSubmit }: InstagramModalProps) {
  const [instagramUsername, setInstagramUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  
 
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchInstagramUsername = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/instagram");
        const data = await response.json();
        if (data.instagramUsername) {
          setInstagramUsername(data.instagramUsername);
        }
      } catch (err) {
        setError("Failed to fetch username.");
      }
      setIsLoading(false);
    };
  
    fetchInstagramUsername();
  }, []);
  

  const handleSubmit = () => {
    setError(null)
    setSuccess(null)

    if (!instagramUsername) {
      setError("Please enter a username.")
      return
    }

    onSubmit(instagramUsername)
    setInstagramUsername("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-lg font-semibold text-center">Enter Instagram Username</h2>
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
          <Button onClick={onClose} className="bg-gray-300 text-black">
            Cancel
          </Button>
          <Button onClick={() => onSubmit(instagramUsername)} className="bg-blue-600 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
