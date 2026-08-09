import ZoomImage from "@/components/zoom-image";
import BlackHole from "@/public/images/black-hole.png";
import Circles from "@/public/images/circles.png";
import Eclipse from "@/public/images/eclipse.png";
import Fold from "@/public/images/fold.png";
import Giant from "@/public/images/giant.png";
import Wave from "@/public/images/wave.png";
import { Metadata } from "next";
import { StaticImageData } from "next/image";

export const metadata: Metadata = {
  title: "Images",
};

const images: { src: StaticImageData; alt: string; aspectRatio: number }[] = [
  { src: Circles, alt: "Circles", aspectRatio: 16 / 9 },
  { src: Eclipse, alt: "Eclipse", aspectRatio: 16 / 9 },
  { src: Giant, alt: "Giant", aspectRatio: 16 / 9 },
  { src: BlackHole, alt: "Black Hole", aspectRatio: 16 / 9 },
  { src: Fold, alt: "Fold", aspectRatio: 1 },
  { src: Wave, alt: "Wave", aspectRatio: 1 },
];

export default function ImagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Images</h1>
      <p className="mt-6">
        Feel free to use these images however you like. No permission or credit
        needed.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        {images.map((image) => (
          <ZoomImage
            key={image.src.src}
            src={image.src}
            alt={image.alt}
            unoptimized
            placeholder="blur"
            aspectRatio={image.aspectRatio}
            className="h-34.5 w-auto"
          />
        ))}
      </div>
    </div>
  );
}
