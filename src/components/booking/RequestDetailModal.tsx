import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, MapPin, Euro, MessageSquare, FileText, X } from 'lucide-react';

interface RequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: any; // Usa el tipo correcto si lo tienes
  onCancel?: () => void;
  onEdit?: () => void;
  onResend?: () => void;
  onDownloadPDF?: () => void;
}

export function RequestDetailModal({ open, onOpenChange, request, onCancel, onEdit, onResend, onDownloadPDF }: RequestDetailModalProps) {
  if (!request) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Detalle de la Solicitud
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Artista */}
          <div className="flex items-center gap-4 border-b pb-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={request.artist?.avatar} />
              <AvatarFallback>{request.artist?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-lg">{request.artist?.name}</div>
              {request.artist?.profileUrl && (
                <a href={request.artist.profileUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Ver perfil</a>
              )}
            </div>
            <Badge variant={request.status === 'Accepted' ? 'success' : request.status === 'Pending' ? 'warning' : 'destructive'}>
              {request.status}
            </Badge>
          </div>
          {/* Info evento */}
          <div className="grid grid-cols-2 gap-2 text-sm border-b pb-3">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {request.eventDate ? format(new Date(request.eventDate), 'dd/MM/yyyy HH:mm') : '-'}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {request.eventLocation || '-'}</div>
            <div className="flex items-center gap-2"><Euro className="w-4 h-4" /> €{request.offeredPrice?.toLocaleString() || '-'}</div>
            <div className="flex items-center gap-2"><Badge>{request.status}</Badge></div>
          </div>
          {/* Mensaje */}
          {request.message && (
            <div className="border-b pb-3">
              <div className="font-semibold mb-1 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Mensaje:</div>
              <p className="bg-muted rounded p-2 text-xs whitespace-pre-line">{request.message}</p>
            </div>
          )}
          {/* Historial simulado */}
          <div className="border-b pb-3">
            <div className="font-semibold mb-1 flex items-center gap-2"><FileText className="w-4 h-4" /> Historial:</div>
            <ul className="text-xs space-y-1">
              <li>05/12/2025 - Solicitud creada</li>
              <li>06/12/2025 - Mensaje enviado al artista</li>
              <li>07/12/2025 - Estado cambiado a "{request.status}"</li>
            </ul>
          </div>
          {/* Fechas */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div><span className="font-semibold">Creada:</span> {request.createdAt ? format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</div>
            <div><span className="font-semibold">Actualizada:</span> {request.updatedAt ? format(new Date(request.updatedAt), 'dd/MM/yyyy HH:mm') : '-'}</div>
          </div>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          {onCancel && <Button variant="destructive" onClick={onCancel}>Cancelar</Button>}
          {onEdit && <Button variant="outline" onClick={onEdit}>Editar</Button>}
          {onResend && <Button variant="secondary" onClick={onResend}>Reenviar</Button>}
          {onDownloadPDF && <Button variant="ghost" onClick={onDownloadPDF}>Descargar PDF</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
