

import { NextApiRequest, NextApiResponse } from "next";

const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const event = req.body;

  // When the call starts → trigger workflow
  if (event.event === "call.started") {
    await fetch(`https://api.vapi.ai/v1/workflows/${workflowId}/execute`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: event.call.userId,
        callId: event.call.id,
      })
    });
  }

  // When your workflow API step calls back → handle it
  if (event.event === "tool.called") {
    if (event.tool.name === "apiRequest") {
      const extracted = event.tool.input;

      // Send to Gemini
      const geminiResponse = await fetch("YOUR_GEMINI_ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extracted)
      }).then(r => r.json());

      // Save to Firebase
      await saveToFirebase({
        ...extracted,
        result: geminiResponse
      });
    }
  }

  return res.status(200).json({ ok: true });
}

async function saveToFirebase(data: any) {
  // your Firebase logic here
}
