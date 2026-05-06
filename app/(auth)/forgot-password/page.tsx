"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/auth.service";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

const getErrorMessage = (error: unknown) => {
  const apiError = error as { response?: { data?: { message?: string } } };

  return apiError.response?.data?.message || "Unable to send reset link";
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await forgotPassword(data);
      toast.success("Reset link sent", {
        description: response.data.message,
      });
    } catch (error: unknown) {
      toast.error("Forgot password failed", {
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="w-full max-w-[27rem]">
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
        Forgot Password
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Enter your email and we&apos;ll send a password reset link.
      </p>

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

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 hover:from-violet-500 hover:to-violet-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
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
