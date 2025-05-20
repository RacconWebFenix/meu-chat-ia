import Image from "next/image";
import styles from "./ImageGrid.module.scss";

interface Img {
  image_url: string;
}

interface Props {
  images: Img[];
}

export default function ImageGrid({ images }: Props) {
  return (
    <div className={styles.imageGrid}>
      {images.map((image, idx) => (
        <div
          key={idx}
          className={styles.imageWrapper}
        >
          <Image
            src={image.image_url}
            alt={`Imagem ${idx + 1}`}
            fill
            style={{
              objectFit: "contain",
              borderRadius: 18,
              background: "#f8f8f8",
            }}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
