"use client";

import { useState } from "react";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import { Mic, MicOff, Send } from "lucide-react";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const [textMessage, setTextMessage] = useState("");
  const {
    status,
    isActive,
    messages,
    currentAssistantMessage,
    currentUserMessage,
    currentMessages,
    duration,
    start,
    stop,
    sendMessage,
    clearError,
    //limitError,
    //isBillingError,
    //maxDurationSeconds,
  } = useVapi(book);

  const handleSendMessage = () => {
    if (textMessage.trim()) {
      sendMessage(textMessage);
      setTextMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <>
      <div className="vapi-header-card w-full">
        <div className="vapi-card-layout w-full">
          {/* Left: Book Cover & Mic Button */}
          <div className="vapi-cover-wrapper">
            <Image
              src={book.coverURL || "/assets/book-cover.svg"}
              alt={book.title}
              width={162}
              height={240}
              className="vapi-cover-image"
            />
            <div className="vapi-mic-wrapper">
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
              >
                {isActive ? (
                  <MicOff className="size-7 text-[#212a3b]" />
                ) : (
                  <Mic className="size-7 text-[#212a3b]" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="flex flex-col justify-center flex-1">
            <h1 className="book-title-lg">{book.title}</h1>
            <p className="subtitle mb-6">by {book.author}</p>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
              </div>

              <div className="vapi-badge-ai">
                <span className="vapi-badge-ai-text">
                  Voice: {book.persona || "Default"}
                </span>
              </div>

              <div className="vapi-badge-ai">
                <span className="vapi-badge-ai-text">0:00/15:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessages={currentMessages}
          currentAssistantMessage={currentAssistantMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>

      {/* Text Message Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isActive}
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#212a3b]"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isActive || !textMessage.trim()}
          className="px-6 py-3 bg-[#212a3b] text-white rounded-lg hover:bg-[#3d485e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          Send
        </button>
      </div>
    </>
  );
};

export default VapiControls;
