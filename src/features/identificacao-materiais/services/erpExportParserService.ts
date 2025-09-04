/**
 * ERP Export Parser Service
 * Following Single Responsibility Principle
 */

import {
  ERPExportParser,
  ERPExportData,
  ERPAttribute,
} from "../types/erp.types";

export class ERPExportParserService implements ERPExportParser {
  parse(input: string): ERPExportData {
    const attributes = this.parseAttributes(input);
    return {
      attributes: Object.freeze(attributes),
      rawInput: input,
    };
  }

  validate(input: string): boolean {
    if (!input.trim()) return false;

    try {
      const attributes = this.parseAttributes(input);
      return (
        attributes.length > 0 &&
        attributes.every(
          (attr) => attr.name.trim().length > 0 && attr.value.trim().length > 0
        )
      );
    } catch {
      return false;
    }
  }

  private parseAttributes(input: string): ERPAttribute[] {
    return input
      .split(";")
      .map((attr) => attr.trim())
      .filter((attr) => attr.length > 0)
      .map((attr) => this.parseSingleAttribute(attr));
  }

  private parseSingleAttribute(attr: string): ERPAttribute {
    const colonIndex = attr.indexOf(":");
    if (colonIndex === -1) {
      return {
        name: attr.trim(),
        value: "",
      };
    }

    const name = attr.substring(0, colonIndex).trim();
    const value = attr.substring(colonIndex + 1).trim();

    return {
      name,
      value,
    };
  }
}

// Factory function following Dependency Inversion
export const createERPExportParserService = (): ERPExportParser => {
  return new ERPExportParserService();
};
