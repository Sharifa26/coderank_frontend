"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronDown,
  Code2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Trash2,
  LogOut,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languageDetails, SupportedLanguage } from "@/lib/default-code";
import { deleteCode, getHistory } from "@/services/code.service";
import { useAuthStore } from "@/store/auth.store";
import { ICodeSnippet } from "@/types";
import { toast } from "sonner";
import UserAvatar from "@/components/user-avatar";

const languageLabels: Record<string, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  c: "C",
  cpp: "C++",
};

const getLanguageIcon = (language: string) =>
  language in languageDetails
    ? languageDetails[language as SupportedLanguage].iconUrl
    : null;

const PAGE_SIZE = 5;

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [snippets, setSnippets] = useState<ICodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setSnippets(response.data.data.snippets);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const username = user?.username || "Sharifa";
  const email = user?.email || "sharifa@example.com";
  const totalPages = Math.max(1, Math.ceil(snippets.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (visiblePage - 1) * PAGE_SIZE;
  const paginatedSnippets = snippets.slice(
    pageStartIndex,
    pageStartIndex + PAGE_SIZE,
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = async (snippetId: string) => {
    setDeletingId(snippetId);

    try {
      const response = await deleteCode(snippetId);
      const nextSnippets = snippets.filter((item) => item._id !== snippetId);
      const nextTotalPages = Math.max(
        1,
        Math.ceil(nextSnippets.length / PAGE_SIZE),
      );

      setSnippets(nextSnippets);
      setCurrentPage((page) => Math.min(page, nextTotalPages));
      toast.success("Code deleted", {
        description: response.data.message,
      });
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };

      toast.error("Delete failed", {
        description:
          apiError.response?.data?.message || "Unable to delete this snippet.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#020813] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_68%_26%,rgba(35,82,124,0.16),transparent_34%),linear-gradient(180deg,#020813_0%,#020711_48%,#040b16_100%)]" />
      <div className="relative flex h-screen flex-col px-5 py-3">
        <header className="flex items-center justify-between pb-3">
          <button
            type="button"
            className="flex items-center gap-2.5 text-left"
            onClick={() => router.push("/dashboard")}
          >
            <Image
              src="/logo.png"
              alt="CodeNova"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <div>
              <h1 className="text-2xl font-bold leading-none tracking-normal">
                Code<span className="text-[#824cff]">Nova</span>
              </h1>
              <p className="mt-1 text-sm text-[#a9afc2]">
                Code. Compile. Conquer.
              </p>
            </div>
          </button>

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

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="flex min-h-0 flex-col rounded-lg border border-[#203149] bg-[#06101c]/68 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="relative">
                <UserAvatar
                  username={username}
                  avatar={user?.avatar}
                  className="h-36 w-36 border-2 border-[#7149ff]"
                  fallbackClassName="text-5xl"
                />
              </div>
              <h2 className="mt-5 text-2xl font-bold">{username}</h2>
              <p className="mt-3 text-base text-[#c5ccda]">{email}</p>
            </div>

            <Button
              variant="outline"
              className="h-12 w-full border-red-500/30 bg-red-950/10 text-base font-semibold text-[#ff695f] hover:bg-red-950/30 hover:text-[#ff7c74]"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </aside>

          <main className="flex min-h-0 flex-col rounded-lg border border-[#203149] bg-[#06101c]/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4d32bc] text-white shadow-[0_12px_32px_rgba(76,50,188,0.35)]">
                <Save className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Saved Codes</h2>
                <p className="mt-0.5 text-sm text-[#b6bfd0]">
                  All your saved code snippets
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-lg border border-[#203149] bg-[#07111e]/60 p-8 text-center text-[#b6bfd0]">
                Loading saved codes...
              </div>
            ) : snippets.length === 0 ? (
              <div className="rounded-lg border border-[#203149] bg-[#07111e]/60 p-8 text-center text-[#b6bfd0]">
                You haven&apos;t saved any code snippets yet.
              </div>
            ) : (
              <>
                <div className="grid min-h-0 flex-1 grid-rows-5 gap-2 overflow-hidden">
                  {paginatedSnippets.map((snippet) => {
                    const icon = getLanguageIcon(snippet.language);
                    const languageName =
                      languageLabels[snippet.language] || snippet.language;

                    return (
                      <article
                        key={snippet._id}
                        className="grid min-h-0 grid-cols-1 items-center gap-2 rounded-lg border border-[#1d3045] bg-[#07111e]/58 px-4 py-2 xl:grid-cols-[52px_1fr_auto]"
                      >
                        <div className="flex h-10 w-10 items-center justify-center">
                          {icon ? (
                            <Image
                              src={icon}
                              alt=""
                              width={36}
                              height={36}
                              unoptimized
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <Code2 className="h-8 w-8 text-[#824cff]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {snippet.title}
                          </h3>
                          <p className="mt-1 truncate text-xs text-[#b6bfd0]">
                            {snippet.stdout ||
                              snippet.stderr ||
                              "Saved code snippet"}
                          </p>
                          <Badge className="mt-1 h-5 bg-sky-500/15 text-xs text-sky-300 hover:bg-sky-500/20">
                            {languageName}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:gap-3">
                          <div className="min-w-36 text-left text-xs text-[#b6bfd0] xl:text-right">
                            {format(
                              new Date(snippet.updatedAt),
                              "MMM d, yyyy",
                            )}
                            <span className="px-2 text-[#738098]">&bull;</span>
                            {format(new Date(snippet.updatedAt), "hh:mm a")}
                          </div>
                          <Button
                            className="h-8 min-w-36 bg-[#4d32bc] px-3 text-xs font-semibold text-white hover:bg-[#5c3fde]"
                            onClick={() => router.push("/dashboard")}
                          >
                            <Code2 className="mr-1.5 h-3.5 w-3.5" />
                            Open in Editor
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8 border-red-500/30 bg-red-950/10 px-3 text-xs font-semibold text-[#ff695f] hover:bg-red-950/30 hover:text-[#ff7c74]"
                            onClick={() => handleDelete(snippet._id)}
                            disabled={deletingId === snippet._id}
                            aria-label={`Delete ${snippet.title}`}
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            {deletingId === snippet._id
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#1d3045] pt-3 text-xs text-[#b6bfd0]">
                  <span>
                    Page {visiblePage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="h-8 border-[#223550] bg-[#101b2d] px-3 text-xs text-white hover:bg-[#16243a]"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 border-[#223550] bg-[#101b2d] px-3 text-xs text-white hover:bg-[#16243a]"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1),
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
