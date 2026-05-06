"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  Code2,
  Expand,
  LayoutDashboard,
  Minimize2,
  Play,
  Save,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AiOptimizerPanel from "@/components/ai-optimizer-panel";
import OutputPanel from "@/components/output-panel";
import {
  optimizeCode,
  runCode,
  saveCode,
  shareCode,
} from "@/services/code.service";
import { toast } from "sonner";
import { IRunCodeResponse, IOptimizeResponse } from "@/types";
import { useAuthStore } from "@/store/auth.store";
import {
  languageDetails,
  languages,
  SupportedLanguage,
} from "@/lib/default-code";
import UserAvatar from "@/components/user-avatar";

// Dynamically import the CodeEditor to avoid SSR issues with Monaco
const CodeEditor = dynamic(() => import("@/components/code-editor"), {
  ssr: false,
});

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const getPublicShareUrl = (
  shareData: { shareId?: string; shareUrl?: string },
  fallbackId: string,
) => {
  const shareId =
    shareData.shareId ||
    shareData.shareUrl?.split("/").filter(Boolean).at(-1) ||
    fallbackId;

  return `${window.location.origin}/share/${shareId}`;
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  console.log("User in Dashboard:", user);
  const router = useRouter();
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState(languageDetails.python.defaultCode);
  const [language, setLanguage] = useState<SupportedLanguage>("python");
  const [stdin, setStdin] = useState("");
  const [lastStdin, setLastStdin] = useState("");
  const [output, setOutput] = useState<IRunCodeResponse["data"] | null>(null);
  const [savedCodeId, setSavedCodeId] = useState<string | null>(null);
  const [saveTitle, setSaveTitle] = useState("Untitled");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isShareLinkCopied, setIsShareLinkCopied] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiResult, setAiResult] = useState<IOptimizeResponse["data"] | null>(
    null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleRun = async () => {
    setOutput(null);
    setIsRunning(true);
    setLastStdin(stdin);

    try {
      const response = await runCode({ language, code, stdin });
      setOutput(response.data.data);
    } catch (error: unknown) {
      toast.error("Execution Failed", {
        description: getErrorMessage(error),
      });
      setOutput({
        output: "",
        error: getErrorMessage(error),
        exitCode: 1,
        executionTime: "0ms",
        status: "error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setAiResult(null);
    setIsAiPanelOpen(true);
    try {
      const response = await optimizeCode({ language, code });
      setAiResult(response.data.data);
    } catch (error: unknown) {
      toast.error("Optimization Failed", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    const nextLanguage = value as SupportedLanguage;
    setLanguage(nextLanguage);
    setCode(languageDetails[nextLanguage].defaultCode);
    setOutput(null);
    setLastStdin("");
    setSavedCodeId(null);
  };

  const openSaveDialog = () => {
    setSaveTitle("Untitled");
    setIsSaveDialogOpen(true);
  };

  const handleSave = async () => {
    const title = saveTitle.trim() || "Untitled";

    setIsSaving(true);
    try {
      const response = await saveCode({
        title,
        language,
        code,
        stdin: lastStdin,
        stdout: output?.output,
        stderr: output?.error,
        status: output?.status,
      });

      setSavedCodeId(response.data.data.snippet._id);
      setIsSaveDialogOpen(false);
      toast.success("Code saved", {
        description: `"${title}" has been saved.`,
      });
    } catch (error: unknown) {
      toast.error("Save failed", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const codeId =
        savedCodeId ||
        (
          await saveCode({
            title: languageDetails[language].fileName,
            language,
            code,
            stdin: lastStdin,
            stdout: output?.output,
            stderr: output?.error,
            status: output?.status,
          })
        ).data.data.snippet._id;

      setSavedCodeId(codeId);
      const response = await shareCode(codeId);
      const sharedLink = getPublicShareUrl(response.data.data, codeId);

      setShareUrl(sharedLink);
      setIsShareLinkCopied(false);
      setIsShareDialogOpen(true);
    } catch (error: unknown) {
      toast.error("Share failed", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsShareLinkCopied(true);
    } catch (error: unknown) {
      toast.error("Copy failed", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await workspaceRef.current?.requestFullscreen();
      }
    } catch (error: unknown) {
      toast.error("Fullscreen failed", {
        description: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === workspaceRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const username = user?.username || "User";
  const activeLanguage = languageDetails[language];

  return (
    <div
      ref={workspaceRef}
      className="min-h-screen overflow-hidden bg-[#020813] text-white"
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,60,98,0.16),transparent_38%),linear-gradient(180deg,#020813_0%,#020711_48%,#040b16_100%)]" />
      <div className="relative flex h-screen flex-col px-5 py-3">
        <header className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="CodeNova"
              width={40}
              height={40}
              preload
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold leading-none tracking-normal">
                Code<span className="text-[#824cff]">Nova</span>
              </h1>
              <p className="mt-1 text-sm text-[#a9afc2]">
                Code. Compile. Conquer.
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-[#0b192a]"
                aria-label="Open profile menu"
              >
                <UserAvatar
                  username={username}
                  avatar={user?.avatar}
                  className="h-10 w-10"
                  fallbackClassName="text-base"
                />
                <span className="text-lg font-medium">{username}</span>
                <ChevronDown className="h-4 w-4 text-[#8995ad]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-44 border border-[#223550] bg-[#07111e] p-1 text-white"
            >
              <DropdownMenuItem
                className="h-9 cursor-pointer gap-2 text-sm focus:bg-[#0b192a] focus:text-white"
                onSelect={() => router.push("/profile")}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                className="h-9 cursor-pointer gap-2 text-sm focus:bg-[#0b192a] focus:text-white"
                onSelect={() => router.push("/dashboard")}
              >
                <Code2 className="h-4 w-4" />
                Editor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <section className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#203149] bg-[#06101c]/68 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-9 w-[190px] rounded-lg border-[#223550] bg-[#07111e]/80 px-3 text-sm text-white shadow-none">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  position="popper"
                  className="z-[60] min-w-[200px] border border-[#223550] bg-[#050d18] p-1 text-white"
                >
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.value}
                      value={lang.value}
                      className="h-9 px-2 pr-9 text-sm text-white focus:bg-[#0b192a] focus:text-white"
                    >
                      <span className="flex w-full items-center gap-3">
                        <Image
                          src={languageDetails[lang.value].iconUrl}
                          alt=""
                          width={24}
                          height={24}
                          unoptimized
                          className="h-6 w-6 shrink-0 object-contain"
                        />
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex h-9 w-36 items-center justify-between rounded-lg border border-[#223550] bg-[#07111e]/80 px-4 text-sm">
                <span>{activeLanguage.fileName}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#784cff]" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isAiPanelOpen ? "secondary" : "outline"}
                      className="h-9 rounded-lg border-[#223550] bg-[#07111e]/80 px-3 text-sm text-white hover:bg-[#0b192a]"
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-[#824cff]" />
                      {isOptimizing ? "Optimizing..." : "AI Optimizer"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Analyze and improve your code with AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <TooltipProvider>
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 rounded-lg border-[#223550] bg-[#07111e]/80 px-3 text-sm text-white hover:bg-[#0b192a]"
                      onClick={openSaveDialog}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save Snippet</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 rounded-lg border-[#223550] bg-[#07111e]/80 px-3 text-sm text-white hover:bg-[#0b192a]"
                      onClick={handleShare}
                      disabled={isSharing}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {isSharing ? "Sharing..." : "Share"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Code</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-12 rounded-lg border-[#223550] bg-[#07111e]/80 text-white hover:bg-[#0b192a]"
                      onClick={handleFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Expand className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  className="h-9 rounded-lg bg-[#08a64f] px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] hover:bg-[#0abb5d]"
                  onClick={handleRun}
                  disabled={isRunning}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </TooltipProvider>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1.02fr_1fr] gap-4">
            <div className="overflow-hidden rounded-lg border border-[#203149] bg-[#030b15]/78">
              <CodeEditor
                language={language}
                value={code}
                onChange={(c) => setCode(c || "")}
              />
            </div>
            <OutputPanel
              output={output}
              stdin={stdin}
              isRunning={isRunning}
              onStdinChange={setStdin}
              onClear={() => {
                setOutput(null);
                setStdin("");
                setLastStdin("");
              }}
            />
          </div>

          {isAiPanelOpen && (
            <div className="fixed bottom-6 right-6 top-32 z-20 w-[440px] overflow-hidden rounded-lg border border-[#223550] bg-[#050d18] shadow-2xl">
              <AiOptimizerPanel
                result={aiResult}
                onUseCode={setCode}
                onClose={() => setIsAiPanelOpen(false)}
              />
            </div>
          )}

          {isSaveDialogOpen && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 px-4">
              <form
                className="w-full max-w-sm rounded-xl border border-[#223550] bg-[#07111e] p-5 shadow-2xl"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSave();
                }}
              >
                <h2 className="text-lg font-semibold text-white">Save code</h2>
                <label
                  htmlFor="snippet-title"
                  className="mt-4 block text-sm text-[#a9afc2]"
                >
                  Title
                </label>
                <Input
                  id="snippet-title"
                  value={saveTitle}
                  onChange={(event) => setSaveTitle(event.target.value)}
                  className="mt-2 h-10 border-[#223550] bg-[#020813] text-white"
                  autoFocus
                />
                <div className="mt-5 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#223550] bg-transparent text-white hover:bg-[#0b192a]"
                    onClick={() => setIsSaveDialogOpen(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#08a64f] text-white hover:bg-[#0abb5d]"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isShareDialogOpen && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 px-4">
              <div className="relative w-full max-w-md rounded-xl border border-[#223550] bg-[#07111e] p-5 shadow-2xl">
                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-md p-1 text-[#a9afc2] transition hover:bg-[#0b192a] hover:text-white"
                  aria-label="Close share dialog"
                  onClick={() => setIsShareDialogOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="pr-8 text-lg font-semibold text-white">
                  Share code
                </h2>
                <label
                  htmlFor="share-link"
                  className="mt-4 block text-sm text-[#a9afc2]"
                >
                  Link
                </label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="share-link"
                    value={shareUrl}
                    readOnly
                    className="h-10 border-[#223550] bg-[#020813] text-white"
                  />
                  <Button
                    type="button"
                    className="h-10 min-w-24 bg-[#08a64f] px-4 text-white hover:bg-[#0abb5d]"
                    onClick={handleCopyShareLink}
                  >
                    {isShareLinkCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
