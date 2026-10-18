
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Send, LoaderCircle } from "lucide-react";

export default function FeedbackPage() {
  const [helpfulness, setHelpfulness] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [goal, setGoal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setSaveError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          helpfulness,
          accuracy,
          goal: goal.trim(),
          feedback: feedback.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Couldn't save your feedback.");
      }

      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSaveError(
        error.message ||
          "Couldn't connect to the feedback service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const questionGroups = [
    {
      id: "helpfulness",
      title: "1. Was this analysis useful?",
      value: helpfulness,
      setValue: setHelpfulness,
      options: [
        "Very useful",
        "Somewhat useful",
        "Not very useful",
        "Not useful yet",
      ],
    },
    {
      id: "accuracy",
      title: "2. How accurate did the analysis feel?",
      value: accuracy,
      setValue: setAccuracy,
      options: [
        "Very accurate",
        "Mostly accurate",
        "Some parts felt wrong",
        "Not sure",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f7ff] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/results/next-steps"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-900"
        >
          <ArrowLeft size={17} />
          Back to your action plan
        </Link>

        <section className="mt-8 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
            <Heart size={26} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-violet-700">
            One last thing
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#19172e] sm:text-4xl">
            How did we do?
          </h1>

          <p className="mt-4 text-base leading-8 text-gray-600">
            Your resume tells part of your story. We’d love to know whether
            this analysis helped you see it more clearly. Your honest feedback
            helps us build a more thoughtful experience for developers like you.
          </p>

          {saved ? (
            <div className="mt-8 rounded-2xl bg-violet-50 p-6">
              <h2 className="text-xl font-semibold text-[#19172e]">
                Thank you for sharing.
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600">
                Your feedback has been saved successfully. Thank you for helping
                us make NextProof a little better, one thoughtful response at a time.
              </p>

              <Link
                href="/analyze"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800"
              >
                Analyze another resume
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              {questionGroups.map((question) => (
                <fieldset key={question.id}>
                  <legend className="text-base font-semibold text-[#19172e]">
                    {question.title}
                  </legend>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                          question.value === option
                            ? "border-violet-500 bg-violet-50 text-violet-900"
                            : "border-gray-200 hover:border-violet-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={question.value === option}
                          onChange={(event) =>
                            question.setValue(event.target.value)
                          }
                          required
                          className="accent-violet-700"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <div>
                <label
                  htmlFor="career-goal"
                  className="text-base font-semibold text-[#19172e]"
                >
                  3. What are you working toward?
                </label>

                <textarea
                  id="career-goal"
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Landing an internship, switching roles, improving my projects..."
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-4 text-base leading-7 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Optional. Share only what you’re comfortable sharing.
                </p>
              </div>

              <div>
                <label
                  htmlFor="product-feedback"
                  className="text-base font-semibold text-[#19172e]"
                >
                  4. What should we improve?
                </label>

                <textarea
                  id="product-feedback"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  rows={4}
                  maxLength={2000}
                  placeholder="What felt genuinely helpful? What was missing, confusing, or inaccurate?"
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white p-4 text-base leading-7 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {saveError && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {saveError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-4 text-base font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Saving your feedback...
                  </>
                ) : (
                  <>
                    Share my feedback
                    <Send size={17} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-6 text-gray-500">
                Your thoughts help us make NextProof better. Thank you for being
                part of the journey.
              </p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
