import {
  Footprints,
  Mountain,
  Dog,
  Dices,
  Camera,
  ChefHat,
  Heart,
  Brain,
  BookOpen,
  Trophy,
  TreePine,
  Users,
  Fish,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  running: Footprints,
  hiking: Mountain,
  "dog-parents": Dog,
  "board-games": Dices,
  photography: Camera,
  cooking: ChefHat,
  yoga: Heart,
  meditation: Brain,
  "book-clubs": BookOpen,
  sports: Trophy,
  outdoor: TreePine,
  social: Users,
  fishing: Fish,
  fitness: Dumbbell,
};

interface CategoryPillProps {
  categoryId: string;
  categoryName: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function CategoryPill({
  categoryId,
  categoryName,
  selected = false,
  onClick,
  size = "md",
  showIcon = true,
}: CategoryPillProps) {
  const Icon = categoryIcons[categoryId] || Users;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors whitespace-nowrap",
        sizeClasses[size],
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover-elevate"
      )}
      data-testid={`category-${categoryId}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{categoryName}</span>
    </button>
  );
}

export function getCategoryIcon(categoryId: string): LucideIcon {
  return categoryIcons[categoryId] || Users;
}
