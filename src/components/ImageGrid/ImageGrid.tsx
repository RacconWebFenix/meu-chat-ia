import { ImageList, ImageListItem } from "@mui/material";

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
          <img
            srcSet={item.image_url}
            src={item.image_url}
            alt={"Imagem do produto"}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
