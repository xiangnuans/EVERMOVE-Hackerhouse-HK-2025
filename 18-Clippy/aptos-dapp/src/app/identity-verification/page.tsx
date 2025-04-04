"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";
import { Footer } from "@/components/Footer";

export default function IdentityVerificationPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const { toast } = useToast();

  const handleNavigation = () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
        duration: 3000,
        className: "!bg-red-500 border-none",
      });
      return;
    }
    router.push("/customize-agent");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white px-5 py-8 pb-24">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white/80 hover:text-white mb-8"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-3 mb-8">
          <div className="h-8 w-8 mt-1">
            <Lock className="w-full h-full text-[#3730A3]" />
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-1">Identity</h1>
            <h1 className="text-3xl font-medium">Verification</h1>
          </div>
        </div>

        {/* Security Options */}
        <div className="space-y-4">
          <Card
            className="bg-[#141416] hover:bg-[#1a1a1f] border-none p-4 rounded-xl cursor-pointer transition-colors relative"
            onClick={() => console.log("Privacy clicked")}
          >
            <div className="pr-8">
              <h3 className="text-lg font-medium mb-2">Privacy and security</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">
                  Your data oncryption using fartice pesezionyprography
                </p>
                <p className="text-sm text-gray-400">
                  Usera control over delata
                </p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight className="h-5 w-5 text-[#3730A3]" />
            </div>
          </Card>

          <Card
            className="bg-[#141416] hover:bg-[#1a1a1f] border-none p-4 rounded-xl cursor-pointer transition-colors relative"
            onClick={handleNavigation}
          >
            <div className="pr-8">
              <h3 className="text-lg font-medium mb-2">Data upload</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">
                  Learn mores st out data,
                </p>
                <p className="text-sm text-gray-400">
                  collection and share sharing
                </p>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight className="h-5 w-5 text-[#3730A3]" />
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
