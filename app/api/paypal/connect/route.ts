import { redirect } from "next/navigation"

export async function GET() {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const PAYPAL_REDIRECT_URI = encodeURIComponent(
    `${process.env.PAYPAL_REDIRECT_URI}`
  )

  const PAYPAL_SCOPES = encodeURIComponent(
    "openid email profile address https://uri.paypal.com/services/payments/realtimepayment " +
      "https://uri.paypal.com/services/payments/payment/authcapture " +
      "https://uri.paypal.com/services/payments/refund " +
      "https://api.paypal.com/v1/vault/credit-card/.* " +
      "https://uri.paypal.com/services/subscriptions " +
      "https://uri.paypal.com/services/applications/webhooks"
  )

  const paypalAuthUrl = `https://www.sandbox.paypal.com/signin/authorize?client_id=${PAYPAL_CLIENT_ID}&response_type=code&scope=${PAYPAL_SCOPES}&redirect_uri=${PAYPAL_REDIRECT_URI}`

  console.log("[DEBUG] Redirecting to PayPal connect flow", paypalAuthUrl)
  return redirect(paypalAuthUrl)
}
