"use client";

import { ChevronLeft, MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Info, Message } from "@prisma/client";

import { Button } from "@/components/ui/button";

export const ChatHeader = ({
  info,
}: {
  info: Info & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}) => {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between border-b border-primary/10 pb-4">
      <div className="flex items-center gap-x-2">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
        {/* <BotAvatar src={info.image} /> */}
        <div className="h-10 w-10 rounded-full bg-blue-500" />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{info.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="mr-1 h-3 w-3" />
              {info._count?.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{info.description}</p>
        </div>
      </div>
    </div>
  );
};
