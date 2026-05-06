"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSharedCode } from "@/services/code.service";
import { ICodeSnippet } from "@/types";
import { toast } from "sonner";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to load shared code";

export default function SharedCodePage() {
  const params = useParams<{ shareId: string }>();
  const [snippet, setSnippet] = useState<ICodeSnippet | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const loadSharedCode = async () => {
      try {
        const response = await getSharedCode(params.shareId);
        setSnippet(response.data.data.snippet);
      } catch (caughtError: unknown) {
        setError(getErrorMessage(caughtError));
      } finally {
        setIsLoading(false);
      }
    };

    if (params.shareId) {
      loadSharedCode();
    }
  }, [params.shareId]);

  const handleCopyCode = async () => {
    if (!snippet?.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(snippet.code);
      setIsCopied(true);
      toast.success("Code copied");
      window.setTimeout(() => setIsCopied(false), 1600);
    } catch {
      toast.error("Copy failed", {
        description: "Unable to copy code to clipboard.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#020813] px-5 py-6 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(20,60,98,0.18),transparent_34%),linear-gradient(180deg,#020813_0%,#020711_55%,#040b16_100%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl flex-col">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="CodeNova"
              width={44}
              height={44}
              preload
              className="h-11 w-11 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold leading-none">
                Code<span className="text-[#824cff]">Nova</span>
              </h1>
              <p className="mt-1 text-sm text-[#a9afc2]">Shared code</p>
            </div>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#203149] bg-[#06101c]/72 shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.03)]">
          {isLoading && (
            <div className="flex flex-1 items-center justify-center gap-3 p-10 text-[#a9afc2]">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading shared code...
            </div>
          )}

          {!isLoading && error && (
            <div className="flex flex-1 items-center justify-center p-10 text-center text-red-300">
              {error}
            </div>
          )}

          {!isLoading && snippet && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b2a3c] px-6 py-5">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-white">
                    {snippet.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#909ab1]">
                    Shared Code Snippet
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-[#2b4161] bg-[#07111e]/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#b9c4d6]">
                    {snippet.language}
                  </span>
                  <Button
                    type="button"
                    className="h-9 rounded-lg bg-[#08a64f] px-4 text-sm font-semibold text-white hover:bg-[#0abb5d]"
                    onClick={handleCopyCode}
                  >
                    {isCopied ? (
                      <Check className="mr-2 h-4 w-4" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto bg-[#020813]/45">
                <pre className="min-h-[560px] p-7 font-mono text-[0.95rem] leading-7 text-[#f1f5f9]">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
