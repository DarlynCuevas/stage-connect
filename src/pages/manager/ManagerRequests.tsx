import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useManagerRequests, useUpdateRequestStatus } from '@/lib/requests';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, Mail, Calendar, MapPin, DollarSign } from 'lucide-react';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

export default function ManagerRequests() {
  const { data: managerRequests = [], isLoading } = useManagerRequests();
  const updateStatusMutation = useUpdateRequestStatus();

  const handleUpdate = async (id: number | string, status: 'Accepted' | 'Rejected') => {
    await updateStatusMutation.mutateAsync({ id: String(id), status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'Accepted':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
      case 'Rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <HeaderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Solicitudes de contratación</h1>
          <p className="text-muted-foreground">Solicitudes que llegan a tus artistas representados. Puedes aceptarlas o rechazarlas en su nombre.</p>
        </div>

        {isLoading ? (
          <Card variant="gradient">
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">Cargando solicitudes...</p>
            </CardContent>
          </Card>
        ) : managerRequests.length === 0 ? (
          <Card variant="gradient">
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">No hay solicitudes pendientes</p>
            </CardContent>
          </Card>
        ) : (
          managerRequests.map((request: any) => (
            <Card key={request.id} variant="gradient">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.requester?.avatar} />
                    <AvatarFallback>{request.requester?.name?.charAt(0) || 'R'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs text-muted-foreground">Para: {request.artist?.name}</p>
                        <h3 className="font-semibold text-lg">{request.requester?.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {request.requester?.email}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(request.eventDate), "d 'de' MMMM, yyyy", { locale: es })}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {request.eventLocation}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {request.offeredPrice}</span>
                      <span className="text-xs">Tipo: {request.eventType}</span>
                    </div>

                    {request.message && (
                      <p className="mt-2 p-3 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                        “{request.message}”
                      </p>
                    )}

                    {request.status === 'Pending' && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdate(request.id, 'Accepted')}
                          disabled={updateStatusMutation.isPending}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdate(request.id, 'Rejected')}
                          disabled={updateStatusMutation.isPending}
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </HeaderLayout>
  );
}
