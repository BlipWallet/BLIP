"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const { ready, authenticated, user, logout } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="BLIP Logo"
            width={40}
            height={40}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/next.svg";
            }}
          />
          <h1 className="ml-3 text-xl font-bold">BLIP</h1>
        </div>
        <button
          onClick={() => logout()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          로그아웃
        </button>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-5xl">
        <div className="w-full bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4">
            환영합니다, {user?.email?.address || "사용자"}님!
          </h2>
          <p className="text-gray-600">
            BLIP은 솔라나 블록체인 기반 월렛 서비스입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">송금</h3>
            <p className="text-gray-600 mb-4">다른 주소로 솔라나 전송</p>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              송금하기
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">수신</h3>
            <p className="text-gray-600 mb-4">QR 코드 및 주소 공유</p>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              QR 코드 생성
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-3">브릿지</h3>
            <p className="text-gray-600 mb-4">Wormhole 인앱 브릿지</p>
            <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              브릿지 이용하기
            </button>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-500">
        <a href="/search" className="hover:text-blue-500">
          검색
        </a>
        <span>•</span>
        <a href="/social" className="hover:text-blue-500">
          소셜
        </a>
        <span>•</span>
        <a href="/settings" className="hover:text-blue-500">
          설정
        </a>
      </footer>
    </div>
  );
}
