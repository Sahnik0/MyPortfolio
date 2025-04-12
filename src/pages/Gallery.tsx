
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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
      <div className="max-w-6xl mx-auto content-container">
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
              {filteredImages.length > 0 ? (
                <div className="gallery-container">
                  {filteredImages.map((image) => (
                    <div 
                      key={image.id} 
                      className="gallery-item"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="gallery-image"
                        loading="lazy"
                      />
                      <div className="gallery-overlay">
                        <h3 className="gallery-title">{image.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">
                  No images found in this category.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Image modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="bg-card max-w-4xl max-h-[90vh] rounded-lg overflow-hidden shadow-xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-auto max-h-[80vh] overflow-hidden">
                <img 
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
                <p className="mt-2 text-muted-foreground">{selectedImage.description}</p>
              </div>
              <button 
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/70"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;