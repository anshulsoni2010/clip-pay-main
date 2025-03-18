import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

import { YouTubeAPI } from "../../../lib/youtube";
import { getInstagramReelViews } from "../../../lib/instagram";
import { TikTokAPI } from "../../../lib/tiktok";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
    fn()
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

export async function updateSubmissionVideoUrl(
  submissionId: string | string[],
  videoUrls: string | string[]
): Promise<{ success: boolean; views?: number; error?: string }> {
  if (Array.isArray(submissionId)) {
    return Promise.all(
      submissionId.map((id) => updateSubmissionVideoUrl(id, videoUrls))
    )
      .then((results) => ({
        success: results.every((r) => r.success),
        views: results.reduce((sum, r) => sum + (r.views || 0), 0),
      }))
      .catch((error) => ({
        success: false,
        error: error.message || "An error occurred",
      }))
  }

  if (typeof videoUrls === "string") {
    videoUrls = [videoUrls] // Convert single string to array
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    let validUrls: string[] = []
    let platforms: string[] = []
    let totalViews = 0

    for (const videoUrl of videoUrls) {
      if (!videoUrl.trim()) continue

      const isTikTok = videoUrl.includes("tiktok.com")
      const isYouTube =
        videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
      const isInstagram = videoUrl.includes("instagram.com/reel/")

      if (!isTikTok && !isYouTube && !isInstagram) {
        return {
          success: false,
          error: "Invalid video URL. Use TikTok, YouTube, or Instagram.",
        }
      }

      let videoInfo = null

      if (isTikTok) {
        platforms.push("TikTok")
        const { data: creator } = await supabase
          .from("creators")
          .select("tiktok_access_token")
          .eq("user_id", user.id)
          .single()

        if (!creator?.tiktok_access_token) {
          return { success: false, error: "TikTok not connected" }
        }

        const tiktokApi = new TikTokAPI()
        videoInfo = await tiktokApi.getVideoInfo(
          videoUrl,
          creator.tiktok_access_token,
          user.id
        )
      } else if (isYouTube) {
        platforms.push("YouTube")
        videoInfo = await YouTubeAPI.getVideoInfo(videoUrl)
      } else if (isInstagram) {
        platforms.push("Instagram")
        const { data: creator } = await supabase
          .from("creators")
          .select("instagram_username")
          .eq("user_id", user.id)
          .single()

        if (!creator?.instagram_username) {
          return { success: false, error: "Instagram not connected" }
        }

        try {
          const views = await fetchWithTimeout(
            () => getInstagramReelViews(videoUrl, creator.instagram_username),
            10000 // 10 seconds timeout
          )
          videoInfo = { views }
        } catch (error) {
          console.error("Instagram Reel fetch failed:", error)
          videoInfo = { views: 0 } // Default to 0 views if request fails
        }
      }

      if (videoInfo) {
        totalViews += videoInfo.views || 0
        validUrls.push(videoUrl)
      }
    }

    if (validUrls.length === 0) {
      return { success: false, error: "No valid video URLs provided." }
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
      .single()

    if (updateError) {
      throw updateError
    }

    return { success: true, views: totalViews }
  } catch (error) {
    console.error("Error in updateSubmissionVideoUrl:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update submission",
    }
  }
}

