import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ProductCard from "../products/ProductCard";

interface RecommendationSectionProps {
  title?: string;
  subtitle?: string;
  recommendations?: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    isNew?: boolean;
    isBestseller?: boolean;
    isOnSale?: boolean;
    discountPercentage?: number;
    isInWishlist?: boolean;
  }>;
}

const RecommendationSection = ({
  title = "Recommended For You",
  subtitle = "Based on your browsing history and preferences",
  recommendations = [
    {
      id: "rec1",
      name: "Spring Delight Bouquet",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1561181286-d5c73485a63d?w=400&q=80",
      isNew: true,
      isInWishlist: false,
    },
    {
      id: "rec2",
      name: "Romantic Rose Collection",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400&q=80",
      isBestseller: true,
      isInWishlist: true,
    },
    {
      id: "rec3",
      name: "Summer Sunshine Mix",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1567696153798-9a18f2114101?w=400&q=80",
      isOnSale: true,
      discountPercentage: 15,
      isInWishlist: false,
    },
    {
      id: "rec4",
      name: "Elegant Lily Arrangement",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "rec5",
      name: "Birthday Celebration Bouquet",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "rec6",
      name: "Exotic Orchid Collection",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1589244159943-460088ed5c92?w=400&q=80",
      isNew: true,
      isInWishlist: false,
    },
  ],
}: RecommendationSectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef) {
      setMaxScroll(containerRef.scrollWidth - containerRef.clientWidth);
    }
  }, [containerRef, recommendations]);

  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef) return;

    const scrollAmount = 320; // Approximate width of a card + margin
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);

    containerRef.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  const handleAddToCart = (id: string) => {
    // This would be implemented with actual cart functionality
    console.log(`Added product ${id} to cart`);
  };

  const handleToggleWishlist = (id: string) => {
    // This would be implemented with actual wishlist functionality
    console.log(`Toggled wishlist for product ${id}`);
  };

  return (
    <Card className="w-full bg-gray-50">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <div className="relative">
          {/* Scroll Controls */}
          <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md"
              onClick={() => handleScroll("left")}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute -right-4 top-1/2 z-10 -translate-y-1/2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md"
              onClick={() => handleScroll("right")}
              disabled={scrollPosition >= maxScroll}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Scrollable Container */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            ref={setContainerRef}
          >
            {recommendations.map((product) => (
              <div key={product.id} className="flex-shrink-0">
                <ProductCard
                  {...product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationSection;
