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
) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not found" }
  }

  try {
    // Update profile with organization name
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        organization_name: organizationName,
      } satisfies Database["public"]["Tables"]["profiles"]["Update"])
      .eq("user_id", user.id)

    if (updateError) throw updateError

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

