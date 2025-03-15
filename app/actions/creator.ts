"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/supabase"
import { TikTokAPI } from "@/lib/tiktok"
import { YouTubeAPI } from "@/lib/youtube"
import { getInstagramReelViews } from "@/lib/instagram"

interface ReferralData {
  profile_id: string
}

export async function updateCreatorProfile(
  organizationName: string,
  referralCode: string | null
) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // If referral code provided, verify it
    let referrerId = null
    if (referralCode) {
      // First get the referrer's profile ID from the referrals table
      const { data: referralData, error: referralError } = await supabase
        .from("referrals")
        .select("profile_id")
        .eq("code", referralCode)
        .maybeSingle()

      if (referralError || !referralData) {
        console.error("Error checking referral code:", referralError)
        return { success: false, error: "Invalid referral code" }
      }

      // Get the referrer's profile to ensure they are a creator
      const { data: referrerProfile, error: referrerError } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", referralData.profile_id)
        .single()

      if (
        referrerError ||
        !referrerProfile ||
        referrerProfile.user_type !== "creator"
      ) {
        return { success: false, error: "Invalid referral code" }
      }

      // Store the referrer's profile_id from the referrals table
      referrerId = referralData.profile_id

      // Create notification for referrer
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: referrerId,
          type: "new_referral",
          title: "New Creator Referral",
          message: `${organizationName} has joined using your referral code!`,
          metadata: {
            referred_creator_id: user.id,
            referred_creator_name: organizationName,
          },
        } satisfies Database["public"]["Tables"]["notifications"]["Insert"])

      if (notificationError) {
        console.error(
          "Error creating referral notification:",
          notificationError
        )
        // Don't throw here, as we still want to complete the profile update
      }
    }

    // Update profile with organization name and referral info
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        organization_name: organizationName,
        referred_by: referrerId, // This should be the profile_id from the referrals table
        onboarding_completed: true,
        user_type: "creator",
      } satisfies Database["public"]["Tables"]["profiles"]["Update"])
      .eq("user_id", user.id)

    if (updateError) throw updateError

    // Create welcome notification for the new creator
    const { error: welcomeNotificationError } = await supabase
      .from("notifications")
      .insert({
        recipient_id: user.id,
        type: "welcome",
        title: "Welcome to Creator Pay!",
        message:
          "Your creator profile has been set up successfully. Start exploring campaigns and submitting videos!",
        metadata: {
          organization_name: organizationName,
        },
      } satisfies Database["public"]["Tables"]["notifications"]["Insert"])

    if (welcomeNotificationError) {
      console.error(
        "Error creating welcome notification:",
        welcomeNotificationError
      )
      // Don't throw here, as the profile update was successful
    }

    revalidatePath("/onboarding/creator")
    return { success: true }
  } catch (error) {
    console.error("Error updating creator profile:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

export async function updateSubmissionVideoUrl(
  submissionId: string,
  videoUrls: string[]
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    let validUrls: string[] = [];
    let platforms: string[] = [];
    let totalViews = 0;

    for (const videoUrl of videoUrls) {
      if (!videoUrl.trim()) continue;

      const isTikTok = videoUrl.includes("tiktok.com");
      const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
      const isInstagram = videoUrl.includes("instagram.com/reel/");

      if (!isTikTok && !isYouTube && !isInstagram) {
        return { success: false, error: "Invalid video URL. Use TikTok, YouTube, or Instagram." };
      }

      let videoInfo = null;

      if (isTikTok) {
        platforms.push("TikTok");
        const { data: creator } = await supabase
          .from("creators")
          .select("tiktok_access_token")
          .eq("user_id", user.id)
          .single();

        if (!creator?.tiktok_access_token) {
          return { success: false, error: "TikTok not connected" };
        }

        const tiktokApi = new TikTokAPI();
        videoInfo = await tiktokApi.getVideoInfo(videoUrl, creator.tiktok_access_token, user.id);
      } 
      
      else if (isYouTube) {
        platforms.push("YouTube");
        videoInfo = await YouTubeAPI.getVideoInfo(videoUrl);
      } 
      
      else if (isInstagram) {
        platforms.push("Instagram");
        const views = await getInstagramReelViews(videoUrl);
        videoInfo = { views };
      }

      if (videoInfo) {
        totalViews += videoInfo.views || 0;
        validUrls.push(videoUrl);
      }
    }

    if (validUrls.length === 0) {
      return { success: false, error: "No valid video URLs provided." };
    }

    const { data: updatedSubmission, error: updateError } = await supabase
      .from("submissions")
      .update({
        video_urls: validUrls,
        views: totalViews,
        platforms: platforms,
      })
      .eq("id", submissionId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return { success: true, views: totalViews };
  } catch (error) {
    console.error("Error in updateSubmissionVideoUrl:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update submission",
    };
  }
}

