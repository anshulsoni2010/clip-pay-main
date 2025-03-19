
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function LaunchCampaign() {
  return (
     <>
      <Link href="/launch">
        <button className="bg-black text-white flex gap-4 items-center px-6 py-3 rounded-full  font-semibold hover:bg-gray-900 transition">
          Launch a campaign
          <ChevronRight className="w-8 h-8 text-sm border rounded-full  bg-white text-black" />
        </button>
      </Link>
     </>
  )
  }
  