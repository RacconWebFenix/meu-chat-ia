import React from "react";
import styles from "./Citations.module.scss";

interface CitationProps {
  citations: { url: string; siteName: string }[];
}

export default function Citations({ citations }: CitationProps) {
  return (
    <div className={styles.citationsWrapper}>
      {citations.map((citation) => (
        <a
          key={citation.url}
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.citationLink}
        >
          {citation.siteName}
        </a>
      ))}
    </div>
  );
}
