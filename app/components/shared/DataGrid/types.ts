import { ReactNode } from "react";

export interface DataGridTableProps {
  columns: string[];
  data: (string | number | ReactNode)[][];
  selectable?: boolean;
  onSelectionChange?: (selectedRows: number[]) => void;
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
}
