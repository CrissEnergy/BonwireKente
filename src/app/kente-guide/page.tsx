import { KenteGuideClient } from "./KenteGuideClient";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function KenteGuidePage() {
  const guideImage = PlaceHolderImages.find(img => img.id === 'kente-guide-image');

  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Kente Pattern Guide</h1>
        <p className="text-lg text-muted-foreground">
          Unlock the stories woven into every Kente cloth. Enter the name of a pattern to discover its cultural significance, history, and the proverbs it represents.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          {guideImage && (
            <div className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={guideImage.imageUrl}
                alt={guideImage.description}
                fill
                className="object-cover"
                data-ai-hint={guideImage.imageHint}
              />
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <KenteGuideClient />
        </div>
      </div>
    </div>
  );
}
