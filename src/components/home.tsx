import React, { useState } from "react";
import HeroSection from "./home/HeroSection";
import FilterBar from "./products/FilterBar";
import ProductGrid from "./products/ProductGrid";
import RecommendationSection from "./recommendations/RecommendationSection";

interface HomeProps {
  featuredProducts?: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    isNew?: boolean;
    isBestseller?: boolean;
    isOnSale?: boolean;
    discountPercentage?: number;
    isInWishlist?: boolean;
  }>;
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

const Home = ({
  featuredProducts = [
    {
      id: "1",
      name: "Spring Blossoms Bouquet",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1561181286-d5c73485a63d?w=400&q=80",
      isNew: true,
      isInWishlist: false,
    },
    {
      id: "2",
      name: "Romantic Red Roses",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=400&q=80",
      isBestseller: true,
      isInWishlist: true,
    },
    {
      id: "3",
      name: "Sunshine Daisy Arrangement",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "4",
      name: "Elegant Orchid Collection",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1566896546083-2e4e67b3d76a?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "5",
      name: "Summer Wildflower Mix",
      price: 44.99,
      image:
        "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "6",
      name: "Pastel Tulip Bouquet",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1589123053646-4e8b5493f439?w=400&q=80",
      isOnSale: true,
      discountPercentage: 15,
      isInWishlist: false,
    },
    {
      id: "7",
      name: "Luxury Lily Arrangement",
      price: 64.99,
      image:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80",
      isInWishlist: false,
    },
    {
      id: "8",
      name: "Exotic Tropical Bouquet",
      price: 69.99,
      image:
        "https://images.unsplash.com/photo-1533616688419-b7a585564566?w=400&q=80",
      isNew: true,
      isInWishlist: false,
    },
  ],
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
}: HomeProps) => {
  const [showFilters, setShowFilters] = useState(false);

  // Mock handlers for cart and wishlist functionality
  const handleAddToCart = (id: string) => {
    console.log(`Added product ${id} to cart`);
    // In a real implementation, this would dispatch to a cart state manager
  };

  const handleToggleWishlist = (id: string) => {
    console.log(`Toggled wishlist for product ${id}`);
    // In a real implementation, this would update wishlist state
  };

  const handleFilterChange = (filters: any) => {
    console.log("Filters changed:", filters);
    // In a real implementation, this would filter the products
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Product Grid */}
      <ProductGrid
        products={featuredProducts}
        title="Our Collection"
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onFilterClick={() => setShowFilters(!showFilters)}
      />

      {/* AI Recommendations */}
      <div className="py-8">
        <RecommendationSection recommendations={recommendations} />
      </div>

      {/* Footer would typically be included in a layout component */}
    </div>
  );
};

export default Home;
