// src/components/ImageGrid/ImageGrid.tsx
import { ImageList, ImageListItem } from "@mui/material";
import Image from "next/image"; // <<<<<< IMPORTADO AQUI

export interface Img {
  image_url: string;
  width?: number;
  height?: number;
}

interface Props {
  images: Img[];
}

export default function ImageGrid({ images }: Props) {
  return (
    <ImageList
      sx={{
        width: 500,
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}
      cols={5}
    >
      {images.map((item, i) => (
        <ImageListItem key={i + item.image_url}>
          <Image
            src={item.image_url}
            alt={"Imagem do produto"}
            width={item.width || 100} // Fornece um fallback
            height={item.height || 100} // Fornece um fallback
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
