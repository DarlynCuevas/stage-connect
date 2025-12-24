import React from 'react';

interface CardItemProps {
  item: any;
  onClick?: () => void;
  selected?: boolean;
}

const CardItemRequest: React.FC<CardItemProps> = ({ item, onClick, selected }) => {
  // Determinar si es contratación o interesado
  const isBooking = !!item.eventDate || item.type === 'Contratación' || item.eventName;
  // Para interesados, puede venir como item.artist o item.manager
  // Prioridad: artista.user > artista > manager > user > name
  const avatar = item.artist?.user?.avatar || item.artist?.avatar || item.manager?.avatar || item.avatar || item.user?.avatar || null;
  const name = item.artist?.user?.name || item.artist?.name || item.manager?.name || item.name || item.user?.name || '';
  return (
    <div
      className={`cursor-pointer px-5 py-4 mb-3 rounded-xl border border-border shadow-sm bg-background hover:bg-muted transition flex items-center gap-4 ${selected ? 'ring-2 ring-primary bg-muted' : ''}`}
      onClick={onClick}
    >
      {/* Avatar o icono */}
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg text-primary shadow">
        {avatar ? (
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          (name || '?')[0]
        )}
      </div>
      {/* Info principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base text-foreground truncate">{item.eventName || name}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate flex flex-wrap gap-2 items-center">
          {name && <span className="font-medium text-primary">{name}</span>}
          {/* Contratación: fechas y resumen */}
          {isBooking && item.eventDate && (
            <span className="ml-2">
              <span className="font-semibold">Enviado:</span> {new Date(item.eventDate).toLocaleDateString()}
            </span>
          )}
          {isBooking && item.eventDate && (
            <span className="ml-2">
              <span className="font-semibold">Para el día:</span> {new Date(item.eventDate).toLocaleDateString()}
            </span>
          )}
          {/* Interesados: fecha de interés */}
          {!isBooking && item.date && (
            <span className="ml-2">
              <span className="font-semibold">Se solicita artista para el día:</span> {new Date(item.date).toLocaleDateString()}
            </span>
          )}
          {item.summary && <span className="ml-2">{item.summary}</span>}
        </div>
      </div>
      {/* Mostrar precio según tipo */}
      {isBooking && item.offeredPrice && (
        <div className="ml-4 text-right">
          <span className="block text-xs text-muted-foreground">Caché artista</span>
          <span className="font-bold text-foreground">{item.offeredPrice}€</span>
        </div>
      )}
      {!isBooking && item.price && (
        <div className="ml-4 text-right">
          <span className="block text-xs text-muted-foreground">Precio ofertado</span>
          <span className="font-bold text-foreground">{item.price}€</span>
        </div>
      )}
    </div>
  );
};

export default CardItemRequest;
