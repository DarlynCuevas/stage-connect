import React from 'react';

// Utilidad para extraer el ID de un video de YouTube
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp =
    /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}


// Ejemplo de imágenes para la galería
const exampleImages = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    title: 'Concierto en Madrid',
  },
  {
    url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    title: 'Festival de Verano',
  },
  {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    title: 'Show en Barcelona',
  },
  {
    url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    title: 'Backstage',
  },
];

// Ejemplo de videos para la galería
const exampleVideos = [
  {
    url: 'https://www.youtube.com/watch?v=_QL21pgjeKo',
    title: 'Video de ejemplo 1',
  },
  {
    url: 'https://www.youtube.com/watch?v=pxlkt6Ruuc4',
    title: 'Video de ejemplo 2',
  },
  {
    url: 'https://www.youtube.com/watch?v=rf23Y1tjNRE',
    title: 'Video de ejemplo 3',
  },
  {
    url: 'https://www.youtube.com/watch?v=RzpVhudUuio',
    title: 'Video de ejemplo 4',
  },
];

const ArtistGallery: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto mt-8 space-y-12">
      {/* Sección de Fotos */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Fotos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exampleImages.map((img, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden shadow group bg-background relative">
              <img src={img.url} alt={img.title || 'Foto'} className="w-full h-40 object-cover" />
              <div className="p-3">
                <div className="font-semibold text-sm line-clamp-2">{img.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Videos */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-200 pb-2">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {exampleVideos.map((video, idx) => {
            const id = getYouTubeId(video.url);
            return (
              <div key={idx} className="rounded-lg overflow-hidden shadow group bg-background relative">
                <a href={`https://youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
                  <div className="relative">
                    <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} alt={video.title || 'Video'} className="w-full h-40 object-cover" />
                  </div>
                </a>
                <div className="p-3">
                  <div className="font-semibold text-sm line-clamp-2">{video.title || video.url}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArtistGallery;
