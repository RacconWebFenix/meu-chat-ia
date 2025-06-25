import styles from "./InfoTable.module.scss";

interface InfoTableProps {
  data: Record<string, string>[];
  selectedRows?: number[];
  onRowSelect?: (rowIdx: number) => void;
}

export default function InfoTable({
  data,
  selectedRows = [],
  onRowSelect,
}: InfoTableProps) {
  if (!data || data.length === 0) return null;
  const columns = Object.keys(data[0]);
  return (
    <table className={styles.infoTable}>
      <thead>
        <tr>
          <th>#</th>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr
            key={rowIdx}
            className={rowIdx % 2 === 0 ? styles.evenRow : styles.oddRow}
            onClick={() => onRowSelect && onRowSelect(rowIdx)}
            style={{ cursor: onRowSelect ? "pointer" : undefined }}
          >
            <td onClick={(e) => e.stopPropagation()}>
              <input
                type="radio"
                name="infoTableSelection"
                checked={selectedRows.includes(rowIdx)}
                onChange={() => onRowSelect && onRowSelect(rowIdx)}
              />
            </td>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
