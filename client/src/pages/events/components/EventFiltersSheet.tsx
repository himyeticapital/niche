import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";
import { CategoryPill } from "@/components/category-pill";
import { AGE_OPTIONS as ageOptions } from "@shared/utils/constants";
import { Input } from "@/components/ui/input";

type Category = {
  id: string;
  name: string;
};

type Filters = {
  searchQuery: string;
  category: string;
  maxDistance: number[];
  priceRange: number[];
  sortBy: string;
  organizerRating: number;
  ageRequirement: number;
  fromDate: string;
  toDate: string;
  startTime: string;
};

type EventFiltersSheetProps = {
  filters: Filters;
  categories: readonly Category[];
  handleFilterChange: (filter: string, value: any) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
};

export function EventFiltersSheet({
  filters,
  categories,
  hasActiveFilters,
  clearFilters,
  handleFilterChange,
}: EventFiltersSheetProps) {
  return (
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

        <div
          className="mt-6 space-y-6 overflow-y-auto overflow-hidden scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          {/* Distance */}
          <div className="space-y-3">
            <Label>Maximum Distance: {filters.maxDistance[0]}km</Label>
            <Slider
              value={filters.maxDistance}
              onValueChange={(val) => handleFilterChange("maxDistance", val)}
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

          {/* Price */}
          <div className="space-y-3">
            <Label>Min Price: {filters.priceRange[0]}</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(val) => handleFilterChange("priceRange", val)}
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

          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                placeholder="From"
              />
              <span className="self-center">-</span>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                placeholder="To"
                className="color-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={filters.startTime}
              onChange={(e) => handleFilterChange("startTime", e.target.value)}
              className="w-[130px]"
              placeholder="Start Time"
            />
          </div>

          {/* Organizer Rating */}
          <div className="space-y-3">
            <Label>Organizer Rating: {filters.organizerRating}</Label>
            <Slider
              value={[filters.organizerRating]}
              onValueChange={(val) => {
                return handleFilterChange("organizerRating", val[0]);
              }}
              min={0}
              max={5}
              step={0.1}
              data-testid="slider-organizer-rating"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>5</span>
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
                  selected={filters.category === category.id}
                  onClick={() =>
                    handleFilterChange(
                      "category",
                      filters.category === category.id ? "" : category.id,
                    )
                  }
                  size="sm"
                />
              ))}
            </div>
          </div>

          {/* Age Requirement */}
          <div className="space-y-3">
            <Label>Age Requirement</Label>
            <div className="flex gap-2">
              {ageOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={
                    filters.ageRequirement === opt.value
                      ? "secondary"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    handleFilterChange("ageRequirement", opt.value)
                  }
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear */}
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
  );
}
