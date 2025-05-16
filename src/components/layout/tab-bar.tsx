"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";

export function TabBar() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: pathname === "/" ? HomeIconSolid : HomeIcon,
      active: pathname === "/",
    },
    {
      name: "Search",
      href: "/search",
      icon:
        pathname === "/search" ? MagnifyingGlassIconSolid : MagnifyingGlassIcon,
      active: pathname === "/search",
    },
    {
      name: "Social",
      href: "/social",
      icon: pathname === "/social" ? UserGroupIconSolid : UserGroupIcon,
      active: pathname === "/social",
    },
    {
      name: "Settings",
      href: "/setting",
      icon: pathname === "/setting" ? Cog6ToothIconSolid : Cog6ToothIcon,
      active: pathname === "/setting",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex flex-1 flex-col items-center pt-2 pb-2 ${
              tab.active ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
