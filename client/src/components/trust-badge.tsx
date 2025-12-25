import { CheckCircle2, Shield, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeType = "verified" | "safety" | "responsive" | "veteran";

interface TrustBadgeProps {
  type: BadgeType;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const badgeConfig: Record<
  BadgeType,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  verified: {
    icon: CheckCircle2,
    label: "Verified Organizer",
    className: "text-emerald-600 dark:text-emerald-400",
  },
  safety: {
    icon: Shield,
    label: "Safety First",
    className: "text-blue-600 dark:text-blue-400",
  },
  responsive: {
    icon: Clock,
    label: "Quick Responder",
    className: "text-amber-600 dark:text-amber-400",
  },
  veteran: {
    icon: Users,
    label: "50+ Events",
    className: "text-purple-600 dark:text-purple-400",
  },
};

export function TrustBadge({ type, size = "md", showLabel = true }: TrustBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <div
      className={cn("inline-flex items-center gap-1", config.className)}
      data-testid={`badge-${type}`}
    >
      <Icon className={sizeClasses[size]} />
      {showLabel && (
        <span className={cn("font-medium", textSizes[size])}>{config.label}</span>
      )}
    </div>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <CheckCircle2
      className={cn("h-4 w-4 text-emerald-600 dark:text-emerald-400", className)}
      data-testid="icon-verified"
    />
  );
}
