"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CustomizeAgentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-8">
      <div className="max-w-md mx-auto px-5">
        {/* Back button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-8">
          <div className="h-8 w-8 mt-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-[#3730A3]"
            >
              <path
                d="M4 8h16M20 8l-4-4M20 8l-4 4M4 8l4-4M4 8l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 16H4M4 16l4-4M4 16l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-1">Customize Your</h1>
            <h1 className="text-3xl font-medium">AI Agent</h1>
          </div>
        </div>

        {/* Agent Preview */}
        <div className="relative aspect-square mb-8 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1f] to-[#0A0A0B]">
            <div className="absolute inset-0">
              <Image
                src="/images/agent.png"
                alt="AI Agent"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mb-8">
          <Button variant="primary" onClick={() => router.push("/")}>
            Create
          </Button>
        </div>

        {/* Customization Options */}
        <div className="space-y-4">
          <Card className="bg-[#141416] border-none p-4 rounded-xl transition-colors">
            <div className="space-y-2">
              <label className="text-lg font-medium block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter agent name"
                className="w-full bg-[#1a1a1f] text-white border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3730A3] placeholder:text-gray-500"
              />
            </div>
          </Card>

          <Card className="bg-[#141416] border-none p-4 rounded-xl transition-colors">
            <div className="space-y-2">
              <label className="text-lg font-medium block">Personality</label>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe agent personality"
                rows={3}
                className="w-full bg-[#1a1a1f] text-white border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3730A3] placeholder:text-gray-500 resize-none"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
