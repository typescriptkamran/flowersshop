import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({
  id = "1",
  name = "Beautiful Bouquet",
  price = 49.99,
  image = "https://images.unsplash.com/photo-1561181286-d5c73485a63d?w=400&q=80",
  isNew = false,
  isBestseller = false,
  isOnSale = false,
  discountPercentage = 0,
  onAddToCart = () => {},
  onToggleWishlist = () => {},
  isInWishlist = false,
}: ProductCardProps) => {
  const originalPrice = isOnSale
    ? price / (1 - discountPercentage / 100)
    : price;

  return (
    <Card className="w-full max-w-[300px] overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
      <div className="relative">
        <div className="absolute right-2 top-2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => onToggleWishlist(id)}
                >
                  <Heart
                    className={
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }
                    size={20}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
          )}
          {isBestseller && (
            <Badge className="bg-amber-500 hover:bg-amber-600">
              Bestseller
            </Badge>
          )}
          {isOnSale && (
            <Badge className="bg-red-500 hover:bg-red-600">
              Sale {discountPercentage}%
            </Badge>
          )}
        </div>

        <div className="h-[200px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <h3 className="text-lg font-medium line-clamp-1">{name}</h3>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full gap-2" onClick={() => onAddToCart(id)}>
          <ShoppingCart size={16} />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
