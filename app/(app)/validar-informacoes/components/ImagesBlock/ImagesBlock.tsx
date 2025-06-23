import React from "react";
import styles from "./ImagesBlock.module.scss";
import ImageGrid from "@/app/components/ImageGrid/ImageGrid";

interface ImagesBlockProps {
  images: {
    image_url: string;
    origin_url: string;
    height?: number;
    width?: number;
  }[];
}

export function ImagesBlock({ images }: ImagesBlockProps) {
  if (!images.length) return null;
  return (
    <div className={styles.imagesBlock}>
      <strong>Imagens:</strong>
      <ImageGrid images={images} />
    </div>
  );
}
