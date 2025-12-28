import React from 'react';
import { useParams } from 'react-router-dom';
import { useDiscoveryArtists } from '@/hooks/useDiscoveryArtists';
import { useDiscoveryManagers } from '@/hooks/useDiscoveryManagers';
import { useDiscoveryPromoters } from '@/hooks/useDiscoveryPromoters';
import { useDiscoveryVenues } from '@/hooks/useDiscoveryVenues';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ManagerCard } from '@/components/manager/ManagerCard';
import { PromotorCard } from '@/components/promoter/PromotorCard';
import { VenueCard } from '@/components/venue/VenueCard';

const roleToTitle: Record<string, string> = {
  artist: 'Artistas',
  manager: 'Managers',
  promoter: 'Promotores',
  venue: 'Salas',
};

export default function DiscoveryCategory() {
  const { category, role } = useParams();
  // Selección dinámica de hook y componente según el rol
  let data = [];
  let loading = false;
  let CardComponent: any = null;
  if (role === 'artist') {
    const { populares, destacados, resto, loading: l } = useDiscoveryArtists();
    loading = l;
    if (category === 'populares') data = populares;
    else if (category === 'destacados') data = destacados;
    else data = resto;
    CardComponent = ArtistCard;
  } else if (role === 'manager') {
    const { populares, destacados, resto, loading: l } = useDiscoveryManagers();
    loading = l;
    if (category === 'populares') data = populares;
    else if (category === 'destacados') data = destacados;
    else data = resto;
    CardComponent = ManagerCard;
  } else if (role === 'promoter') {
    const { populares, destacados, resto, loading: l } = useDiscoveryPromoters();
    loading = l;
    if (category === 'populares') data = populares;
    else if (category === 'destacados') data = destacados;
    else data = resto;
    CardComponent = PromotorCard;
  } else if (role === 'venue') {
    const { populares, destacados, resto, loading: l } = useDiscoveryVenues();
    loading = l;
    if (category === 'populares') data = populares;
    else if (category === 'destacados') data = destacados;
    else data = resto;
    CardComponent = VenueCard;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {roleToTitle[role || 'artist']} - {category}
      </h1>
      {loading ? (
        <div className="text-center py-10">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((item: any) => (
            <CardComponent key={item.id} {...{ [role]: item }} />
          ))}
        </div>
      )}
    </div>
  );
}
