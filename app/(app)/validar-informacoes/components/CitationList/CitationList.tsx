import React from "react";
import styles from "./CitationList.module.scss";

interface CitationListProps {
  citations: string[];
}

export function CitationList({ citations }: CitationListProps) {
  if (!citations.length) return null;
  return (
    <div className={styles.citationsBlock}>
      <strong>Citações:</strong>
      <nav aria-label="breadcrumb">
        <ol className={styles.citationsList}>
          {citations.map((url, idx) => (
            <li key={idx} className={styles.citationItem}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.citationLink}
              >
                {url}
              </a>
              {idx < citations.length - 1 && (
                <span className={styles.citationDivider}>/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
