import React from "react";
import { Button } from "../../components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  featuredProducts?: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
  }>;
}

const HeroSection = ({
  title = "Fresh Flowers Delivered to Your Door",
  subtitle = "Beautiful arrangements for every occasion, with same-day delivery available",
  ctaText = "Shop Now",
  ctaLink = "/products",
  secondaryCtaText = "View Bestsellers",
  secondaryCtaLink = "/bestsellers",
  backgroundImage = "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80",
  featuredProducts = [
    {
      id: "1",
      name: "Spring Bouquet",
      image:
        "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80",
      price: 49.99,
    },
    {
      id: "2",
      name: "Rose Collection",
      image:
        "https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=400&q=80",
      price: 59.99,
    },
    {
      id: "3",
      name: "Birthday Special",
      image:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80",
      price: 64.99,
    },
  ],
}: HeroSectionProps) => {
  return (
    <div className="w-full bg-white">
      {/* Main Hero Section */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg md:text-xl mb-8">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white hover:bg-white/20"
              >
                {secondaryCtaText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Arrangements
          </h2>
          <Button variant="link" className="text-primary flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-gray-800">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button size="sm" variant="outline" className="text-sm">
                    Quick Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
