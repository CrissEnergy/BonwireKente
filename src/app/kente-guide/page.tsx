import { KenteGuideClient } from "./KenteGuideClient";

export default function KenteGuidePage() {

  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Kente Pattern Guide</h1>
        <p className="text-lg text-muted-foreground">
          Unlock the stories woven into every Kente cloth. Enter the name of a pattern to discover its cultural significance, history, and the proverbs it represents.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
          <KenteGuideClient />
      </div>
    </div>
  );
}
