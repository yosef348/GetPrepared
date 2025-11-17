import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook received:", body);

    // Vapi always sends { type: "tool-calls" }
    if (body.type !== "tool-calls") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const { toolName, parameters, toolCallId } = body;

    // Handle your tool call
    if (toolName === "startInterviewWorkflow") {
      console.log("Running startInterviewWorkflow with:", parameters);

      // Forward the parameters to your existing API generate handler
      const apiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parameters),
        }
      );

      const result = await apiResponse.json();

      console.log("Result from /generate:", result);

      // Tell Vapi the tool result is ready
      return NextResponse.json(
        {
          toolCallId,
          result,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      {
        error: "Webhook crashed",
        detail: String(error),
      },
      { status: 200 } // ⚠ return 200 so Vapi doesn't retry
    );
  }
}
