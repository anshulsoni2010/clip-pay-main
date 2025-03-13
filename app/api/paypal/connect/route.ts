import { redirect } from "next/navigation"

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const redirectUri = encodeURIComponent(process.env.PAYPAL_REDIRECT_URI || "")
  console.log("[DEBUG] Redirecting to PayPal connect flow", clientId)
  console.log("ReDirect uri", redirectUri)
  // const encodedRedirectUri = encodeURIComponent(redirectUri);
  const paypalAuthUrl = `https://www.sandbox.paypal.com/signin/authorize?client_id=${clientId}&response_type=code%20id_Token&scope=${encodeURIComponent("openid email profile address")}&redirect_uri=${redirectUri}`

  console.log("[DEBUG] Redirecting to PayPal connect flow", paypalAuthUrl)
  return redirect(paypalAuthUrl)
}
