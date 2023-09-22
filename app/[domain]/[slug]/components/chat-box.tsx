"use client";

import { ChatForm } from "@/components/chat-form";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessageProps } from "@/components/chat-message";
import { ChatMessages } from "@/components/chat-messages";
import { Info, Message } from "@prisma/client";
import { useCompletion } from "ai/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface ChatBoxProps {
  info: Info & { messages: Message[]; _count: { messages: number } };
}

export const ChatBox = ({ info }: any) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(info.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${info.id}`,
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => {
      if (Array.isArray(current)) {
        return [...current, userMessage];
      } else {
        return [userMessage];
      }
    });

    handleSubmit(e);
  };

  return (
    <div className="flex h-full flex-col space-y-3 p-4">
      <ChatHeader info={info} />
      <ChatMessages info={info} isLoading={isLoading} messages={messages} />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
