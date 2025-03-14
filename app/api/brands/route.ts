import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key
);

// Add a team member
export async function POST(req: Request) {
  const { email, brandId } = await req.json();

  console.log("Received request:", { email, brandId });

  // Validate input
  if (!email || !brandId) {
    return NextResponse.json({ error: "Email and Brand ID are required" }, { status: 400 });
  }

  // ✅ Get user ID using `auth.admin.listUsers()`
  const { data: userList, error: userError } = await supabaseAdmin.auth.admin.listUsers();

  if (userError || !userList) {
    console.error("Error fetching user from auth:", userError);
    return NextResponse.json({ error: "Error fetching user list" }, { status: 500 });
  }

  // ✅ Find the user by email
  const user = userList.users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json({ error: "User not found in authentication" }, { status: 404 });
  }

  const userId = user.id;
  console.log("User found in auth:", userId);

  // ✅ Check if user is already a team member
  const { data: existingMember, error: checkError } = await supabaseAdmin
    .from("brand_team_members")
    .select("id")
    .eq("brand_id", brandId)
    .eq("user_id", userId)
    .single();

  if (existingMember) {
    console.log("User is already a team member, skipping insert.");
  } else {
    // ✅ Insert user into brand_team_members
    const { error: insertError } = await supabaseAdmin
      .from("brand_team_members")
      .insert({ brand_id: brandId, user_id: userId });

    if (insertError) {
      console.error("Error inserting team member:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log("Team member added successfully:", userId);
  }

  // ✅ Always update user_type to "brand_team"
  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ user_type: "brand_team" })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating user_type:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  console.log("User type updated to 'brand_team' for:", userId);

  return NextResponse.json({ message: "Team member added & user_type updated successfully" });
}



// Remove a team member
export async function DELETE(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { userId, brandId } = await req.json();

  const { error } = await supabase
    .from("brand_team_members")
    .delete()
    .eq("brand_id", brandId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Team member removed successfully" });
}

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");

  if (!brandId) {
    return NextResponse.json([], { status: 200 }); // Return empty array if no brandId
  }

  // Fetch team members (user IDs) from brand_team_members
  const { data: teamMembers, error: teamError } = await supabase
    .from("brand_team_members")
    .select("user_id")
    .eq("brand_id", brandId);

  if (teamError) {
    console.error("Error fetching team members:", teamError);
    return NextResponse.json({ error: teamError.message }, { status: 500 });
  }

  const userIds = teamMembers.map((member) => member.user_id);

  if (userIds.length === 0) {
    return NextResponse.json([], { status: 200 }); // No team members
  }

  // ✅ Fetch emails from auth.users using the Service Role Key
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role required for auth.users access
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();

  if (userError || !users) {
    console.error("Error fetching emails from auth.users:", userError);
    return NextResponse.json({ error: "Error fetching emails" }, { status: 500 });
  }

  // Match user emails with team member IDs
  const result = userIds.map((userId) => {
    const user = users.users.find((u) => u.id === userId);
    return { id: userId, email: user?.email || "Unknown" };
  });

  return NextResponse.json(result);
}

