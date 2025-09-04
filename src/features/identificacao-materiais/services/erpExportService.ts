/**
 * ERP Export Service
 * Following Single Responsibility Principle
 */

import { ERPExportService, ERPExportData } from "../types/erp.types";

export class ERPExportServiceImpl implements ERPExportService {
  async exportToXLSX(data: ERPExportData): Promise<void> {
    // Dynamic import to avoid bundling issues
    const XLSX = await import("xlsx");

    // Prepare data for export following preview format
    // Create a single row object with attribute names as keys
    const exportRow: Record<string, string> = {};
    data.attributes.forEach((attr) => {
      exportRow[attr.name] = attr.value;
    });

    // Create worksheet with single row
    const worksheet = XLSX.utils.json_to_sheet([exportRow]);

    // Set column widths dynamically based on content
    const columnWidths = data.attributes.map((attr) => ({
      wch: Math.max(attr.name.length, attr.value.length, 15), // Minimum width of 15
    }));
    worksheet["!cols"] = columnWidths;

    // Create workbook with UTF-8 support
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ERP_Export");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `erp_export_${timestamp}.xlsx`;

    // Save file with UTF-8 encoding to support Portuguese characters (ç, ã, õ, etc.)
    XLSX.writeFile(workbook, fileName, {
      bookSST: false, // Disable Shared String Table to preserve UTF-8 characters
      type: "binary", // Use binary type for better character support
    });
  }
}

// Factory function following Dependency Inversion
export const createERPExportService = (): ERPExportService => {
  return new ERPExportServiceImpl();
};
