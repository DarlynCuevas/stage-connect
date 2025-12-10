import { BookingRequest, Artist } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, Clock, MessageSquare, Check, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  pending: { label: 'Pendiente', variant: 'warning' as const },
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
    <Card variant="gradient" className="hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {artist && (
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={artist.avatar} />
                <AvatarFallback>{artist.stageName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <CardTitle className="text-lg">
                {artist?.stageName || 'Artista'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{request.eventType}</p>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(request.eventDate), "d 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{request.eventLocation}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <span className="text-sm text-muted-foreground">Oferta</span>
          <span className="text-lg font-bold text-primary">
            €{request.offeredPrice.toLocaleString()}
          </span>
        </div>

        {/* Message preview */}
        {request.message && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-2">{request.message}</p>
          </div>
        )}

        {/* Negotiation indicator */}
        {request.negotiations.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{request.negotiations.length} mensaje(s) en negociación</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isReceiver && request.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="gradient"
                className="flex-1"
                onClick={onAccept}
              >
                <Check className="w-4 h-4 mr-1" />
                Aceptar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onNegotiate}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Negociar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={onReject}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}

          {isReceiver && request.status === 'negotiating' && (
            <Button
              size="sm"
              variant="gradient"
              className="flex-1"
              onClick={onViewDetails}
            >
              Ver conversación
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {!isReceiver && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onViewDetails}
            >
              Ver detalles
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
