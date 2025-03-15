"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface TeamMember {
  id: string
  email: string
}

export function TeamManagement({ brandId }: { brandId: string }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const res = await fetch(`/api/brands?brandId=${brandId}`)
        const data = await res.json()

        console.log("API Response:", data) // Debugging

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setTeamMembers(data)
        } else {
          console.error("Expected array, received:", data)
          setTeamMembers([]) // Set empty array to prevent .map() errors
        }
      } catch (error) {
        console.error("Error fetching team members:", error)
        setTeamMembers([]) // Fallback to empty array
      }
    }

    if (brandId) fetchTeamMembers()
  }, [brandId])

  async function addMember() {
    const res = await fetch("/api/brands", {
      method: "POST",
      body: JSON.stringify({ email, brandId }),
    })

    if (res.ok) {
      toast.success("Team member added!")
      setEmail("")
      setTeamMembers([...teamMembers, { id: crypto.randomUUID(), email }])
    } else {
      toast.error("Failed to add team member")
    }
  }

  async function removeMember(userId: string) {
    const res = await fetch("/api/brands", {
      method: "DELETE",
      body: JSON.stringify({ userId, brandId }),
    })

    if (res.ok) {
      toast.success("Team member removed")
      setTeamMembers(teamMembers.filter((m) => m.id !== userId))
    } else {
      toast.error("Failed to remove team member")
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow text-black">
      <h2 className="text-lg font-semibold">Team Members</h2>

      <div className="flex gap-2 mt-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <Button onClick={addMember}>Add</Button>
      </div>

      <ul className="mt-4">
        {teamMembers.map((member) => (
          <li key={member.id} className="flex justify-between border-b py-2">
            <span>{member.email}</span>
            <Button
              variant="destructive"
              onClick={() => removeMember(member.id)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
