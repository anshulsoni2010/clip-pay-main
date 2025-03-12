import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { TikTokAuthForm } from "./tiktok/form"

export default async function CreatorOnboarding() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/signin")
  }

  // Set user type as creator if not already set
  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("user_id", user.id)
    .single()

  if (!profile?.user_type) {
    await supabase
      .from("profiles")
      .update({ user_type: "creator" })
      .eq("user_id", user.id)
  }

  // Fetch YouTube access token from creators table
  const { data: creator } = await supabase
    .from("creators")
    .select("youtube_access_token")
    .eq("user_id", user.id)
    .single()

  return <TikTokAuthForm youtubeAccessToken={creator?.youtube_access_token} />
}
