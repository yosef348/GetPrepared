import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      body.type === "function_call" &&
      body.functionCall?.name === "startInterviewWorkflow"
    ) {
      const args = body.functionCall.arguments;

      // Correct workflow execution endpoint
      const vapiRes = await fetch(
        `https://api.vapi.ai/v1/workflows/${process.env.VAPI_WORKFLOW_ID}/execute`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              role: args.role,
              type: args.type,
              level: args.level,
              techstack: args.techstack,
              amount: args.amount,
            },
          }),
        }
      );

      const vapiJson = await vapiRes.json();
      console.log("Vapi workflow execution response:", vapiJson);

      return NextResponse.json({ ok: true, vapiResponse: vapiJson });
    }

    return NextResponse.json({ ok: false, error: "Unknown function call" }, { status: 400 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: false, error: (err as any).message }, { status: 500 });
  }
}
