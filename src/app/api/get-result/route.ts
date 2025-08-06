// src/app/api/get-result/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // No app router, pegamos os parâmetros da URL da requisição desta forma
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ message: "jobId is required" }, { status: 400 });
  }
  console.log("get-result route called with jobId:", jobId);
  // A lógica de chamar a URL de polling do n8n permanece a mesma
  const pollingUrl = `${process.env.N8N_POLLING_URL}?jobId=${jobId}`;

  try {
    const n8nResponse = await fetch(pollingUrl);

    if (!n8nResponse.ok) {
      console.error(
        "Error from n8n polling endpoint:",
        await n8nResponse.text()
      );
      return NextResponse.json(
        { message: "Failed to fetch from n8n polling endpoint." },
        { status: n8nResponse.status }
      );
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error in get-result:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
