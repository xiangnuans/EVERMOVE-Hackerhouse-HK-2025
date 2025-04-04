"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";

export default function YourRobotPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-8 pb-24">
      <div className="max-w-md mx-auto px-5">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white/80 hover:text-white mb-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Your Robot</h1>
          <h1 className="text-3xl font-medium">NFT</h1>
        </div>

        {/* Loading Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg">
              {progress < 100 ? "LOADING..." : "COMPLETED"}
            </span>
            <span className="text-lg">{progress}%</span>
          </div>
          <div className="h-2 bg-[#141416] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3730A3] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Robot Preview */}
        <div className="relative aspect-square mb-8 rounded-3xl overflow-hidden bg-[#141416]">
          <Image
            src="/images/robot.png"
            alt="Robot NFT"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Done Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={() => router.push("/ai-agents")}
            disabled={progress < 100}
          >
            Done
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
