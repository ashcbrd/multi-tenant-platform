"use client";

import { ElementRef, useEffect, useRef, useState } from "react";
import { Info } from "@prisma/client";

import { ChatMessage, ChatMessageProps } from "@/components/chat-message";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  info: Info;
}

export const ChatMessages = ({ messages = [], isLoading, info }: any) => {
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        src={""}
        role="system"
        content={`Hello, this is ${info.name} Bot, here to assist you with any questions in mind. How can I help you today?`}
      />
      {messages.map((message: { content: any; role: any }) => (
        <ChatMessage
          key={message.content}
          content={message.content}
          role={message.role}
        />
      ))}
      {isLoading && <ChatMessage src={""} role="system" isLoading />}
      <div ref={scrollRef} />
    </div>
  );
};
