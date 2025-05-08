"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useLoginWithOAuth } from "@privy-io/react-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { authenticated, ready } = usePrivy();
  const { initOAuth, loading } = useLoginWithOAuth({
    onComplete: ({ user, isNewUser }) => {
      console.log("로그인 성공:", user, "신규 사용자:", isNewUser);
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const handleGoogleLogin = async () => {
    try {
      await initOAuth({ provider: "google" });
    } catch (err) {
      console.error("구글 로그인 오류:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            {/* <Image
              src="/logo.png"
              alt="BLIP Logo"
              width={80}
              height={80}
              className="rounded-full"
              onError={(e) => {
                e.currentTarget.src = "/next.svg";
              }}
            /> */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BLIP</h1>
          <p className="text-gray-600 mb-6">솔라나 블록체인 월렛</p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full py-3 flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
            onClick={handleGoogleLogin}
            variant="outline"
            disabled={loading}
          >
            {loading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 186.69 190.5"
              >
                <g transform="translate(1184.583 765.171)">
                  <path
                    d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                    fill="#4285f4"
                  />
                  <path
                    d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                    fill="#34a853"
                  />
                  <path
                    d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.695-24.592 31.695-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                    fill="#fbbc05"
                  />
                  <path
                    d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                    fill="#ea4335"
                  />
                </g>
              </svg>
            )}
            {loading ? "로그인 중..." : "Google로 로그인"}
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            로그인하면 BLIP의 이용약관과 개인정보처리방침에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
