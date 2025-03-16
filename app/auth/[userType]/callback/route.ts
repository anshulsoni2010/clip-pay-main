import { NextRequest, NextResponse } from "next/server"
import { createServerActionClient } from "@/app/auth/actions"
import { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

// Get the project ref from the Supabase URL
function getProjectRef() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  const matches = url.match(/https:\/\/([^.]+)\.supabase\.co/)
  if (!matches) throw new Error("Invalid Supabase URL format")
  return matches[1]
}

export const dynamic = "force-dynamic"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userType: string }> }
) {
  const requestUrl = new URL(request.url)

  // Get and validate user type
  const { userType } = await params

  if (!userType || !["creator", "brand"].includes(userType)) {
    console.error("Invalid user type:", userType)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=${encodeURIComponent("Invalid user type")}`
    )
  }

  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=No code provided`
    )
  }

  const supabase = await createServerActionClient()

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Session exchange error:", error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=${encodeURIComponent(error.message)}`
      )
    }

    const userId = data.session.user.id
    const userEmail = data.session.user.email
    const accessToken = data.session.provider_token
    const refreshToken = data.session.provider_refresh_token

    let referredByUUID = null

    if (!userEmail) {
      console.log("⚠️ User is not authenticated or email is missing!");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=${encodeURIComponent("Authentication required")}`
      );
    }
    console.log("USer E mail", userEmail);
    // Retrieve referral code from `pending_referrals`
    if (userType === "creator") {
      const { data: referralRecord, error: referralFetchError } = await supabase
      .from("pending_referrals")
      .select("referral_code")
      .eq("email", userEmail.trim().toLowerCase())
      .single();
    

        console.log("referralRecord", referralRecord)
      if (!referralFetchError && referralRecord?.referral_code) {
        // Fetch referrer's UUID from `referrals` table
        const { data: referrer, error: referrerFetchError } = await supabase
          .from("referrals")
          .select("profile_id")
          .eq("code", referralRecord.referral_code)
          .single()

          console.log("referrer", referrer)
        if (!referrerFetchError) {
          referredByUUID = referrer.profile_id;
        }
      }
    }

    // Store YouTube tokens if user is a creator
    if (userType === "creator" && accessToken && refreshToken) {
      await supabase
        .from("creators")
        .update({
          youtube_access_token: accessToken,
          youtube_refresh_token: refreshToken,
          youtube_connected: true,
        })
        .eq("user_id", userId)
    }

    // Fetch or create the user profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("user_type, onboarding_completed")
      .eq("user_id", userId)
      .single()

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        user_id: userId,
        user_type: userType,
        onboarding_completed: false,
        referred_by: referredByUUID, // Store referrer UUID if applicable
      })
    }

    // Delete referral record after use
    await supabase.from("pending_referrals").delete().eq("email", userEmail)

    // Determine redirect URL
    const profile = existingProfile || {
      user_type: userType,
      onboarding_completed: false,
    }
    const onboardingPath =
      profile.user_type === "brand" ? "brand/profile" : "creator"
    const redirectUrl = !profile.onboarding_completed
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/${onboardingPath}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}${next}`

    const response = NextResponse.redirect(redirectUrl)
    return response
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/signin?error=${encodeURIComponent("Authentication failed")}`
    )
  }
}
