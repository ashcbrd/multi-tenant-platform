"use client";

import { BeatLoader } from "react-spinners";
import { Copy } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
// import { BotAvatar } from "@/components/bot-avatar";
// import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// import { useToast } from "@/components/ui/use-toast";

export interface ChatMessageProps {
  role: "system" | "user";
  content?: string;
  isLoading?: boolean;
  img?: string;
}

export const ChatMessage = ({ role, content, isLoading, img }: any) => {
  const { theme } = useTheme();

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content);
    toast("Message copied to clipboard.");
  };

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-x-3 py-4",
        role === "user" && "justify-end",
      )}
    >
      {/* {role !== "user" && src && <BotAvatar src={src} />} */}
      {role !== "user" && (
        <div className="h-10 w-10 rounded-full bg-blue-500" />
      )}
      <div className="max-w-sm rounded-md bg-primary/10 px-4 py-2 text-sm">
        {isLoading ? (
          <BeatLoader color={theme === "light" ? "black" : "white"} size={5} />
        ) : (
          content
        )}
      </div>
      {role !== "user" && !isLoading && (
        <Button
          onClick={onCopy}
          className="opacity-0 transition group-hover:opacity-100"
          size="icon"
          variant="ghost"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
