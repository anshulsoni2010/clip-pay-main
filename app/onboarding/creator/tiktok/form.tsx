"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { connectYouTubeAccount } from "@/app/actions/auth"
import { InstagramAuthForm } from "../instagram/instaauth"

/*************  ✨ Codeium Command ⭐  *************/
/**
 * A form to connect a user's TikTok and YouTube accounts.
 *
 * @param youtubeAccessToken - The user's YouTube access token, if available.
 * @returns A JSX element containing a form to connect the user's TikTok and YouTube accounts.
 */
/******  fcfd735f-5545-4fbf-8abe-ae449c2d2d66  *******/ export function TikTokAuthForm({
  youtubeAccessToken,
}: {
  youtubeAccessToken?: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const handleTikTokAuth = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/tiktok/auth")
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.url) {
        throw new Error("No authentication URL returned")
      }

      window.location.href = data.url
    } catch (err) {
      console.error("Error initiating TikTok auth:", err)
      setError(
        err instanceof Error ? err.message : "Failed to connect with TikTok"
      )
      setIsLoading(false)
    }
  }
  // const handleYouTubeAuth = async () => {
  //   setIsLoading(true)
  //   setError(null)

  //   try {
  //     // Call your YouTube auth API endpoint
  //     const response = await fetch("/api/youtube/auth")
  //     const data = await response.json()

  //     if (data.error) {
  //       throw new Error(data.error)
  //     }

  //     if (!data.url) {
  //       throw new Error("No authentication URL returned")
  //     }

  //     // Redirect to YouTube OAuth flow
  //     window.location.href = data.url
  //   } catch (err) {
  //     console.error("Error initiating YouTube auth:", err)
  //     setError(
  //       err instanceof Error ? err.message : "Failed to connect with YouTube"
  //     )
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex justify-center items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={200} height={200} priority />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-black">
            Connect Your Accounts
          </h1>
          <p className="text-base text-[#475467]">
            Link your accounts to automatically track views and earnings
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-zinc-900">Why connect accounts?</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Automatically track views on your submitted videos</li>
              <li>Calculate earnings based on real-time view counts</li>
              <li>Receive notifications when you hit earning milestones</li>
            </ul>
          </div>

          {/* TikTok Connection */}
          <Button
            onClick={handleTikTokAuth}
            disabled={isLoading}
            className="w-full h-11 bg-white hover:bg-zinc-200 border border-zinc-400 text-black flex items-center justify-center gap-2"
          >
            <Image
              src="/tiktok.png"
              alt="TikTok"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            {isLoading ? "Connecting..." : "Connect TikTok Account"}
          </Button>

          {/* YouTube Connection */}
          {/* {isConnected ? (
        <Button disabled className="w-full h-11 bg-green-500 text-white">
          ✅ Connected with YouTube
        </Button>
      ) : (
        <Button
        onClick={() => router.push("/api/youtube/auth")}
          disabled={isLoading}
          className="w-full h-11 bg-white hover:bg-zinc-200 border border-zinc-400 text-black flex items-center justify-center gap-2"
        >
          <Image
            src="/youtube.png"
            alt="YouTube"
            width={20}
            height={20}
            className="flex-shrink-0"
          />
          {isLoading ? "Connecting..." : "Connect YouTube Account"}
        </Button>
      )} */}
          <InstagramAuthForm />
          <a
            href="/dashboard"
            className="w-full h-11 text-zinc-600 hover:bg-zinc-100"
          >
            Skip for Now
          </a>

          <p className="text-xs text-center text-zinc-500">
            By connecting your account, you agree to our{" "}
            <a
              href="/legal/terms"
              className="text-blue-600 hover:text-blue-800"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/legal/privacy"
              className="text-blue-600 hover:text-blue-800"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
