/**
 * ERP Export Container
 * Following Single Responsibility Principle
 */

import React, { useMemo } from "react";
import { Paper } from "@mui/material";
import { useERPExport } from "../../hooks/useERPExport";
import { createERPExportParserService } from "../../services/erpExportParserService";
import { createERPExportService } from "../../services/erpExportService";
import { ERPExportHelp } from "./ERPExportHelp";
import { ERPExportInput } from "./ERPExportInput";
import { ERPExportPreview } from "./ERPExportPreview";
import { ERPExportButton } from "./ERPExportButton";

export const ERPExportContainer: React.FC = () => {
  const parserService = useMemo(() => createERPExportParserService(), []);
  const exportService = useMemo(() => createERPExportService(), []);

  const { state, inputValue, updateInput, exportData, canExport } =
    useERPExport(parserService, exportService);

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      <ERPExportHelp />
      <ERPExportInput
        value={inputValue}
        onInputChange={updateInput}
        error={state.error}
      />
      <ERPExportPreview data={state.data} />
      <ERPExportButton
        onExport={exportData}
        disabled={!canExport}
        isLoading={state.isExporting}
      />
    </Paper>
  );
};
