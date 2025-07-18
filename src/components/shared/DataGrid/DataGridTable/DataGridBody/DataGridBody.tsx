import React, { ReactNode } from "react";
import DataGridRow from "./DataGridRow/DataGridRow";

interface DataGridBodyProps {
  data: (string | number | ReactNode)[][];
  selectedRows: number[];
  onRowSelect: (idx: number) => void;
  selectable?: boolean;
  showCheckButton?: boolean;
}

export default function DataGridBody({
  data,
  selectedRows,
  onRowSelect,
  selectable,
  showCheckButton = true,
}: DataGridBodyProps) {
  return (
    <tbody>
      {data.map((row, idx) => (
        <DataGridRow
          key={idx}
          row={row}
          idx={idx}
          selected={selectedRows.includes(idx)}
          onSelect={onRowSelect}
          selectable={selectable}
          showCheckButton={showCheckButton}
        />
      ))}
    </tbody>
  );
}
