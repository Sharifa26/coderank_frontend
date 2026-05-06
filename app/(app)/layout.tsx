"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Header from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs on the client-side after hydration
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // You can replace this with a beautiful loading spinner component
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const hasCustomHeader = pathname === "/dashboard" || pathname === "/profile";

  return (
    <div className="flex flex-col min-h-screen">
      {!hasCustomHeader && <Header />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
