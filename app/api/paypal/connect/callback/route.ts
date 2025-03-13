import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Authorization code not found" }, { status: 400 });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const redirectUri = process.env.PAYPAL_REDIRECT_URI;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri || "",
        }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        return NextResponse.json({ error: "Failed to get access token", details: tokenData }, { status: 400 });
    }

    return NextResponse.json({ message: "Successfully connected PayPal", tokenData });
}
