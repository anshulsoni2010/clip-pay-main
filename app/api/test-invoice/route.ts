import { sendInvoiceEmail } from "@/lib/email"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await sendInvoiceEmail({
      email: "loki77627@gmail.com", // Replace with your email
      name: "John Doe",
      amount: "100.00",
      currency: "USD",
      orderId: "TEST12345",
      transactionId: "TXN987654",
    })

    return NextResponse.json(
      { message: "Test invoice email sent!" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[ERROR] Email Test Failed:", error)
    return NextResponse.json(
      { error: "Email test failed", reason: error },
      { status: 500 }
    )
  }
}
