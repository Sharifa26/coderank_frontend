"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth.service";

const formSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const getErrorMessage = (error: unknown) => {
  const apiError = error as { response?: { data?: { message?: string } } };

  return apiError.response?.data?.message || "Unable to reset password";
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      setValue("token", token);
    }
  }, [setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await resetPassword(data);
      toast.success("Password reset successful", {
        description: response.data.message,
      });
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Reset password failed", {
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
        Reset Password
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Enter a new password to finish resetting your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} />
        {errors.token && (
          <p className="rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-sm text-red-300">
            Reset link is missing or invalid. Please use the link from your
            email.
          </p>
        )}

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword")}
              className="h-11 rounded-xl border-slate-700/90 bg-slate-900/20 pl-12 pr-12 text-sm text-white placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 hover:from-violet-500 hover:to-violet-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Back to{" "}
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
