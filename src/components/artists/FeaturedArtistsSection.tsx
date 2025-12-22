import React from 'react';
import { ArtistCard } from '@/components/artists/ArtistCard';

interface FeaturedArtistsSectionProps {
  title: string;
  artists: any[];
  onScrollRight: () => void;
  mapToArtistCard: (artist: any) => any;
}

export const FeaturedArtistsSection: React.FC<FeaturedArtistsSectionProps> = ({
  title,
  artists,
  onScrollRight,
  mapToArtistCard,
}) => {
  return (
    <div className="rounded-xl text-card-foreground transition-all duration-300 bg-transparent mb-0 p-0">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          {/* Icono de tendencia original */}
          <span className="text-orange-500 text-xl">↗</span>
          <span className="font-bold text-lg gradient-text">{title}</span>
        </div>
        <button
          type="button"
          aria-label="Scroll destacados a la derecha"
          className="p-1 rounded-full hover:bg-zinc-100 transition-colors"
          onClick={onScrollRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div
        id="destacados-scroll"
        className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {artists.map((artist) => (
          <div
            className="min-w-[180px] max-w-[100px] w-[70vw] sm:w-48 md:w-56 relative"
            key={artist.id}
          >
            <ArtistCard artist={mapToArtistCard(artist)} showPrice={true} />
          </div>
        ))}
      </div>
    </div>
  );
};