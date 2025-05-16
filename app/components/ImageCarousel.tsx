import Slider from "react-slick";

interface Image {
  image_url: string;
}

interface Props {
  images: Image[];
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 2000,
    cssEase: "linear",
};

export default function ImageCarousel({ images }: Props) {
  return (
    <Slider {...sliderSettings}>
      {images.map((image, idx) => (
        <div key={idx} style={{ borderRadius: 8 }}>
          <img
            src={image.image_url}
            alt={`Imagem ${idx + 1}`}
            style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} 
          />
        </div>
      ))}
    </Slider>
  );
}
