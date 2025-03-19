import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";

interface FilterBarProps {
  onFilterChange?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  occasion: string;
  priceRange: [number, number];
  flowerType: string;
}

const FilterBar = ({ onFilterChange }: FilterBarProps = {}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    occasion: "all",
    priceRange: [0, 200],
    flowerType: "all",
  });

  const occasions = [
    { value: "all", label: "All Occasions" },
    { value: "birthday", label: "Birthday" },
    { value: "anniversary", label: "Anniversary" },
    { value: "wedding", label: "Wedding" },
    { value: "sympathy", label: "Sympathy" },
    { value: "congratulations", label: "Congratulations" },
    { value: "getwell", label: "Get Well" },
  ];

  const flowerTypes = [
    { value: "all", label: "All Types" },
    { value: "roses", label: "Roses" },
    { value: "lilies", label: "Lilies" },
    { value: "tulips", label: "Tulips" },
    { value: "orchids", label: "Orchids" },
    { value: "mixed", label: "Mixed Bouquets" },
    { value: "seasonal", label: "Seasonal" },
  ];

  const handleOccasionChange = (value: string) => {
    const newFilters = { ...filters, occasion: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1] || 200] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleFlowerTypeChange = (value: string) => {
    const newFilters = { ...filters, flowerType: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      occasion: "all",
      priceRange: [0, 200],
      flowerType: "all",
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={filters.occasion} onValueChange={handleOccasionChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Occasions</SelectLabel>
                {occasions.map((occasion) => (
                  <SelectItem key={occasion.value} value={occasion.value}>
                    {occasion.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={filters.flowerType}
            onValueChange={handleFlowerTypeChange}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select flower type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Flower Types</SelectLabel>
                {flowerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex flex-col w-[200px]">
            <span className="text-xs text-gray-500 mb-1">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
            <Slider
              defaultValue={[0, 200]}
              value={[filters.priceRange[0], filters.priceRange[1]]}
              max={200}
              step={5}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="h-9 flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
