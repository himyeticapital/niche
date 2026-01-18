export const DEFAULT_LAT = 27.3289509;
export const DEFAULT_LNG = 88.6073311;

// Categories for events
export const categories = [
  { id: "running", name: "Running", icon: "running" },
  { id: "hiking", name: "Hiking", icon: "mountain" },
  { id: "dog-parents", name: "Dog Parents", icon: "dog" },
  { id: "board-games", name: "Board Games", icon: "dice" },
  { id: "photography", name: "Photography", icon: "camera" },
  { id: "cooking", name: "Cooking", icon: "chef-hat" },
  { id: "yoga", name: "Yoga", icon: "heart" },
  { id: "meditation", name: "Meditation", icon: "brain" },
  { id: "book-clubs", name: "Book Clubs", icon: "book" },
  { id: "sports", name: "Sports", icon: "trophy" },
  { id: "outdoor", name: "Outdoor", icon: "trees" },
  { id: "social", name: "Social", icon: "users" },
  { id: "fishing", name: "Fishing", icon: "fish" },
  { id: "fitness", name: "Fitness", icon: "dumbbell" },
  { id: "gaming", name: "Gaming", icon: "gamepad-2" },
  { id: "art", name: "Art & Creative", icon: "palette" },
] as const;
export const AGE_OPTIONS = [
  { label: "All", value: 0 },
  { label: "13+", value: 13 },
  { label: "18+", value: 18 },
  { label: "21+", value: 21 },
];
