"use client";

import { useState,useEffect  } from "react";
import { ArrowRight } from "lucide-react";
import ResumeUpload from "./ResumeUpload";
import JobDescriptionInput from "./JobDescriptionInput";
import { useRouter } from "next/navigation";
import { saveAnalyzeDraft, loadAnalyzeDraft, clearAnalyzeDraft } from "@/lib/analyzerDrafts";

export default function AnalyzeForm() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobFile, setJobFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const router = useRouter();

  useEffect(() => {
    loadAnalyzeDraft()
      .then((draft) => {
        if (!draft) return;

        setResume(draft.resume);
        setJobFile(draft.jobFile);
        setJobDescription(draft.jobDescription || "");
      })
      .catch(() => {
        // Keep the analyzer usable if draft restoration fails.
      });
  }, []);
  async function handleAnalyze() {
    if (!resume) {
      router.push("/error?type=input");
      return;
    }

    if (!jobDescription.trim() && !jobFile) {
      router.push("/error?type=input");
      return;
    }
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      await saveAnalyzeDraft({
        resume,
        jobDescription,
        jobFile,
      });
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      if (jobFile) {
        formData.append("jobFile", jobFile);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        await saveAnalyzeDraft({
          resume,
          jobDescription,
          jobFile,

        });

        let type = "server";

        if ([400, 413, 415, 422].includes(response.status)) {
          type =
            response.status === 415 || response.status === 413
              ? "file"
              : "input";
        } else if ([502, 503, 504].includes(response.status)) {
          type = "ai";
        }

        router.push(`/error?type=${type}`);
        return;
      }
      if (!data.analysis) {
  router.push("/error?type=ai");
  return;
}

sessionStorage.setItem(
  "nextproof-analysis",
  JSON.stringify(data)
);

await clearAnalyzeDraft();

router.push("/results");
    } 
    


    catch (err) {
      let type = "server";

      if (err instanceof TypeError) {
        type = "server";
      } else if (err.message === "The response did not contain an analysis.") {
        type = "ai";
      }

      router.push(`/error?type=${type}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section
        id="get-started"
        className="mx-auto max-w-5xl scroll-mt-8 px-6 pb-20 pt-4"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="pt-2 lg:pt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">
              Your next step starts here
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Let&apos;s make your
              <br className="hidden lg:block" /> next move clearer.
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-gray-600">
              Bring the role you&apos;re aiming for and the experience
              you&apos;ve built so far. We&apos;ll help you see the connection.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm text-violet-700">
                  01
                </span>

                <div>
                  <p className="font-medium">See what you can prove</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Connect role requirements to your actual experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm text-blue-700">
                  02
                </span>

                <div>
                  <p className="font-medium">Know what to do next</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Focus on useful next steps, not every technology on the
                    internet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-[0_15px_60px_-30px_rgba(87,65,155,0.25)] sm:p-8">
            <h3 className="text-xl font-semibold">Start with two things.</h3>

            <p className="mt-2 text-sm text-gray-500">
              Add your resume and the job description.
            </p>

            <ResumeUpload resume={resume} onResumeChange={setResume} />

            <JobDescriptionInput
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              jobFile={jobFile}
              onJobFileChange={setJobFile}
            />

            <button
              type="button"
              disabled={
                isLoading || !resume || (!jobDescription.trim() && !jobFile)
              }
              onClick={handleAnalyze}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">◌</span>
                  Analyzing your experience...
                </>
              ) : (
                <>
                  Analyze my fit <ArrowRight size={18} />
                </>
              )}
            </button>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Missing evidence doesn&apos;t automatically mean missing skills.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
