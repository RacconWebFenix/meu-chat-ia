import styles from "./TabsSwitcher.module.scss";

interface TabsSwitcherProps {
  tab: "pdm" | "equivalencia" ;
  setTab: (tab: "pdm" | "equivalencia") => void;
}

export default function TabsSwitcher({ tab, setTab }: TabsSwitcherProps) {
  return (
    <div className={styles.tabsContainer}>
      <button
        onClick={() => setTab("equivalencia")}
        className={styles.tabButton}
        style={{
          background: tab === "equivalencia" ? "#e3eaf2" : "#1976d2",
          color: tab === "equivalencia" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa de Equivalência
      </button>
      <button
        onClick={() => setTab("pdm")}
        className={styles.tabButton}
        style={{
          background: tab === "pdm" ? "#e3eaf2" : "#1976d2",
          color: tab === "pdm" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa PDM
      </button>
      {/* Feature adiada */}
      {/* <button
        onClick={() => setTab("pricesearch")}
        className={styles.tabButton}
        style={{
          background: tab === "pricesearch" ? "#e3eaf2" : "#1976d2",
          color: tab === "pricesearch" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa de Preços
      </button> */}
    </div>
  );
}
