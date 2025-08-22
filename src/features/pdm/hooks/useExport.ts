/**
 * Export hook following Single Responsibility Principle
 * Responsibility: Handle export functionality state and operations
 */

import { useState, useCallback } from "react";
import { EquivalenceMatch, ExportData } from "../types";
import { createExportService, ExportServiceInterface } from "../services";

interface UseExportReturn {
  readonly isExporting: boolean;
  readonly exportToCSV: (
    matches: readonly EquivalenceMatch[],
    options?: ExportOptions
  ) => Promise<void>;
  readonly exportToExcel: (
    matches: readonly EquivalenceMatch[],
    options?: ExportOptions
  ) => Promise<void>;
  readonly exportToPDF: (
    matches: readonly EquivalenceMatch[],
    options?: ExportOptions
  ) => Promise<void>;
}

interface ExportOptions {
  readonly includeSpecs?: boolean;
  readonly includePDM?: boolean;
  readonly searchCriteria?: any;
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const exportService: ExportServiceInterface = createExportService();

  const createExportData = useCallback(
    (
      matches: readonly EquivalenceMatch[],
      format: "excel" | "csv" | "pdf",
      options: ExportOptions = {}
    ): ExportData => {
      return {
        selectedMatches: matches,
        searchCriteria: options.searchCriteria || {},
        exportFormat: format,
        includeSpecs: options.includeSpecs ?? true,
        includePDM: options.includePDM ?? true,
      };
    },
    []
  );

  const exportToCSV = useCallback(
    async (
      matches: readonly EquivalenceMatch[],
      options: ExportOptions = {}
    ): Promise<void> => {
      if (matches.length === 0) return;

      setIsExporting(true);
      try {
        const exportData = createExportData(matches, "csv", options);
        await exportService.exportToCSV(exportData);
      } catch (error) {
        console.error("Error exporting to CSV:", error);
        // In production, would show a proper error message to user
      } finally {
        setIsExporting(false);
      }
    },
    [createExportData, exportService]
  );

  const exportToExcel = useCallback(
    async (
      matches: readonly EquivalenceMatch[],
      options: ExportOptions = {}
    ): Promise<void> => {
      if (matches.length === 0) return;

      setIsExporting(true);
      try {
        const exportData = createExportData(matches, "excel", options);
        await exportService.exportToExcel(exportData);
      } catch (error) {
        console.error("Error exporting to Excel:", error);
        // In production, would show a proper error message to user
      } finally {
        setIsExporting(false);
      }
    },
    [createExportData, exportService]
  );

  const exportToPDF = useCallback(
    async (
      matches: readonly EquivalenceMatch[],
      options: ExportOptions = {}
    ): Promise<void> => {
      if (matches.length === 0) return;

      setIsExporting(true);
      try {
        const exportData = createExportData(matches, "pdf", options);
        await exportService.exportToPDF(exportData);
      } catch (error) {
        console.error("Error exporting to PDF:", error);
        // In production, would show a proper error message to user
      } finally {
        setIsExporting(false);
      }
    },
    [createExportData, exportService]
  );

  return {
    isExporting,
    exportToCSV,
    exportToExcel,
    exportToPDF,
  };
}
