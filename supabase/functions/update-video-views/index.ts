import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

import { YouTubeAPI } from "../../../lib/youtube";
import { getInstagramReelViews } from "../../../lib/instagram";
import { TikTokAPI } from "../../../lib/tiktok";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request) {
  // Allow only POST method
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Fetch submissions
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("id, video_urls, platforms, user_id");

    if (error || !submissions) {
      console.error("Error fetching submissions:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch submissions" }),
        { status: 500 }
      );
    }

    // Loop over each submission
    for (const submission of submissions) {
      let totalViews = 0;

      // Loop over each video URL
      for (const videoUrl of submission.video_urls || []) {
        let views = 0;

        // YouTube
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          const videoInfo = await YouTubeAPI.getVideoInfo(videoUrl);
          views = videoInfo?.views || 0;

        // Instagram Reel
        } else if (videoUrl.includes("instagram.com/reel/")) {
          const { data: creator, error: creatorError } = await supabase
            .from("creators")
            .select("instagram_username")
            .eq("user_id", submission.user_id)
            .single();

          if (creatorError) console.error("Instagram Creator Error:", creatorError);

          if (creator?.instagram_username) {
            views = await getInstagramReelViews(videoUrl, creator.instagram_username);
          }

        // TikTok
        } else if (videoUrl.includes("tiktok.com")) {
          const { data: creator, error: creatorError } = await supabase
            .from("creators")
            .select("tiktok_access_token")
            .eq("user_id", submission.user_id)
            .single();

          if (creatorError) console.error("TikTok Creator Error:", creatorError);

          if (creator?.tiktok_access_token) {
            const tiktokApi = new TikTokAPI();
            const videoInfo = await tiktokApi.getVideoInfo(
              videoUrl,
              creator.tiktok_access_token,
              submission.user_id
            );
            views = videoInfo?.views || 0;
          }
        }

        // Accumulate views
        totalViews += views;
      }

      // Update submission views
      const { error: updateError } = await supabase
        .from("submissions")
        .update({ views: totalViews })
        .eq("id", submission.id);

      if (updateError) console.error(`Failed to update views for submission ${submission.id}:`, updateError);
    }

    // Final success response
    return new Response(JSON.stringify({ success: true, message: "Views updated" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
