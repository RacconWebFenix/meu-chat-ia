/**
 * Equivalence Identification Controller
 * Following Single Responsibility Principle
 */

import { NextRequest, NextResponse } from "next/server";
import { createEquivalenceIdentificationService } from "./service";
import { EquivalenceSearchRequest } from "./types";

export class EquivalenceIdentificationController {
  private service = createEquivalenceIdentificationService();

  async handleRequest(req: NextRequest) {
    try {
      if (req.method !== "POST") {
        return NextResponse.json(
          { error: "Method not allowed" },
          { status: 405 }
        );
      }

      const body = await req.json();

      // Validate required fields
      if (!body || !body.nome) {
        return NextResponse.json(
          { error: "Nome é obrigatório para busca de equivalências" },
          { status: 400 }
        );
      }

      // Transform the request body to our expected format
      const searchData: EquivalenceSearchRequest = {
        nome: body.nome || "",
        marcaFabricante: body.marcaFabricante || "",
        categoria: body.categoria || "",
        subcategoria: body.subcategoria || "",
        especificacoesTecnicas: body.especificacoesTecnicas || {},
        aplicacao: body.aplicacao || "",
        unidadeMedida: body.unidadeMedida || "",
        breveDescricao: body.breveDescricao || "",
        normas: body.normas || [],
        imagens: body.imagens || [],
      };

      const result = await this.service.searchEquivalences(searchData);

      return NextResponse.json(result);
    } catch (error) {
      console.error("Controller error:", error);
      return NextResponse.json(
        {
          error: "Erro interno do servidor",
          details: error instanceof Error ? error.message : "Erro desconhecido",
        },
        { status: 500 }
      );
    }
  }
}

// Factory function following Dependency Inversion
export const createController = (): EquivalenceIdentificationController => {
  return new EquivalenceIdentificationController();
};
