import BlackHole from "@/assets/black-hole.png";
import Eclipse from "@/assets/eclipse.png";
import Giant from "@/assets/giant.png";
import Wave from "@/assets/wave.png";
import Paragraph from "@/components/paragraph";
import Title from "@/components/title";
import ZoomImage from "@/components/zoom-image";
import { Metadata } from "next";
import { StaticImageData } from "next/image";

export const metadata: Metadata = {
  title: "Images",
};

const images: { src: StaticImageData; alt: string }[] = [
  { src: Eclipse, alt: "Eclipse" },
  { src: Wave, alt: "Wave" },
  { src: Giant, alt: "Giant" },
  { src: BlackHole, alt: "Black Hole" },
];

export default function ImagesPage() {
  return (
    <div>
      <Title>Images</Title>
      <Paragraph className="mt-6">
        Feel free to use these images however you like.
      </Paragraph>
      <div className="mt-6 flex flex-wrap gap-3">
        {images.map((image) => (
          <ZoomImage
            key={image.src.src}
            src={image.src}
            alt={image.alt}
            className="h-34.5 w-auto"
          />
        ))}
      </div>
    </div>
  );
}
