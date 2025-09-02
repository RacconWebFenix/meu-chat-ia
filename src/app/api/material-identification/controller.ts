/**
 * Material Identification Controller
 * Following Single Responsibility Principle
 */

import { NextRequest, NextResponse } from "next/server";
import { EnrichmentRequest } from "./types";
import {
  MaterialIdentificationService,
  IMaterialIdentificationService,
} from "./service";
import { validateEnrichmentRequest } from "./utils";

export class MaterialIdentificationController {
  constructor(private readonly service: IMaterialIdentificationService) {}

  async handleRequest(req: NextRequest): Promise<NextResponse> {
    try {
      const body = (await req.json()) as EnrichmentRequest;

      if (!validateEnrichmentRequest(body)) {
        return NextResponse.json(
          { error: "At least one field must be provided" },
          { status: 400 }
        );
      }

      const result = await this.service.enrichData(body);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Controller error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

// Factory function for dependency injection
export const createController = (): MaterialIdentificationController => {
  const service = new MaterialIdentificationService();
  return new MaterialIdentificationController(service);
};
