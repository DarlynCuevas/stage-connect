import React from 'react';
import { ArtistCard } from '@/components/artists/ArtistCard';

interface HorizontalScrollSectionProps {
  title: string;
  items: any[];
  onScrollRight: () => void;
  onScrollLeft?: () => void; // Added optional onScrollLeft prop
  renderItem: (item: any) => React.ReactNode;
  containerId?: string; // Added containerId prop
}

export const HorizontalScrollSection: React.FC<HorizontalScrollSectionProps> = ({
  title,
  items,
  onScrollRight,
  onScrollLeft, // Destructure onScrollLeft
  renderItem,
  containerId, // Destructure containerId
}) => {
  return (
    <div className="rounded-xl text-card-foreground transition-all duration-300 bg-transparent mb-0 p-0">
      <div className="flex items-center gap-2 mb-4 justify-between">
        <div className="flex items-center gap-2">
          {/* Icono de tendencia original */}
          <span className="text-orange-500 text-xl">↗</span>
          <span className="font-bold text-lg gradient-text">{title}</span>
        </div>
        <div className="flex gap-2"> {/* Adjusted visibility for arrows */}
          {onScrollLeft && (
            <button
              type="button"
              aria-label="Scroll destacados a la izquierda"
              className="hidden md:block p-1 rounded-full hover:bg-zinc-100 transition-colors"
              onClick={onScrollLeft}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {onScrollRight && (
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
          )}
        </div>
      </div>
      <div
        id={containerId || "horizontal-scroll"} // Use containerId if provided
        className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item) => (
          <div
            className="min-w-[180px] max-w-[100px] w-[70vw] sm:w-48 md:w-56 relative"
            key={item.id}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};