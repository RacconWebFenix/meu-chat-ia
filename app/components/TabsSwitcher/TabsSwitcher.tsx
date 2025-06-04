import styles from "./TabsSwitcher.module.scss";

interface TabsSwitcherProps {
  tab: "custom" | "boot" | "pricesearch";
  setTab: (tab: "custom" | "boot" | "pricesearch") => void;
}

export default function TabsSwitcher({ tab, setTab }: TabsSwitcherProps) {
  return (
    <div className={styles.tabsContainer}>
      <button
        onClick={() => setTab("boot")}
        className={styles.tabButton}
        style={{
          background: tab === "boot" ? "#e3eaf2" : "#1976d2",
          color: tab === "boot" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa de Equivalência
      </button>
      <button
        onClick={() => setTab("custom")}
        className={styles.tabButton}
        style={{
          background: tab === "custom" ? "#e3eaf2" : "#1976d2",
          color: tab === "custom" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa PDM
      </button>
      <button
        onClick={() => setTab("pricesearch")}
        className={styles.tabButton}
        style={{
          background: tab === "pricesearch" ? "#e3eaf2" : "#1976d2",
          color: tab === "pricesearch" ? "#1976d2" : "#fff",
        }}
      >
        Pesquisa de Preços
      </button>
    </div>
  );
}
