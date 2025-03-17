// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import "https://deno.land/x/dotenv/load.ts";
import { YouTubeAPI } from "lib/youtube.ts";
import { getInstagramReelViews } from "lib/instagram.ts";
import { TikTokAPI } from "lib/tiktok.ts";

const supabase = createClient(
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("id, video_urls, platforms, user_id");

  if (error) {
    console.error("Error fetching submissions:", error);
    return new Response(JSON.stringify({ success: false, error: "Failed to fetch submissions" }), { status: 500 });
  }

  for (const submission of submissions) {
    let totalViews = 0;

    for (const videoUrl of submission.video_urls) {
      let views = 0;

      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoInfo = await YouTubeAPI.getVideoInfo(videoUrl);
        views = videoInfo?.views || 0;
      } else if (videoUrl.includes("instagram.com/reel/")) {
        const { data: creator } = await supabase
          .from("creators")
          .select("instagram_username")
          .eq("user_id", submission.user_id)
          .single();

        if (creator?.instagram_username) {
          views = await getInstagramReelViews(videoUrl, creator.instagram_username);
        }
      } else if (videoUrl.includes("tiktok.com")) {
        const { data: creator } = await supabase
          .from("creators")
          .select("tiktok_access_token")
          .eq("user_id", submission.user_id)
          .single();

        if (creator?.tiktok_access_token) {
          const tiktokApi = new TikTokAPI();
          const videoInfo = await tiktokApi.getVideoInfo(videoUrl, creator.tiktok_access_token, submission.user_id);
          views = videoInfo?.views || 0;
        }
      }

      totalViews += views;
    }

    await supabase
      .from("submissions")
      .update({ views: totalViews })
      .eq("id", submission.id);
  }

  return new Response(JSON.stringify({ success: true, message: "Views updated" }), { status: 200 });
}


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-video-views' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
