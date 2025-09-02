/**
 * Material Identification API Route
 * Following Single Responsibility Principle
 */

import { NextRequest } from "next/server";
import { createController } from "./controller";

export async function POST(req: NextRequest) {
  const controller = createController();
  return controller.handleRequest(req);
}
