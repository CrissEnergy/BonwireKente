
import { KenteGuideClient } from "./KenteGuideClient";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function KenteGuidePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="relative min-h-screen w-full animate-fade-in-up">
       {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover blur-md scale-110"
            data-ai-hint={heroImage.imageHint}
          />
        )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 container py-12">
        <div className="text-center max-w-3xl mx-auto mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Kente Pattern Guide</h1>
          <p className="text-lg text-slate-200">
            Unlock the stories woven into every Kente cloth. Enter the name of a pattern to discover its cultural significance, history, and the proverbs it represents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <KenteGuideClient />
        </div>
      </div>
    </div>
  );
}
