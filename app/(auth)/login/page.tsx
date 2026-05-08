"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { googleLogin, login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof formSchema>;

const GOOGLE_BUTTON_MAX_WIDTH = 320;
const GOOGLE_BUTTON_MIN_WIDTH = 240;

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleButtonConfig {
  type: "standard" | "icon";
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  text: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape: "pill" | "rectangular" | "circle" | "square";
  logo_alignment: "left" | "center";
  width: number;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonConfig,
          ) => void;
        };
      };
    };
  }
}

const getErrorMessage = (error: unknown) => {
  const apiError = error as { response?: { data?: { message?: string } } };

  return apiError.response?.data?.message || "Invalid credentials";
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0);
  const [isGoogleButtonRendered, setIsGoogleButtonRendered] = useState(false);
  const googleButtonWrapperRef = useRef<HTMLDivElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const authLogin = useAuthStore((state) => state.login);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await login(data);
      authLogin(response.data.data.user);
      toast.success("Login successful", {
        description: "Welcome back!",
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error("Login failed", {
        description: getErrorMessage(error),
        duration: 3000,
      });
    }
  };

  const handleGoogleCredential = useCallback(
    async (credentialResponse: GoogleCredentialResponse) => {
      if (!credentialResponse.credential) {
        toast.error("Google login failed", {
          description: "Google did not return an ID token.",
        });
        return;
      }

      setIsGoogleLoading(true);
      try {
        const response = await googleLogin({
          idToken: credentialResponse.credential,
        });

        authLogin(response.data.data.user);
        toast.success("Google login successful", {
          description: "Welcome back!",
        });
        router.push("/dashboard");
      } catch (error: unknown) {
        toast.error("Google login failed", {
          description: getErrorMessage(error),
          duration: 3000,
        });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [authLogin, router],
  );

  const renderGoogleButton = useCallback(() => {
    if (
      !googleClientId ||
      !window.google ||
      !googleButtonRef.current ||
      !googleButtonWidth
    ) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    });

    googleButtonRef.current.innerHTML = "";
    setIsGoogleButtonRendered(false);
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: googleButtonWidth,
    });

    const confirmGoogleButtonRendered = (attempt = 0) => {
      const hasGoogleIframe = Boolean(
        googleButtonRef.current?.querySelector("iframe"),
      );

      setIsGoogleButtonRendered(hasGoogleIframe);

      if (!hasGoogleIframe && attempt < 10) {
        window.setTimeout(
          () => confirmGoogleButtonRendered(attempt + 1),
          100,
        );
      }
    };

    confirmGoogleButtonRendered();
  }, [googleButtonWidth, googleClientId, handleGoogleCredential]);

  useEffect(() => {
    const googleButtonElement = googleButtonWrapperRef.current;

    if (!googleButtonElement) {
      return;
    }

    const updateGoogleButtonWidth = () => {
      const availableWidth = googleButtonElement.clientWidth;

      if (!availableWidth) {
        return;
      }

      setGoogleButtonWidth(
        Math.max(
          GOOGLE_BUTTON_MIN_WIDTH,
          Math.min(GOOGLE_BUTTON_MAX_WIDTH, Math.floor(availableWidth - 24)),
        ),
      );
    };

    updateGoogleButtonWidth();

    const resizeObserver = new ResizeObserver(updateGoogleButtonWidth);
    resizeObserver.observe(googleButtonElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  return (
    <div className="w-full max-w-[27rem]">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={renderGoogleButton}
        onError={() => {
          toast.error("Google login unavailable", {
            description: "Could not load Google sign-in.",
          });
        }}
      />
      <div className="mb-7 flex items-center gap-3.5">
        <Image
          src="/logo.png"
          alt="CodeNova logo"
          width={58}
          height={58}
          priority
          className="h-14 w-14 object-contain"
        />
        <div>
          <h1 className="text-[2rem] font-bold leading-none tracking-tight text-white">
            Code<span className="text-primary">Nova</span>
          </h1>
          <p className="mt-2 text-base leading-none text-muted-foreground">
            Code. Compile. Conquer.
          </p>
        </div>
      </div>

      <h2 className="mb-1.5 text-xl font-bold tracking-tight text-white">
        Welcome Back
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Login to continue coding and building
      </p>

      <div className="mb-5">
        {googleClientId ? (
          <>
            <div
              ref={googleButtonWrapperRef}
              className="relative flex min-h-11 w-full justify-center"
            >
              {!isGoogleButtonRendered && (
                <button
                  type="button"
                  className="flex h-11 w-full max-w-80 items-center justify-center gap-3 rounded bg-slate-50 px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-white"
                  onClick={() => {
                    toast.error("Google login unavailable", {
                      description:
                        "Google sign-in is still loading. Please refresh or try again.",
                    });
                  }}
                >
                  <GoogleIcon className="h-5 w-5 shrink-0" />
                  <span>Continue with Google</span>
                </button>
              )}
              <div
                ref={googleButtonRef}
                className="google-login-button absolute inset-y-0 flex min-h-11 items-center justify-center overflow-hidden rounded"
                style={{
                  width: googleButtonWidth
                    ? `${googleButtonWidth}px`
                    : `${GOOGLE_BUTTON_MIN_WIDTH}px`,
                  opacity: isGoogleButtonRendered ? 1 : 0,
                  pointerEvents: isGoogleButtonRendered ? "auto" : "none",
                }}
              />
            </div>
            {isGoogleLoading && (
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Signing in with Google...
              </p>
            )}
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-slate-700/90 bg-slate-900/30 text-sm text-slate-100"
            disabled
          >
            Google Client ID missing
          </Button>
        )}
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-slate-950 px-6 text-muted-foreground">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="h-11 rounded-xl border-slate-700/90 bg-slate-900/20 pl-12 text-sm text-white placeholder:text-muted-foreground"
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="h-11 rounded-xl border-slate-700/90 bg-slate-900/20 pl-12 pr-12 text-sm text-white placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 hover:from-violet-500 hover:to-violet-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    {...props}
    className="mb-2 block text-sm font-semibold leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  />
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
    />
  </svg>
);
