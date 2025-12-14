import { BookingRequest, Artist, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, Clock, MessageSquare, Check, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ArtistLike = (Partial<Artist> & Partial<User> & { managerId?: string | number });

interface RequestCardProps {
  request: BookingRequest;
  // Artist info is optional and may be partial (e.g., from Auth user)
  artist?: ArtistLike;
  isReceiver?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onNegotiate?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onResend?: () => void;
  isProcessing?: boolean;
}

const statusConfig: Record<string, { label: string; variant: 'warning' | 'artist' | 'success' | 'destructive' }> = {
  'Pending': { label: 'Pendiente', variant: 'warning' as const },
  'Accepted': { label: 'Aceptada', variant: 'success' as const },
  'Rejected': { label: 'Rechazada', variant: 'destructive' as const },
  // Legacy/fallback mappings
  pending: { label: 'Pendiente', variant: 'warning' as const },
  accepted: { label: 'Aceptada', variant: 'success' as const },
  rejected: { label: 'Rechazada', variant: 'destructive' as const },
  negotiating: { label: 'Negociando', variant: 'artist' as const },
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
  isProcessing = false,
}: RequestCardProps) {
  const status = statusConfig[request.status];

  // If sender (venue/promoter), show the artist info from request
  // If receiver (artist), show the requester info
  const displayPerson = isReceiver 
    ? request.requester 
    : request.artist || artist;
  
  const displayName = isReceiver
    ? request.requester?.name
    : (request.artist?.nickName || request.artist?.name || artist?.nickName || artist?.name);

  return (
    <Card variant="gradient" className="rounded-2xl shadow-lg hover:shadow-2xl border border-border/60 transition-all duration-300 bg-white/90 dark:bg-background/80">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {displayPerson && (
              <Avatar className="h-16 w-16 border-2 border-primary/60 shadow-lg shrink-0">
                <AvatarImage src={displayPerson.avatar || ''} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/80 to-secondary/80 text-white">
                  {displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {displayName || 'Usuario'}
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate">{request.eventType}</p>
            </div>
          </div>
          <Badge variant={status.variant} className="shrink-0 text-2xs">{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{format(new Date(request.eventDate), "d MMM, yyyy", { locale: es })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{request.eventLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
          <span className="text-xs text-muted-foreground">Oferta</span>
          <span className="text-base font-bold text-primary">
            €{request.offeredPrice?.toLocaleString() || '0'}
          </span>
        </div>

        {request.message && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="line-clamp-2 leading-relaxed">{request.message}</p>
          </div>
        )}

        <div className="flex gap-2 pt-1">
          {isReceiver && request.status === 'Pending' && (
            <>
              <Button size="sm" variant="gradient" className="flex-1 h-8" onClick={onAccept} disabled={isProcessing}>
                <Check className="w-3.5 h-3.5 mr-1" />
                Aceptar
              </Button>
              <Button size="sm" variant="outline" className="h-8" onClick={onNegotiate}>
                <MessageSquare className="w-3.5 h-3.5" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onReject} disabled={isProcessing}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </>
          )}

          {!isReceiver && (
            <Button size="sm" variant="outline" className="flex-1 h-8" onClick={onViewDetails}>
              Ver detalles
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
