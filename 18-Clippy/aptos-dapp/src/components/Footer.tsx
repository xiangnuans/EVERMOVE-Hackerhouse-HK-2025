"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag, User } from "lucide-react";

const navItems = [
  {
    label: "Home",
    icon: Home,
    path: "/",
    activeOn: [
      "/",
      "/customize-agent",
      "/identity-verification",
      "/knowledge-base",
    ],
  },
  {
    label: "Market",
    icon: ShoppingBag,
    path: "/ai-agents",
    activeOn: ["/ai-agents", "/market", "/buy-robot", "/your-robot"],
  },
  {
    label: "Profile",
    icon: User,
    path: "/my-assets",
    activeOn: ["/my-assets", "/profile"],
  },
];

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (item: (typeof navItems)[0]) => {
    return item.activeOn.includes(pathname);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#141416] border-t border-gray-800">
      <div className="max-w-md mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center space-y-1 ${
                isActive(item)
                  ? "text-[#3730A3]"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
