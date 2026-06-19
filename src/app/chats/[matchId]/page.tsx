"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams<{ matchId: string }>();
  const { user } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");

  const userRecord = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id ?? "",
  });

  const matchId = params.matchId as Id<"matches">;
  const messages = useQuery(
    api.messages.getMessages,
    matchId ? { matchId } : "skip",
  );
  const sendMessage = useMutation(api.messages.sendMessage);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !userRecord) return;
    const msg = text.trim();
    setText("");
    try {
      await sendMessage({
        matchId,
        senderId: userRecord._id,
        text: msg,
      });
    } catch {
      setText(msg);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-neutral">
      <header className="flex items-center gap-3 border-b border-muted/20 bg-white px-4 py-3">
        <button onClick={() => router.push("/chats")}>
          <span className="text-lg">←</span>
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-base">
          🐾
        </div>
        <span className="font-semibold text-ink">Playdate Chat</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {!messages ? (
          <div className="flex items-center justify-center pt-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <span className="text-4xl">👋</span>
            <p className="mt-3 text-sm text-muted">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => {
              const isMine = msg.senderId === userRecord?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "bg-primary text-white"
                        : "bg-white text-ink"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-0.5 text-[10px] ${
                        isMine ? "text-white/60" : "text-muted"
                      }`}
                    >
                      {new Date(msg._creationTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <footer className="border-t border-muted/20 bg-white px-4 py-3">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            maxLength={1000}
            className="flex-1 rounded-2xl border border-muted/30 bg-neutral px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition-colors disabled:opacity-40"
          >
            <span className="text-lg">➤</span>
          </button>
        </form>
      </footer>
    </div>
  );
}
