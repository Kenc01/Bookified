import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MicOff, Mic } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/book.actions";

interface Props {
  params: Promise<{ slug: string }>;
}

const BookDetailsPage = async ({ params }: Props) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect("/");
  }

  const book = result.data;

  return (
    <div className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[#212a3b]" />
      </Link>

      <div className="vapi-main-container space-y-6">
        {/* Header Card */}
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
                <button className="vapi-mic-btn shadow-soft-md">
                  <MicOff className="size-8 text-[#212a3b]" />
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

        {/* Transcript Area */}
        <div className="transcript-container min-h-[400px]">
          <div className="transcript-empty">
            <div className="bg-[#f3e4c7] p-4 rounded-full mb-4">
              <Mic className="size-12 text-[#212a3b]" />
            </div>
            <h3 className="transcript-empty-text">No conversation yet</h3>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
