import { PerplexityController } from "./perplexity.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return PerplexityController.handlePost(req);
}
