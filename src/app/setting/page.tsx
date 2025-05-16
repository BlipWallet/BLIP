"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import {
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  LanguageIcon,
  BellAlertIcon,
  LockClosedIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function SettingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const { logout, authenticated, user } = usePrivy();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Get user display name or email from Privy user object
  const getUserDisplayName = () => {
    if (!user) return "Anonymous User";

    // Try to get email from user object
    let email = "";
    if (user.email) {
      if (typeof user.email === "string") {
        email = user.email;
      } else if (user.email.address) {
        email = user.email.address;
      }
    }

    if (email) return email;

    // Fallback to wallet address if available
    if (user.wallet?.address) {
      return `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
        -4
      )}`;
    }

    return "User";
  };

  // Get first letter for avatar
  const getInitial = () => {
    if (!user) return "U";
    if (user.email) return user.email.address[0].toUpperCase();
    if (user.wallet?.address) return user.wallet.address[0].toUpperCase();
    return "U";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* User info if authenticated */}
      {authenticated && user && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              <UserCircleIcon className="h-full w-full text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold">{getUserDisplayName()}</h2>
              <p className="text-sm text-gray-500">
                {user.wallet?.address
                  ? "Wallet connected"
                  : "No wallet connected"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Theme settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <MoonIcon className="h-6 w-6 text-indigo-600" />
              ) : (
                <SunIcon className="h-6 w-6 text-amber-500" />
              )}
              <div>
                <h2 className="font-semibold">Theme Settings</h2>
                <p className="text-sm text-gray-500">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Language settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3 mb-3">
            <LanguageIcon className="h-6 w-6 text-green-500" />
            <h2 className="font-semibold">Language Settings</h2>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Notification settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellAlertIcon className="h-6 w-6 text-red-500" />
              <div>
                <h2 className="font-semibold">Notification Settings</h2>
                <p className="text-sm text-gray-500">
                  {notifications ? "Notifications On" : "Notifications Off"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Security settings */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="font-semibold">Security Settings</h2>
              <p className="text-sm text-gray-500">
                Password and account security
              </p>
            </div>
          </div>
          <button className="mt-2 text-blue-600 text-sm">Change &gt;</button>
        </div>

        {/* Logout Button */}
        {authenticated && (
          <div className="bg-white rounded-lg shadow p-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600" />
                <div>
                  <h2 className="font-semibold">Log Out</h2>
                  <p className="text-sm text-gray-500">
                    Sign out from your account
                  </p>
                </div>
              </div>
              <span className="text-red-600">→</span>
            </button>
          </div>
        )}

        {/* Other settings links */}
        <div className="mt-6 space-y-2">
          <button className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            <span>Terms of Service</span>
          </button>
          <button className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded-lg">
            <DocumentTextIcon className="h-5 w-5 text-gray-500" />
            <span>Privacy Policy</span>
          </button>
          <button className="flex items-center gap-2 p-2 w-full hover:bg-gray-100 rounded-lg">
            <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500" />
            <span>Support</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">App Version: 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
