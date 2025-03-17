import { orderController, paymentsController } from "@/lib/paypal"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  try {
    const { orderID, ...details } = await request.json()
    console.log(
      "[DEBUG] Starting payment confirmation for paymentIntentId:",
      orderID,
      details
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("[DEBUG] No user found in session")
      return NextResponse.json(
        { error: "Please sign in to continue" },
        { status: 401 }
      )
    }

    const { body, ...httpStatus } = await orderController.ordersCapture({
      id: orderID,
    })

    const order = JSON.parse(body.toString())
    console.log("[DEBUG] Order captured:", order)

    if (order?.status === "COMPLETED") {
      console.log(`[DEBUG] Payment of order ${orderID} completed successfully`)

      const transactionId = order?.purchase_units[0]?.payments?.captures[0]?.id
      const submissionId = order.purchase_units[0].reference_id

      const { error: transactionError } = await supabase
        .from("transactions")
        .update({ status: "completed", paypal_capture_id: transactionId })
        .eq("paypal_order_id", orderID)

      if (transactionError) {
        console.error("[DEBUG] Transaction update error:", transactionError)
        throw new Error("Failed to update transaction status")
      }

      console.log("[DEBUG] Transaction status updated successfully")

      // Update submission status
      const { error: submissionError } = await supabase
        .from("submissions")
        .update({ status: "paid" })
        .eq("id", submissionId)

      return NextResponse.json(
        {
          message: "Payment completed successfully",
        },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: `Payment Staus update failed status - ${order?.status}}` },
        { status: 400 }
      )
    }
    // JSON.parse(order.body.toString());
  } catch (error) {
    console.log("Error processing payment confirmation:", error)
    return NextResponse.json(
      { error: "Error processing payment confirmation", reason: error },
      { status: 400 }
    )
  }
}
