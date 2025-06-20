import SearchPriceTextAndMarkdown from "../SearchPriceTextAndMarkdown/SearchPriceTextAndMarkdown";
import styles from "./SearchPriceResult.module.scss";
import { SearchPriceResultProps } from "../types";

export default function SearchPriceResult({
  result,
  loading,
  error,
}: SearchPriceResultProps) {
  if (loading) return <div className={styles.resultInfo}>Carregando...</div>;
  if (error) return <div className={styles.resultInfoErro}>{error}</div>;
  if (!result) return null;

  return (
    <div className={styles.resultInfo}>
      <SearchPriceTextAndMarkdown data={result} />
    </div>
  );
}
