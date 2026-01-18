interface EventFiltersProps {
  children: React.ReactNode;
}

export function EventFiltersWrapper({ children }: EventFiltersProps) {
  return (
    <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {children}
    </div>
  );
}
