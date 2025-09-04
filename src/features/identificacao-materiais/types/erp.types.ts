/**
 * ERP Export Types
 * Following Single Responsibility Principle
 */

export interface ERPAttribute {
  readonly name: string;
  readonly value: string;
}

export interface ERPExportData {
  readonly attributes: ReadonlyArray<ERPAttribute>;
  readonly rawInput: string;
}

export interface ERPExportState {
  readonly data: ERPExportData | null;
  readonly isExporting: boolean;
  readonly error: string | null;
}

export interface ERPExportParser {
  parse(input: string): ERPExportData;
  validate(input: string): boolean;
}

export interface ERPExportService {
  exportToXLSX(data: ERPExportData): Promise<void>;
}
