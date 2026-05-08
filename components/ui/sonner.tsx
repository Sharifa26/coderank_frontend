"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      expand
      duration={3000}
      offset={{ top: 20 }}
      mobileOffset={{ top: 16, left: 14, right: 14 }}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "#ecfdf5",
          "--success-border": "#a7f3d0",
          "--success-text": "#065f46",
          "--error-bg": "#fff1f2",
          "--error-border": "#fecdd3",
          "--error-text": "#9f1239",
          "--info-bg": "#eef6ff",
          "--info-border": "#bfdbfe",
          "--info-text": "#1e3a8a",
          "--warning-bg": "#fffbeb",
          "--warning-border": "#fde68a",
          "--warning-text": "#92400e",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast !min-h-14 !items-start !gap-3 !rounded-xl !px-4 !py-3 !text-sm !shadow-2xl !shadow-black/30",
          title: "!font-semibold !leading-5",
          description: "!text-[0.82rem] !leading-5 !opacity-90",
          icon: "!mt-0.5",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
