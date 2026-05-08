"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Header from "@/components/header";
import { fetchUser } from "@/services/auth.service";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { hasCheckedAuth, isAuthenticated, setHasCheckedAuth, setUser } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hydrateSession = async () => {
      if (isAuthenticated || hasCheckedAuth) {
        return;
      }

      try {
        const response = await fetchUser();
        setUser(response.data.data.user);
      } catch {
        setHasCheckedAuth(true);
      }
    };

    hydrateSession();
  }, [hasCheckedAuth, isAuthenticated, setHasCheckedAuth, setUser]);

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasCheckedAuth, isAuthenticated, router]);

  if (!hasCheckedAuth || !isAuthenticated) {
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
