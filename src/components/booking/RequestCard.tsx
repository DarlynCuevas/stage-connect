import { BookingRequest, Artist } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, MessageSquare, Check, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RequestCardProps {
  request: BookingRequest;
  artist?: Artist;
  isReceiver?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onNegotiate?: () => void;
  onViewDetails?: () => void;
}

const statusConfig = {
  pending: { label: 'Pendiente', variant: 'muted' as const },
  negotiating: { label: 'Negociando', variant: 'artist' as const },
  accepted: { label: 'Aceptada', variant: 'success' as const },
  rejected: { label: 'Rechazada', variant: 'destructive' as const },
  confirmed: { label: 'Confirmada', variant: 'success' as const },
};

export function RequestCard({
  request,
  artist,
  isReceiver = false,
  onAccept,
  onReject,
  onNegotiate,
  onViewDetails,
}: RequestCardProps) {
  const status = statusConfig[request.status];

  return (
    <Card variant="outline" className="hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {artist && (
              <Avatar className="h-10 w-10 border border-border shrink-0">
                <AvatarImage src={artist.avatar} />
                <AvatarFallback className="text-sm bg-secondary">{artist.stageName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground truncate">
                {artist?.stageName || 'Artista'}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{request.eventType}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="shrink-0">{status.label}</Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(request.eventDate), "d MMM, yyyy", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{request.eventLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 mb-3">
          <span className="text-sm text-muted-foreground">Oferta</span>
          <span className="text-lg font-semibold text-primary">
            €{request.offeredPrice.toLocaleString()}
          </span>
        </div>

        {request.message && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="line-clamp-2">{request.message}</p>
          </div>
        )}

        <div className="flex gap-2">
          {isReceiver && request.status === 'pending' && (
            <>
              <Button size="sm" className="flex-1 h-9" onClick={onAccept}>
                <Check className="w-3.5 h-3.5 mr-1" />
                Aceptar
              </Button>
              <Button size="sm" variant="outline" className="h-9" onClick={onNegotiate}>
                <MessageSquare className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onReject}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          {isReceiver && request.status === 'negotiating' && (
            <Button size="sm" className="flex-1 h-9" onClick={onViewDetails}>
              Ver conversación
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}

          {!isReceiver && (
            <Button size="sm" variant="outline" className="flex-1 h-9" onClick={onViewDetails}>
              Ver detalles
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
