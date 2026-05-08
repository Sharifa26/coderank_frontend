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

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleButtonConfig {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  text: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape: "pill" | "rectangular" | "circle" | "square";
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
        duration: 5000,
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
          duration: 5000,
        });
      } finally {
        setIsGoogleLoading(false);
      }
    },
    [authLogin, router],
  );

  const renderGoogleButton = useCallback(() => {
    if (!googleClientId || !window.google || !googleButtonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    });

    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
      width: 390,
    });
  }, [googleClientId, handleGoogleCredential]);

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
              ref={googleButtonRef}
              className="flex min-h-11 w-full justify-center overflow-hidden rounded-xl border border-slate-700/90 bg-white"
            />
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
