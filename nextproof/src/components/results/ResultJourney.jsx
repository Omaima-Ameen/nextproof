
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  MessageCircleHeart,
} from "lucide-react";

const steps = [
  {
    label: "Assessment",
    href: "/results",
    eyebrow: "CHAPTER 01",
    title: "The bigger picture.",
  },
  {
    label: "Strengths",
    href: "/results/strengths",
    eyebrow: "CHAPTER 02",
    title: "What makes you stand out.",
  },
  {
    label: "Gaps",
    href: "/results/gaps",
    eyebrow: "CHAPTER 03",
    title: "What deserves a closer look.",
  },
  {
    label: "Next steps",
    href: "/results/next-steps",
    eyebrow: "CHAPTER 04",
    title: "Your next move starts here.",
  },
  {
    label: "Feedback",
    href: "/feedback",
    eyebrow: "FINAL CHAPTER",
    title: "Help us make NextProof better.",
  },
];

function getText(item, fields) {
  if (typeof item === "string") return item;

  if (!item || typeof item !== "object") return "";

  for (const field of fields) {
    if (typeof item[field] === "string" && item[field].trim()) {
      return item[field].trim();
    }
  }

  return "";
}


function DetailList({
  items,
  emptyMessage,
  titleFields = [],
  detailFields = [],
  actionFields = [],
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-7 sm:p-9">
        <p className="text-base leading-7 text-gray-600">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        // Plain strings must be rendered ONCE.
        // Never reuse the same string as a title, detail and action.
        if (typeof item === "string") {
          return (
            <article
              key={`${index}-${item}`}
              className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-700">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="min-w-0 flex-1 whitespace-pre-line text-base leading-8 text-gray-700 sm:text-lg">
                  {item}
                </p>
              </div>
            </article>
          );
        }

        if (!item || typeof item !== "object" || Array.isArray(item)) {
          return null;
        }

        const title = getText(item, titleFields);
        const detail = getText(item, detailFields);
        const action = getText(item, actionFields);

        // Prevent duplicate fields from being displayed twice.
        const normalize = (value) =>
          value.trim().replace(/\s+/g, " ").toLowerCase();

        const distinctDetail =
          detail && normalize(detail) !== normalize(title)
            ? detail
            : "";

        const distinctAction =
          action &&
          normalize(action) !== normalize(title) &&
          normalize(action) !== normalize(distinctDetail)
            ? action
            : "";

        // If there is no separate title, show the available explanation
        // as the main content instead of inventing a heading.
        const mainText = title || distinctDetail || distinctAction;

        return (
          <article
            key={`${index}-${title || distinctDetail || "finding"}`}
            className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-700">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                {mainText && (
                  <p
                    className={
                      title
                        ? "text-lg font-semibold leading-8 text-[#19172e] sm:text-xl"
                        : "whitespace-pre-line text-base leading-8 text-gray-700 sm:text-lg"
                    }
                  >
                    {mainText}
                  </p>
                )}

                {distinctDetail &&
                  normalize(distinctDetail) !== normalize(mainText) && (
                    <p className="mt-3 whitespace-pre-line text-base leading-8 text-gray-600">
                      {distinctDetail}
                    </p>
                  )}

                {distinctAction && (
                  <div className="mt-5 rounded-xl bg-violet-50 p-5">
                    <p className="text-sm font-semibold text-violet-800">
                      What you can do
                    </p>
                    <p className="mt-2 text-base leading-7 text-gray-700">
                      {distinctAction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}


function PageContent({ activeStep, analysis }) {
 
  if (activeStep === 0) {
    const discoveries = [
      {
        number: "01",
        eyebrow: "THE GOOD STUFF",
        title: "Your strengths",
        description:
          "Explore the projects, skills and experience that connect with this role.",
        href: "/results/strengths",
        action: "Discover your strengths",
        icon: Sparkles,
        iconStyle: "bg-violet-100 text-violet-700",
        hoverStyle: "hover:border-violet-300 hover:shadow-violet-100/80",
        numberStyle: "bg-violet-100 text-violet-700",
      },
      {
        number: "02",
        eyebrow: "LET'S GET REAL",
        title: "The missing pieces",
        description:
          "Understand what's missing from your resume versus what might need more practice.",
        href: "/results/gaps",
        action: "Explore the gaps",
        icon: Search,
        iconStyle: "bg-amber-100 text-amber-700",
        hoverStyle: "hover:border-amber-200 hover:shadow-amber-100/80",
        numberStyle: "bg-amber-100 text-amber-800",
      },
      {
        number: "03",
        eyebrow: "YOUR NEXT MOVE",
        title: "A plan that moves you forward",
        description:
          "Turn the findings into practical actions you can take, one step at a time.",
        href: "/results/next-steps",
        action: "Build your action plan",
        icon: TrendingUp,
        iconStyle: "bg-emerald-100 text-emerald-700",
        hoverStyle: "hover:border-emerald-200 hover:shadow-emerald-100/80",
        numberStyle: "bg-emerald-100 text-emerald-800",
      },
    ];

    return (
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-[32px] border border-white bg-white/85 p-6 shadow-[0_25px_80px_-45px_rgba(109,40,217,0.35)] backdrop-blur-xl sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-200/45 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-pink-200/35 blur-3xl"
          />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <Sparkles size={14} />
                YOUR PERSONAL CAREER BREAKDOWN
              </span>
              <span className="text-xl" aria-hidden="true">✦</span>
            </div>

            <h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#211a3c] sm:text-4xl">
              Your experience,
              <span className="block bg-gradient-to-r from-violet-700 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                seen from a new angle.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-8 text-gray-700 sm:text-lg sm:leading-9">
              {analysis.summary || "No summary was provided."}
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/80 p-4">
              <span className="mt-0.5 text-lg" aria-hidden="true">💜</span>
              <p className="text-sm leading-7 text-gray-600">
                This isn't a verdict on your potential. It's a way to
                understand what your resume demonstrates today and where
                you could strengthen your story.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
              YOUR JOURNEY STARTS HERE
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#211a3c] sm:text-3xl">
              Ready to dig a little deeper?
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
              There are three things worth exploring. Pick one, or follow
              the journey from strengths to your next move.
            </p>
          </div>

          <div className="grid gap-4">
            {discoveries.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.number}
                  href={item.href}
                  className={`group relative block overflow-hidden rounded-3xl border border-white bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:p-7 ${item.hoverStyle}`}
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition duration-300 group-hover:rotate-3 group-hover:scale-105 sm:h-14 sm:w-14 ${item.numberStyle}`}
                    >
                      {item.number}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold tracking-[0.16em] text-violet-600">
                        {item.eyebrow}
                      </p>

                      <h3 className="mt-2 text-lg font-bold leading-7 text-[#211a3c] transition-colors group-hover:text-violet-800 sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-base">
                        {item.description}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
                        {item.action}
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1.5"
                        />
                      </span>
                    </div>

                    <span
                      className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 sm:flex ${item.iconStyle}`}
                    >
                      <Icon size={21} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-pink-100 bg-gradient-to-r from-white/90 to-pink-50/80 p-5">
            <span className="text-xl" aria-hidden="true">🌱</span>
            <div>
              <p className="font-semibold text-[#211a3c]">
                Small improvements count.
              </p>
              <p className="mt-1 text-sm leading-7 text-gray-600">
                You don't need to fix everything at once. Start with
                what matters most for the role you're exploring.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }


  if (activeStep === 1) {
    return (
      <DetailList
        items={analysis.strengths}
        emptyMessage="No clear strengths were identified from the supplied information. You can add more project or experience details to help make your evidence clearer."
        titleFields={["requirement", "skill", "title"]}
        detailFields={["evidence", "reason", "description", "text"]}
      />
    );
  }

  if (activeStep === 2) {
    return (
      <div className="space-y-10">
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Search size={21} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#19172e]">
                Missing resume evidence
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                These requirements aren&apos;t clearly demonstrated in your
                resume. That doesn&apos;t mean you lack the skills.
              </p>
            </div>
          </div>

          <DetailList
            items={analysis.missingEvidence}
            emptyMessage="No major missing evidence was identified."
            titleFields={["requirement", "skill", "title"]}
            detailFields={["evidence", "reason", "description", "text"]}
            actionFields={["nextAction", "action"]}
          />
        </section>

        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <Target size={21} />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-[#19172e]">
                Potential skill gaps
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Areas worth investigating, not confirmed weaknesses.
              </p>
            </div>
          </div>

          <DetailList
            items={analysis.potentialGaps}
            emptyMessage="No potential skill gaps were identified."
            titleFields={["skill", "requirement", "title"]}
            detailFields={["reason", "evidence", "description", "text"]}
            actionFields={["nextAction", "action"]}
          />
        </section>
      </div>
    );
  }

  if (activeStep === 3) {
    return (
      <DetailList
        items={analysis.nextSteps}
        emptyMessage="Review the role requirements and consider adding truthful, specific evidence of relevant projects and experience to your resume."
        titleFields={["action", "title", "requirement"]}
        detailFields={["description", "reason", "text"]}
        actionFields={["nextAction"]}
      />
    );
  }

  return null;
}

export default function ResultJourney({ activeStep }) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("nextproof-analysis");

      if (!saved) {
        router.replace("/analyze");
        return;
      }

      const parsed = JSON.parse(saved);

      if (!parsed?.analysis) {
        sessionStorage.removeItem("nextproof-analysis");
        router.replace("/analyze");
        return;
      }

      setResult(parsed);
    } catch {
      sessionStorage.removeItem("nextproof-analysis");
      router.replace("/analyze");
    } finally {
      setChecked(true);
    }
  }, [router]);

  if (!checked || !result?.analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7ff] px-6">
        <p className="text-base text-gray-600">
          Preparing your NextProof journey...
        </p>
      </main>
    );
  }

  const analysis = result.analysis;
  const step = steps[activeStep];
  const previous = steps[activeStep - 1];
  const next = steps[activeStep + 1];

  return (
   <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-[#faf8ff] via-[#f4efff] to-[#fff1f7] px-5 pb-16 pt-7 sm:px-8">
    {/* decorative elements */}
    <div
  aria-hidden="true"
  className="pointer-events-none absolute -right-24 top-20 -z-10 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl"
/>
<div
  aria-hidden="true"
  className="pointer-events-none absolute -bottom-20 -left-24 -z-10 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl"
/>
 {/* decorative elements */}
      <header className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 hover:text-violet-900"
          >
            <ArrowLeft size={17} />
            New analysis
          </Link>

          <span className="text-sm font-medium text-gray-500">
            {activeStep + 1} of {steps.length}
          </span>
        </div>

        <div
          className="mt-5 h-1.5 overflow-hidden rounded-full bg-violet-100"
          aria-label={`Step ${activeStep + 1} of ${steps.length}`}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={activeStep + 1}
        >
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{
              width: `${((activeStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <nav
          aria-label="Analysis chapters"
          className="mt-5 flex gap-2 overflow-x-auto pb-2"
        >
          {steps.slice(0, 4).map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={index === activeStep ? "step" : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition ${
                index === activeStep
                  ? "bg-violet-700 text-white"
                  : index < activeStep
                    ? "bg-violet-100 text-violet-800"
                    : "bg-white text-gray-500 hover:bg-violet-50"
              }`}
            >
              {index < activeStep ? "✓ " : ""}
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-violet-700">
            {step.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#19172e] sm:text-5xl">
            {step.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            {activeStep === 0 &&
              "Let's understand how your experience connects with this opportunity."}
            {activeStep === 1 &&
              "Explore the evidence in your experience that may be relevant to this role."}
            {activeStep === 2 &&
              "Let's separate what your resume doesn't show from what might genuinely need work."}
            {activeStep === 3 &&
              "Turn what we discovered into practical actions you can take."}
          </p>
        </div>

        <PageContent activeStep={activeStep} analysis={analysis} />

        <footer className="mt-10 flex flex-col gap-3 border-t border-violet-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {previous ? (
            <Link
              href={previous.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-medium text-violet-800 hover:bg-violet-50"
            >
              <ArrowLeft size={17} />
              {previous.label}
            </Link>
          ) : (
            <span className="text-sm text-gray-500">
              One step at a time.
            </span>
          )}

          {next && (
            <Link
              href={next.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-800"
            >
              {activeStep === 0 && "Discover your strengths"}
              {activeStep === 1 && "Explore the gaps"}
              {activeStep === 2 && "Build your action plan"}
              {activeStep === 3 && "Share your experience"}
              <ArrowRight size={17} />
            </Link>
          )}
        </footer>

        {activeStep === 3 && (
          <p className="mt-6 text-xs leading-6 text-gray-500">
            NextProof offers AI-assisted guidance based on the information
            provided. Verify suggestions against your actual experience.
          </p>
        )}
      </div>
    </main>
  );
}
