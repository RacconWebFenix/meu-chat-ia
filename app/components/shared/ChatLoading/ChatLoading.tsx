import Image from "next/image";
import styles from "./ChatLoading.module.scss";

export default function ChatLoading({ className }: { className?: string }) {
  const logoSrc = "/assets/logo-comercio-integrado.png";
  return (
    <div className={`${styles.loadingBox} ${className || ""}`}>
      <span className={styles.logoSpin}>
        <Image src={logoSrc} alt="Logo" width={150} height={32} />
      </span>
      <span>Carregando...</span>
    </div>
  );
}
