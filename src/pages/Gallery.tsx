
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: any;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "galleryImages"));
        const imagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryImage[];
        
        setImages(imagesData);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(imagesData.map(img => img.category))
        ).filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const filteredImages = activeCategory === "all" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  if (loading) {
    return (
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold animate-fade-up">
          Gallery
        </h1>
        <p className="mt-4 text-lg text-muted-foreground animate-fade-up [animation-delay:200ms]">
          Explore my collection of images and photography.
        </p>

        <div className="mt-8 animate-fade-up [animation-delay:300ms]">
          <Tabs defaultValue="all" onValueChange={setActiveCategory}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.length > 0 ? (
                  filteredImages.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-square">
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{image.description}</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center py-12 text-muted-foreground">
                    No images found in this category.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Gallery;