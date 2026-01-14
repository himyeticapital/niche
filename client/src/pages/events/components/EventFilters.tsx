import { useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Map,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { CategoryPill } from "@/components/category-pill";
import { categories } from "@shared/utils/constants";

interface EventFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  maxDistance: number[];
  setMaxDistance: (d: number[]) => void;
  priceRange: number[];
  setPriceRange: (r: number[]) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  viewMode: "grid" | "list" | "map";
  setViewMode: (v: "grid" | "list" | "map") => void;
  userLocation: { name: string; lat: number; lng: number };
  isDetectingLocation: boolean;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function EventFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  maxDistance,
  setMaxDistance,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  userLocation,
  isDetectingLocation,
  clearFilters,
  hasActiveFilters,
}: EventFiltersProps) {
  return (
    <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events, locations, or activities..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-events"
            />
          </div>

          {/* Location */}
          <Button
            variant="outline"
            className="gap-2"
            data-testid="button-location"
          >
            {isDetectingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{userLocation.name}</span>
            <span className="text-muted-foreground">({maxDistance[0]}km)</span>
          </Button>

          {/* Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    !
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Events</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Distance */}
                <div className="space-y-3">
                  <Label>Maximum Distance: {maxDistance[0]}km</Label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    min={1}
                    max={15}
                    step={1}
                    data-testid="slider-distance"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1km</span>
                    <span>15km</span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>
                    Price Range: {priceRange[0]} - {priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={2000}
                    step={100}
                    data-testid="slider-price"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Free</span>
                    <span>2000</span>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <CategoryPill
                        key={category.id}
                        categoryId={category.id}
                        categoryName={category.name}
                        selected={selectedCategory === category.id}
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.id ? "" : category.id
                          )
                        }
                        size="sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                    data-testid="button-clear-filters"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="hidden md:flex items-center border rounded-md">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "secondary" : "ghost"}
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "map" ? "secondary" : "ghost"}
              onClick={() => setViewMode("map")}
              data-testid="button-view-map"
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Pills (horizontal scroll) */}
        <div className="mt-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2">
            <CategoryPill
              categoryId="all"
              categoryName="All"
              selected={!selectedCategory}
              onClick={() => setSelectedCategory("")}
              showIcon={false}
            />
            {categories.map((category) => (
              <CategoryPill
                key={category.id}
                categoryId={category.id}
                categoryName={category.name}
                selected={selectedCategory === category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? "" : category.id
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
