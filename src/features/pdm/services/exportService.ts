/**
 * Export Service following Single Responsibility Principle
 * Responsibility: Handle data export functionality for equivalence matches
 */

import { EquivalenceMatch, ExportData } from "../types";

export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ExportServiceInterface {
  readonly exportToCSV: (data: ExportData) => Promise<void>;
  readonly exportToExcel: (data: ExportData) => Promise<void>;
  readonly exportToPDF: (data: ExportData) => Promise<void>;
  readonly generateFileName: (
    format: ExportFormat,
    baseTitle?: string
  ) => string;
}

export class MockExportService implements ExportServiceInterface {
  async exportToCSV(data: ExportData): Promise<void> {
    const csvContent = this.generateCSVContent(data);
    const fileName = this.generateFileName("csv");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    this.downloadFile(blob, fileName);
  }

  async exportToExcel(data: ExportData): Promise<void> {
    // For production, would use a library like xlsx
    const csvContent = this.generateCSVContent(data);
    const fileName = this.generateFileName("xlsx");

    const blob = new Blob([csvContent], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    this.downloadFile(blob, fileName);
  }

  async exportToPDF(data: ExportData): Promise<void> {
    // For production, would use a library like jsPDF
    const pdfContent = this.generatePDFContent(data);
    const fileName = this.generateFileName("pdf");

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    this.downloadFile(blob, fileName);
  }

  generateFileName(format: ExportFormat, baseTitle = "equivalencias"): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const sanitizedTitle = baseTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
    return `${sanitizedTitle}_${timestamp}.${format}`;
  }

  private generateCSVContent(data: ExportData): string {
    const headers = this.getSelectedHeaders(data);
    const rows = data.selectedMatches.map((match: EquivalenceMatch) =>
      this.generateCSVRow(match, data)
    );

    return [headers.join(","), ...rows].join("\n");
  }

  private generatePDFContent(data: ExportData): string {
    // Mock PDF content - in production would generate actual PDF
    return `
      PDM EQUIVALENCE REPORT
      ===================
      
      Generated: ${new Date().toLocaleDateString("pt-BR")}
      Total Items: ${data.selectedMatches.length}
      Include Specifications: ${data.includeSpecs ? "Yes" : "No"}
      Include PDM: ${data.includePDM ? "Yes" : "No"}
      
      ${data.selectedMatches
        .map(
          (match: EquivalenceMatch, index: number) => `
        ${index + 1}. ${match.nome}
        Manufacturer: ${match.marcaFabricante || "N/A"}
        Category: ${match.categoria}
        Score: ${Math.round(match.matchScore * 100)}%
        PDM: ${match.pdmPadronizado || "N/A"}
        ${
          data.includeSpecs && match.especificacoesTecnicas
            ? "Specifications: " +
              JSON.stringify(match.especificacoesTecnicas, null, 2)
            : ""
        }
      `
        )
        .join("\n")}
    `;
  }

  private getSelectedHeaders(data: ExportData): string[] {
    const allHeaders = [
      "nome",
      "marcaFabricante",
      "categoria",
      "matchScore",
      "pdmPadronizado",
      "especificacoesTecnicas",
    ];

    // Return all headers since ExportData doesn't have selectedFields
    // Filter based on includeSpecs and includePDM flags
    const headers = ["nome", "marcaFabricante", "categoria", "matchScore"];

    if (data.includePDM) {
      headers.push("pdmPadronizado");
    }

    if (data.includeSpecs) {
      headers.push("especificacoesTecnicas");
    }

    return headers;
  }

  private generateCSVRow(match: EquivalenceMatch, data: ExportData): string {
    const fields = this.getSelectedHeaders(data);

    return fields
      .map((field: string) => {
        const value = this.getFieldValue(match, field);
        // Escape commas and quotes for CSV
        return typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(",");
  }

  private getFieldValue(match: EquivalenceMatch, field: string): string {
    switch (field) {
      case "nome":
        return match.nome;
      case "marcaFabricante":
        return match.marcaFabricante || "";
      case "categoria":
        return match.categoria;
      case "matchScore":
        return `${Math.round(match.matchScore * 100)}%`;
      case "pdmPadronizado":
        return match.pdmPadronizado || "";
      case "especificacoesTecnicas":
        return match.especificacoesTecnicas
          ? JSON.stringify(match.especificacoesTecnicas)
          : "";
      default:
        return "";
    }
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  }
}

// Factory function following Dependency Inversion Principle
export function createExportService(): ExportServiceInterface {
  return new MockExportService();
}
