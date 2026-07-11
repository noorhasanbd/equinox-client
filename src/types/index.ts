export interface ListingItem {
  id: string;
  title: string;
  subtitle: string;
  tag: "Instant Book" | "Free Cancellation" | "Top Rated";
  quantity: string; // Dynamic capacity config e.g., "2 Guests · 1 King Bed"
  price: string;    // Raw styling display text e.g., "$180 / night"
  imageUrl: string;
  isFavorite?: boolean;
  author: {
    name: string;
    company: string;
    avatarUrl: string;
  };
}

export interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

export interface FilterState {
  bookingType: "all" | "instant";
  bedConfig: string;
  minPrice: string;
  maxPrice: string;
}