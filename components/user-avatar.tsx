"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  username?: string | null;
  avatar?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const getInitials = (username?: string | null) => {
  const value = username?.trim();

  if (!value) {
    return "U";
  }

  return value.charAt(0).toUpperCase();
};

export default function UserAvatar({
  username,
  avatar,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(
        "border border-[#718098] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
        className,
      )}
    >
      {avatar && <AvatarImage src={avatar} alt={username || "User avatar"} />}
      <AvatarFallback
        className={cn(
          "bg-gradient-to-b from-[#d8dee8] to-[#a6afbe] font-bold text-[#111827]",
          fallbackClassName,
        )}
      >
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  );
}
