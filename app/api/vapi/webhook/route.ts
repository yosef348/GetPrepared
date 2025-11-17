import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Only process tool calls
    if (body.type !== "tool-calls") {
      return NextResponse.json({ ok: true });
    }

    const { toolName, toolCallId, parameters } = body;

    if (toolName === "startInterviewWorkflow") {
      // Call your generate API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parameters),
        }
      );

      const result = await response.json();

      // Return result back to Vapi
      return NextResponse.json({
        toolCallId,
        result,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        toolCallId: "unknown",
        result: { success: false, error: String(err) },
      },
      { status: 200 }
    );
  }
}
