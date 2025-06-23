import React from "react";
import styles from "./CustomGrid.module.scss";

interface CustomGridProps {
  items: { id: string | number; content: React.ReactNode }[];
  onItemClick?: (id: string | number) => void;
}

const CustomGrid: React.FC<CustomGridProps> = ({ items, onItemClick }) => {
  return (
    <div className={styles.gridContainer}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.gridItem}
          onClick={() => onItemClick?.(item.id)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default CustomGrid;
