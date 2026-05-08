"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signup } from "@/services/auth.service";

const formSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
        "Use uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const getErrorMessage = (error: unknown) => {
  const apiError = error as { response?: { data?: { message?: string } } };

  return apiError.response?.data?.message || "Something went wrong.";
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await signup(data);
      toast.success("Account created", {
        description: "Please log in to continue.",
      });
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Signup failed", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="w-full max-w-[29rem]">
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

      <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">User Name</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              placeholder="Enter your user name"
              {...register("username")}
              className="h-11 rounded-xl border-slate-700/90 bg-slate-900/20 pl-12 text-sm text-white placeholder:text-muted-foreground"
            />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

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

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="h-11 rounded-xl border-slate-700/90 bg-slate-900/20 pl-12 pr-12 text-sm text-white placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 hover:from-violet-500 hover:to-violet-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign In
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
