"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
interface Transaction {
  id: string
  amount: number
  status: string
  created: number
  arrival_date: number | null
  description: string | null
  type: string
}

interface EarningsClientProps {
  // hasStripeAccount: boolean
  totalEarned: number
  availableForPayout: number
  hasPayPalAccount: boolean
  paypalAccountStatus: string
  pendingEarnings: number
  submissions: Array<{
    id: string
    campaign_title: string
    brand_name: string
    earned: number
    status: string
    created_at: string
  }>
}

export function EarningsClient({
  // hasStripeAccount,
  totalEarned,
  availableForPayout,
  pendingEarnings,
  submissions,
  hasPayPalAccount,
  paypalAccountStatus,
}: EarningsClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3">
        <div className="bg-white rounded-l-lg border border-l-2 border-t-2 border-b-2 border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl  font-semibold text-zinc-900">
              Total Earned
            </h3>
          </div>
          <p className="text-2xl font-semibold text-zinc-900">
            ${totalEarned.toFixed(2)}
          </p>
        </div>

        <div className="col-span-2 rounded-r-lg border-t-2 border-b-2 border-r-2 bg-white border border-zinc-200 w-fit p-6">
          <div className="space-y-2">
            <h3 className="text-2xl  font-semibold text-zinc-900">
              Account Status
            </h3>
            <div>
              <span className="text-black">
                {hasPayPalAccount
                  ? "Account Connected"
                  : "Connect Your Account"}
              </span>

              <div className="">
                <div className="text-sm text-zinc-600 mt-1">
                  {hasPayPalAccount ? (
                    <h2 className="text-sm"> ● Paypal Account Connected </h2>
                  ) : (
                    "Not connected"
                  )}
                </div>
                {hasPayPalAccount ? (
                  <span> </span>
                ) : (
                  <Button
                    onClick={() =>
                      (window.location.href = "/api/paypal/connect")
                    }
                  >
                    Connect PayPal
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg py-1 px-1">
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="text-lg font-semibold text-zinc-900">
              Recent Activity
            </h2>

            {/* when user clicks on the refresh button, the page should refresh */}
            <div
              onClick={() => window.location.reload()}
              className="cursor-pointer w-6 h-6 rounded-md border-zinc-300 border-2 bg-slate-100 flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          {/* {availableForPayout > 0 (
            <Button
              onClick={() => (window.location.href = "/api/stripe/payout")}
              className="bg-black hover:bg-black/90 text-white"
            >
              Cash Out (${availableForPayout.toFixed(2)})
            </Button>
          )} */}
          {availableForPayout > 0 && paypalAccountStatus && (
            <Button
              onClick={async () => {
                setIsLoading(true) // Start loading
                try {
                  const response = await fetch("/api/paypal/payout", {
                    method: "POST",
                  })
                  const data = await response.json()

                  if (data.error) {
                    toast.error(`Error: ${data.error}`)
                  } else {
                    toast.success("Cashout successful! Refreshing...")
                    window.location.reload() // Refresh page after success
                  }
                } catch (error) {
                  console.error("Payout error:", error)
                  toast.error("An error occurred while processing the payout.")
                } finally {
                  setIsLoading(false) // Stop loading
                }
              }}
              className="bg-black hover:bg-black/90 text-white"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading
                ? "Processing..."
                : `Cash Out ($${availableForPayout.toFixed(2)})`}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border border-zinc-200"
              >
                <div>
                  <h3 className="font-medium text-zinc-900">
                    {submission.campaign_title}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {submission.brand_name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(submission.created_at).toDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-zinc-900">
                    ${submission.earned.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm capitalize ${
                      submission.status === "fulfilled"
                        ? "text-emerald-600"
                        : submission.status === "approved"
                          ? "text-blue-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {submission.status === "fulfilled"
                      ? "Paid"
                      : submission.status === "approved"
                        ? "Ready for Payment"
                        : "Pending"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-zinc-600">
              No earnings activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
