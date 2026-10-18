
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const helpfulnessOptions = [
  "Very useful",
  "Somewhat useful",
  "Not very useful",
  "Not useful yet",
];

const accuracyOptions = [
  "Very accurate",
  "Mostly accurate",
  "Some parts felt wrong",
  "Not sure",
];

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Feedback API environment variables are missing.");

      return NextResponse.json(
        { error: "Feedback service is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { helpfulness, accuracy, goal = "", feedback = "" } = body;

    if (
      !helpfulnessOptions.includes(helpfulness) ||
      !accuracyOptions.includes(accuracy)
    ) {
      return NextResponse.json(
        { error: "Please select a valid answer for both questions." },
        { status: 400 }
      );
    }

    if (
      typeof goal !== "string" ||
      typeof feedback !== "string" ||
      goal.length > 1000 ||
      feedback.length > 2000
    ) {
      return NextResponse.json(
        { error: "One of your responses is too long or invalid." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error } = await supabase.from("feedback").insert({
      helpfulness,
      accuracy,
      goal: goal.trim(),
      feedback: feedback.trim(),
    });

    if (error) {
      console.error("Supabase feedback insert failed:", error.code);

      return NextResponse.json(
        { error: "We couldn't save your feedback. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Feedback saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "The submitted request is invalid." },
        { status: 400 }
      );
    }

    console.error("Feedback API error:", error.message);

    return NextResponse.json(
      { error: "Something went wrong while saving your feedback." },
      { status: 500 }
    );
  }
}
