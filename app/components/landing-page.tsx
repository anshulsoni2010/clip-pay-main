"use client"

import { LandingNav } from "@/components/landing-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CircleCheckBig } from "lucide-react"
import { Figtree } from "next/font/google"
import { LaunchCampaign } from "@/components/launchCampaign"
import Image from "next/image"
import FAQSection from "./FAQSection"
import Footer from "./Footer"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose weights you need
})
const brandsContent = {
  hero: {
    title: "Go Viral with Performance-Based Creators",
    description:
      "Access 100s of talented creators who work on a CPM basis and skyrocket your brand's visibility",
    cta: {
      text: "Launch a Campaign",
      link: "/signup/brand",
    },
  },
  features: {
    title: "Why Brands love",
    items: [
      {
        title: "Performance-Based Model",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      },
      {
        title: "Cost-Effective Advertising",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        ),
      },
      {
        title: "Access to Diverse Creators",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        ),
      },
      {
        title: "Real-time Analytics",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique.",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        ),
      },
    ],
  },
  howItWorks: {
    title: "How it Works for",
    title2: "Brands",
    steps: [
      {
        number: 1,
        title: "Launch a Campaign",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.5V19.5M19.5 12H4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        number: 2,
        title: "Creators Submit Videos",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.5V19.5M19.5 12H4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        number: 3,
        title: "Watch the Views Roll In",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.5V19.5M19.5 12H4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
}

const creatorsContent = {
  hero: {
    title: "Get Paid to Create Content",
    description:
      "Join our platform and earn money for every view your content generates. No upfront costs, just pure creativity.",
    cta: {
      text: "Start Creating",
      link: "/signup/creator",
    },
  },
  features: {
    title: "Why Creators love ClipPay",
    items: [
      {
        title: "Performance-Based Pay",
        description:
          "Get paid for every view your content generates. The more engagement, the more you earn!",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      },
      {
        title: "Work with Top Brands",
        description:
          "Connect with established brands looking for authentic creators like you.",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        ),
      },
      {
        title: "Flexible Campaigns",
        description:
          "Choose projects that match your style and create on your schedule.",
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      },
    ],
  },
  howItWorks: {
    title: "How it Works for",
    title2: "Creators",
    steps: [
      {
        number: 1,
        title: "Join Clip Pay",
        description: "Create your Creator Account",
      },
      {
        number: 2,
        title: "Browse Campaigns",
        description: "Find brands that match your style",
      },
      {
        number: 3,
        title: "Create Content",
        description: "Produce videos based on campaign briefs",
      },
      {
        number: 4,
        title: "Earn Money",
        description: "Get paid for the views your content generates",
      },
    ],
  },
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="border-[3px] border-[#C9D5ED]  p-4 rounded-3xl">
      <div
        className="py-9 px-4 relative bg-[#FFFFFF] rounded-2xl drop-shadow-md"
        style={{ fontFamily: "'Satoshi Regular'" }}
      >
        <div className="flex flex-col gap-1">
          <div className="w-12 h-12 rounded-full">
            <svg
              className=" text-[#333]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {icon}
            </svg>
          </div>
          <div className="font-semibold">{title}</div>
          <div className="text-[#444444] pr-5">{description}</div>
        </div>
      </div>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
  icon,
  position,
}: {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  position: "left" | "right"
}) {
  return (
    <div
      className={`relative w-full max-w-lg mx-auto md:mx-20 ${
        position === "left" ? "md:self-start" : "md:self-end"
      }`}
    >
      {/* Large background step number */}
      <div
        className="absolute md:flex items-center gap-2 text-6xl md:text-9xl font-extrabold text-[#DFEEF6] select-none uppercase hidden"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          left: position === "left" ? "calc(100% + 30px)" : "auto",
          right: position === "right" ? "calc(100% + 30px)" : "auto",
          whiteSpace: "nowrap",
        }}
      >
        STEP {number.toString().padStart(2, "0")}
      </div>

      {/* Card */}
      <div className="border-[3px] border-[#C9D5ED]  p-4 rounded-3xl">
        <div className="py-6 px-6 md:px-8 relative bg-white rounded-2xl shadow-md w-full z-10">
          <div className="flex flex-col gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="text-black">{icon}</div>
            </div>
            <div className="font-semibold text-lg md:text-xl">{title}</div>
            <div className="text-gray-600 text-sm md:text-base">
              {description}
            </div>
          </div>
        </div>
      </div>
      {/* Connecting dotted line */}
      {number < 3 && (
        <>
          {position === "left" ? (
            <div className="hidden md:block absolute -right-16  top-56 md:top-80">
              <Image
                src="/assets/dottedline2.svg"
                alt="Dotted Line"
                width={80}
                height={10}
              />
            </div>
          ) : (
            <div className="hidden md:block absolute -left-20 top-80 rotate-180">
              <Image
                src="/assets/dottedline.svg"
                alt="Dotted Line"
                width={80}
                height={10}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface LandingPageProps {
  view: "brands" | "creators"
}

export function LandingPage({ view }: LandingPageProps) {
  const content = view === "brands" ? brandsContent : creatorsContent

  return (
    <div className="min-h-screen  from-blue-50 to-white">
      <LandingNav view={view} />

      <main className="">
        {/* Hero Section */}
        {/* Hero Section */}
        <div
          className={`h-screen flex items-center justify-center text-center bg-[url('/assets/herobg.jpeg')] bg-cover bg-center ${figtree.className}`}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-center">
              <h1 className="text-[#2A577D] border border-[#EEE0FC] rounded-full text-center px-6 py-2 font-medium md:text-lg">
                {" "}
                Turn Visitors into Leads – Instantly!
              </h1>{" "}
            </div>
            <h1
              className={`text-4xl lg:text-6xl font-bold text-[#000000] ${figtree.className}`}
            >
              Go Viral with Performance-Based Creators
            </h1>
            <p className="font-medium text-[#2D2D2D] max-w-md mx-4 md:mx-auto -mt-4">
              Access 100s of talented creators who work on a CPM basis and
              skyrocket your brand's visibility.
            </p>
            <div className="flex items-center justify-center">
              <LaunchCampaign />
            </div>
            {/* <p className="text-sm ">
      <CircleCheckBig/> No credit card needed • ⭕ Unlimited time on Free plan
    </p> */}
            <div className="flex flex-col md:flex-row  justify-center gap-8 mx-4">
              <div className="flex gap-2 justify-center">
                <CircleCheckBig /> No credit card needed
              </div>
              <div className="flex gap-2 justify-center">
                <CircleCheckBig /> Unlimited time on Free plan
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="bg-[#EAF8FF] h-full">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 "
            style={{ fontFamily: "'Satoshi Regular'" }}
          >
            <div className="flex justify-center">
              <button className="bg-black text-white flex gap-4 items-center px-6 py-2 text-sm font-bold rounded-full   hover:bg-gray-900 transition">
                How Clippay Works
              </button>
            </div>
            <h2
              className={`text-5xl font-bold text-center text-black mt-4  ${figtree.className}`}
            >
              {content.features.title}{" "}
              <span className="text-[#00000099] font-extrabold">ClipPay</span>
            </h2>
            <div className="flex justify-center">
              <h2 className="text-center text-[#2D2D2D] max-w-xl m-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum{" "}
              </h2>
            </div>
            <div
              className={`grid gap-8 md:mx-6 ${
                view === "brands"
                  ? "md:grid-cols-2 lg:grid-cols-2"
                  : "md:grid-cols-3 lg:grid-cols-3"
              }`}
            >
              {content.features.items.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-[#E8F0FF] via-[#E0ECFF] to-[#F5E8FF] rounded-[32px] p-6">
            <h2 className="text-3xl font-bold text-zinc-900 mb-8 text-center">
              Join the ClipPay Revolution
            </h2>
            <div className="text-zinc-500 text-base max-w-md mx-auto mb-8 text-center">
              Whether you're a brand looking to boost your visibility or a
              creator ready to monetize your talent, ClipPay is your gateway to
              success in the digital content world.
            </div>
            <div className="flex items-center justify-center">
              <Link href="/signup/creator">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-zinc-800 rounded-full rounded-xl p-[2px]">
                  <div className="text-md bg-white rounded-xl w-[300px] flex items-center justify-center p-2">
                    Start Your Creator Journey{" "}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div> */}

        {/* How it Work */}
        <section
          className="bg-[#EAF8FF] pt-20"
          style={{ fontFamily: "'Satoshi Regular'" }}
        >
          <div className="flex justify-center">
            <button className="bg-black text-white flex gap-4 items-center px-6 py-2 text-sm font-bold rounded-full   hover:bg-gray-900 transition">
              How Clippay Works
            </button>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2
              className={`text-5xl font-bold text-center text-black mt-4  ${figtree.className}`}
            >
              {content.howItWorks.title}{" "}
              <span className="text-[#00000099] font-extrabold">
                {content.howItWorks.title2}
              </span>
            </h2>
            <div className="flex justify-center">
              <h2 className="text-center text-[#2D2D2D] max-w-xl m-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum{" "}
              </h2>
            </div>
            <div className="flex flex-col relative gap-20 my-10 px-4 md:px-0">
              {content.howItWorks.steps.map((step, index) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  position={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          </div>
        </section>

        {/* <h2 className="text-3xl font-bold text-center mb-6 mt-6 text-zinc-900">
          {view === "brands"
            ? "Ready to Boost Your Brand with Creator Content?"
            : "Ready to Monetize Your Creativity?"}
        </h2> */}
        {/* CTA Section */}
        {/* <div className="bg-[#7a7aaa] border-y border-[#5865F2]/10">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mx-auto">
            <div className="text-center flex items-center justify-center">
              <p className="text-lg text-white mr-4">
                {view === "brands"
                  ? "Connect with talented creators to amplify your brand message."
                  : "Join Clip Pay and start earning for your creative content today."}
              </p>
              <Link
                href={view === "brands" ? "/signup/brand" : "/signup/creator"}
              >
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-zinc-800 rounded-full rounded-xl p-[2px]">
                  <div className="text-md bg-[#7a7aaa] rounded-xl w-[200px] flex items-center justify-center p-2 text-white">
                    Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div> */}

        <FAQSection />
        {/* Footer */}
        <Footer />
      </main>
    </div>
  )
}
