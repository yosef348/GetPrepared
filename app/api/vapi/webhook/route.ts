import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Webhook received:", body);

    if (body.type !== "tool-calls") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const { toolName, parameters, toolCallId } = body;

    if (toolName === "startInterviewWorkflow") {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vapi/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parameters),
        }
      );

      const result = await response.json();

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
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook crashed" }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
