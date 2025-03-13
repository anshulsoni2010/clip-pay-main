import { NextRequest, NextResponse } from "next/server"
import { createServerActionClient } from "@/app/auth/actions"

export async function GET(request: NextRequest) {
  const supabase = await createServerActionClient()
  const user = await supabase.auth.getUser()

  if (!user.data?.user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=Not authenticated`
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000"
  const redirectUrl = `${baseUrl}/api/youtube/callback`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error) {
    console.error("Google sign-in error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/settings?error=${encodeURIComponent(error.message)}`
    )
  }

  return NextResponse.redirect(data.url)
}
