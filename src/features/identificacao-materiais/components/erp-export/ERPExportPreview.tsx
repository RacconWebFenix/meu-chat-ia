/**
 * ERP Export Preview Component
 * Following Single Responsibility Principle
 */

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { ERPExportData } from "../../types/erp.types";

interface ERPExportPreviewProps {
  data: ERPExportData | null;
}

export const ERPExportPreview: React.FC<ERPExportPreviewProps> = ({ data }) => {
  if (!data?.attributes.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Digite os atributos para ver o preview...
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {data.attributes.map((attr, index) => (
              <TableCell
                key={index}
                sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
              >
                {attr.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow hover>
            {data.attributes.map((attr, index) => (
              <TableCell key={index} sx={{ fontWeight: 500 }}>
                {attr.value}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
