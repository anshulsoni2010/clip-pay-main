"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { cn } from "@/lib/utils"
import type { SubmissionWithCampaign } from "./page"

interface SubmissionsClientProps {
  submissions: SubmissionWithCampaign[]
  email: string
}

type TabType = "all" | "approved" | "pending" | "fulfilled" | "archived"

export function SubmissionsClient({
  submissions: initialSubmissions,
  email,
}: SubmissionsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("approved")
  const [submissions] = useState(initialSubmissions)

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All Submissions" },
    { id: "approved", label: "Approved Submissions" },
    { id: "pending", label: "Pending Submissions" },
    { id: "fulfilled", label: "Fulfilled" },
    { id: "archived", label: "Archived (Rejected)" },
  ]

  const filteredSubmissions = submissions.filter((submission) => {
    switch (activeTab) {
      case "pending":
        return submission.status === "pending"
      case "approved":
        return submission.status === "approved"
      case "fulfilled":
        return submission.status === "fulfilled"
      case "archived":
        return submission.status === "rejected"
      case "all":
      default:
        return true
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader userType="creator" email={email} />

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-8 pt-20 lg:pt-8">
          <div className="space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#101828]">Submissions</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-[#E4E7EC]">
              <nav className="flex -mb-px">
                {tabs.map((tab) => {
                  const count =
                    tab.id === "all"
                      ? submissions.length
                      : submissions.filter((s) => {
                          switch (tab.id) {
                            case "pending":
                              return s.status === "pending"
                            case "approved":
                              return s.status === "approved"
                            case "fulfilled":
                              return s.status === "fulfilled"
                            case "archived":
                              return s.status === "rejected"
                            default:
                              return false
                          }
                        }).length

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium whitespace-nowrap",
                        activeTab === tab.id
                          ? "text-[#5865F2] border-b-2 border-[#5865F2]"
                          : "text-[#475467] hover:text-[#101828]"
                      )}
                    >
                      {tab.label}
                      <span className="ml-2 text-xs rounded-full bg-[#F9FAFB] text-[#475467] px-2 py-0.5">
                        {count}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Conditional Payout Info
            {activeTab === "approved" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Payout Requirements:</span> Your
                  total approved submissions must reach $25 to start processing
                  payouts, with each individual submission earning at least $10.
                </p>
              </div>
            )} */}

            {/* Table Header */}
            <div className="border border-[#E4E7EC] rounded-lg bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E4E7EC]">
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-medium text-[#475467]">
                        Campaign
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-medium text-[#475467]">
                        Submitted
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-medium text-[#475467]">
                        Brand
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-medium text-[#475467]">
                        Performance
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-medium text-[#475467]">
                        Status
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC]">
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="group hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[#101828]">
                          {submission.campaign.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#475467]">
                          {new Date(submission.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}{" "}
                          {new Date(submission.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#475467]">
                            {
                              submission.campaign.brand.profile
                                ?.organization_name
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#475467]">
                              Views
                            </span>
                            <span className="text-xs font-medium text-[#101828]">
                              {/* Replace with actual data */}
                              --
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#475467] capitalize">
                          {submission.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
