import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Check, X, MessageSquare } from 'lucide-react';

interface ManagerRequestCardProps {
  request: any;
  isAssigned?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  isProcessing?: boolean;
}

export function ManagerRequestCard({
  request,
  isAssigned = false,
  onAccept,
  onReject,
  isProcessing = false,
}: ManagerRequestCardProps) {
  const displayPerson = request.sender;
  const displayName = displayPerson?.name || 'Manager';
  const status = request.status;
  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'destructive' }> = {
    'Pending': { label: 'Pendiente', variant: 'warning' },
    'Accepted': { label: 'Asignada', variant: 'success' },
    'Rejected': { label: 'Rechazada', variant: 'destructive' },
  };
  return (
    <Card variant="gradient" className="rounded-2xl shadow-lg border border-border/60 bg-white/90 dark:bg-background/80">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-16 w-16 border-2 border-primary/60 shadow-lg shrink-0">
              <AvatarImage src={displayPerson?.avatar || ''} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/80 to-secondary/80 text-white">
                {displayName?.charAt(0) || 'M'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {displayName}
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate">Representación</p>
            </div>
          </div>
          <Badge variant={statusConfig[status]?.variant || 'warning'} className="shrink-0 text-2xs">
            {statusConfig[status]?.label || status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {request.message && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="line-clamp-2 leading-relaxed">{request.message}</p>
          </div>
        )}
        {!isAssigned && status === 'Pending' && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="gradient" className="flex-1 h-8" onClick={onAccept} disabled={isProcessing}>
              <Check className="w-3.5 h-3.5 mr-1" />
              Aceptar
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onReject} disabled={isProcessing}>
              <X className="w-3.5 h-3.5" />
              Rechazar
            </Button>
          </div>
        )}
        {isAssigned && status === 'Accepted' && (
          <div className="text-green-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" /> Manager asignado
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default ManagerRequestCard;
