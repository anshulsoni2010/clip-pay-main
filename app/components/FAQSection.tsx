"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Figtree } from "next/font/google"

type FAQItem = {
  question: string
  answer: string
}

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose weights you need
})
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqItems: FAQItem[] = [
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio.",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam.",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis.",
    },
    {
      question: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(index === openIndex ? -1 : index)
  }

  return (
    <section
      className="py-16 px-4 bg-[#eef6fc]"
      style={{ fontFamily: "'Satoshi Regular'" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <div className="bg-black text-white text-xs font-medium px-4 py-1 rounded-full mb-4">
            FAQs
          </div>
          <h2
            className={`text-4xl font-bold text-center mb-4  ${figtree.className}`}
          >
            <span className="text-[#00000099]">Frequently</span>{" "}
            <span className="text-black">Asked Questions</span>
          </h2>
          <p className="text-center text-gray-600 max-w-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            voluptatum
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-300 shadow-md ${
                openIndex === index
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{item.question}</span>
                <span className="flex-shrink-0 ml-2">
                  {openIndex === index ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </span>
              </button>
              <div
                className={`px-6 pb-4 transition-all duration-300 ${openIndex === index ? "block" : "hidden"}`}
              >
                <p className="text-sm">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
