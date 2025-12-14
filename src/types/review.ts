// src/types/review.ts
export interface Review {
  id: number;
  artistId: number;
  reviewerId: number;
  rating: number;
  comment?: string;
  eventType?: string;
  eventDate?: string;
  createdAt: string;
  reviewer: {
    id: number;
    name: string;
    avatar?: string;
    city?: string;
    country?: string;
  };
}
