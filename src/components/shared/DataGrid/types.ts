import { ReactNode } from "react";

export interface TableColumn {
  name: string;
  displayName?: string;
}

export interface DataGridTableProps {
  columns: string[] | TableColumn[];
  data: (string | number | ReactNode)[][];
  selectable?: boolean;
  onSelectionChange?: (selectedRows: number[]) => void;
  userInputHeaders?: string[];
  userInputRow?: (string | undefined)[];
  showCheckButton?: boolean;
  showValidateButton?: boolean;
}
