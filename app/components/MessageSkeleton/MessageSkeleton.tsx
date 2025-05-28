import React from "react";
import styles from "./MessageSkeleton.module.scss";

export default function MessageSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className="animate-pulse flex-1 w-full">
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineSmall} />
      </div>
      <div className="animate-pulse flex-1 w-full">
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineSmall} />
      </div>
      <div className="animate-pulse flex-1 w-full">
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineLarge} />
        <div className={styles.skeletonLineSmall} />
      </div>
    </div>
  );
}
