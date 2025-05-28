import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <Image
            src="/assets/logo-comercio-integrado.png"
            alt="Comércio Integrado"
            width={200}
            height={0}
          />
        </div>
    
        <div>
          <h1 className={styles.title}>
            Comércio Integrado Materiais & Suprimentos
          </h1>
        </div>
      </div>
    </header>
  );
}
