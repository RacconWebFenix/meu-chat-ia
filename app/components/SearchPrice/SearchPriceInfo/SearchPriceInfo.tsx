import ReactMarkdown from "react-markdown";
import styles from "./SearchPriceInfo.module.scss";

interface SearchPriceInfoProps {
  markdown: string;
}

export default function SearchPriceInfo({ markdown }: SearchPriceInfoProps) {
  if (!markdown) return null;

  return (
    <div className={styles.priceTableWrapper}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
