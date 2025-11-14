import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'about-us-image');

    return (
        <div className="bg-secondary/30">
            <div className="container py-16 md:py-24">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Our Story</h1>
                    <p className="text-lg text-muted-foreground">
                        BonwireKente was born from a passion for preserving and sharing the rich cultural tapestry of Ghana. We are more than just a brand; we are storytellers, artisans, and custodians of a vibrant heritage.
                    </p>
                </div>
            </div>

            <div className="container pb-16 md:pb-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {aboutImage && (
                         <div className="relative aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={aboutImage.imageUrl}
                                alt={aboutImage.description}
                                fill
                                className="object-cover"
                                data-ai-hint={aboutImage.imageHint}
                            />
                        </div>
                    )}
                    <div className="space-y-6 text-muted-foreground">
                        <p>Our journey began in the heart of the Ashanti Kingdom, where the rhythmic clatter of the loom has echoed for centuries. Witnessing the intricate process of Kente weaving—each thread chosen with purpose, each pattern imbued with meaning—we knew this was a story that needed to be told on a global stage.</p>
                        <p>We partner directly with master weavers and their families, ensuring that the traditions are honored and that the artisans are fairly compensated for their incredible skill. This direct relationship allows us to guarantee the authenticity and quality of every single piece we offer.</p>
                        <p className="font-semibold text-foreground">Our mission is to make authentic Ghanaian Kente accessible worldwide, celebrating its beauty, cultural significance, and the unparalleled craftsmanship that goes into its creation.</p>
                        <p>When you choose BonwireKente, you're not just buying a product. You are acquiring a piece of history, supporting a community of artisans, and weaving a vibrant piece of Ghanaian heritage into the fabric of your own life.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
