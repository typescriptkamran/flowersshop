import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  isInWishlist?: boolean;
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  isLoading?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string) => void;
  onFilterClick?: () => void;
}

const ProductGrid = ({
  products = [
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
  title = "Featured Products",
  isLoading = false,
  onAddToCart = () => {},
  onToggleWishlist = () => {},
  onFilterClick = () => {},
}: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Calculate products for current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onFilterClick}
          >
            <Filter size={16} />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[350px] animate-pulse rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-sm">
            <h3 className="mb-2 text-xl font-medium">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  isNew={product.isNew}
                  isBestseller={product.isBestseller}
                  isOnSale={product.isOnSale}
                  discountPercentage={product.discountPercentage}
                  isInWishlist={product.isInWishlist}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1)
                            handlePageChange(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, and pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            handlePageChange(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
