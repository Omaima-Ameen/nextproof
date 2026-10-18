
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  FileWarning,
  RefreshCw,
  ServerCrash,
} from "lucide-react";
import { Suspense } from "react";

const ERROR_MESSAGES = {
  input: {
    title: "A little input check!",
    description:
      "We couldn't use the information provided. Check your resume and job description, then try again.",
    icon: FileWarning,
  },
  file: {
    title: "This file needs a second look.",
    description:
      "Please upload a supported PDF or DOCX resume within the 5 MB size limit.",
    icon: FileWarning,
  },
  ai: {
    title: "Our analysis hit a little snag.",
    description:
      "The AI service couldn't complete your analysis this time. Your inputs are still here, so you can try again.",
    icon: RefreshCw,
  },
  server: {
    title: "Something went wrong on our side.",
    description:
      "We couldn't complete your request. Please try again in a moment.",
    icon: ServerCrash,
  },
};

 function ErrorContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const error = ERROR_MESSAGES[type] || ERROR_MESSAGES.server;
  const ErrorIcon = error.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff] px-6 py-12 text-[#19172e]">
      <section className="w-full max-w-xl rounded-3xl border border-violet-100 bg-white p-7 text-center shadow-[0_15px_60px_-30px_rgba(87,65,155,0.25)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-rose-700">
          <ErrorIcon size={30} />
        </div>

        <p className="mt-6 text-sm font-semibold text-violet-700">
          NEXTProof · LET&apos;S GET YOU BACK
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-red-800 tracking-tight sm:text-4xl">
          {error.title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-red-400">
          {error.description}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            <ArrowLeft size={17} />
            Back to Analyze
          </Link>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 px-6 py-3 text-sm font-medium text-red-700 transition hover:bg-violet-50"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>

        <p className="mt-7 text-xs leading-5 text-gray-400">
          Your experience deserves a fair analysis. Let&apos;s give it another try.
        </p>
      </section>
    </main>
  );

  
}


export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff]">
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        </main>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}