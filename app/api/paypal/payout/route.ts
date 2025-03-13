import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: creator } = await supabase
        .from("creators")
        .select("paypal_email")
        .eq("user_id", user.id)
        .single()

    if (!creator?.paypal_email) {
        return NextResponse.json({ error: "PayPal not connected" }, { status: 400 })
    }

    const payoutResponse = await fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sender_batch_header: { email_subject: "You received a payment" },
            items: [{ recipient_type: "EMAIL", amount: { value: "100.00", currency: "USD" }, receiver: creator.paypal_email }]
        })
    }).then(res => res.json())

    return NextResponse.json(payoutResponse)
}
