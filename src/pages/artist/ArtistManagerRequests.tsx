import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useReceivedManagerRequests,
  useSentManagerRequests,
  useUpdateManagerRequestStatus,
  useManagerRequestsRealtime,
} from '@/lib/manager-requests';
import { UserPlus, UserCheck, UserX, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ArtistManagerRequests() {
  useManagerRequestsRealtime();
  const { data: receivedRequests = [], isLoading: loadingReceived } = useReceivedManagerRequests();
  const { data: sentRequests = [], isLoading: loadingSent } = useSentManagerRequests();
  const updateStatusMutation = useUpdateManagerRequestStatus();

  const handleAccept = async (requestId: number) => {
    await updateStatusMutation.mutateAsync({ requestId, status: 'Accepted' });
  };

  const handleReject = async (requestId: number) => {
    await updateStatusMutation.mutateAsync({ requestId, status: 'Rejected' });
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
    <DashboardLayout noSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Solicitudes de Manager
          </h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de representación artística
          </p>
        </div>

        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">
              Recibidas ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Enviadas ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4 mt-6">
            {loadingReceived ? (
              <Card variant="gradient">
                <CardContent className="p-8">
                  <p className="text-center text-muted-foreground">Cargando...</p>
                </CardContent>
              </Card>
            ) : receivedRequests.length === 0 ? (
              <Card variant="gradient">
                <CardContent className="p-8">
                  <div className="text-center">
                    <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No tienes solicitudes recibidas</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              receivedRequests.map((request) => (
                <Card key={request.id} variant="gradient">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={
                            request.sender?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.sender?.id}`
                          }
                        />
                        <AvatarFallback>
                          {request.sender?.name?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{request.sender?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.sender?.email}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1 bg-role-manager/10 text-role-manager">
                              Manager
                            </Badge>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        {request.message && (
                          <p className="text-muted-foreground mb-3 p-3 rounded-lg bg-secondary/30">
                            "{request.message}"
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground mb-3">
                          Enviada el {format(new Date(request.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </p>

                        {request.status === 'Pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAccept(request.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Aceptar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserX className="w-4 h-4 mr-2" />
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
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 mt-6">
            {loadingSent ? (
              <Card variant="gradient">
                <CardContent className="p-8">
                  <p className="text-center text-muted-foreground">Cargando...</p>
                </CardContent>
              </Card>
            ) : sentRequests.length === 0 ? (
              <Card variant="gradient">
                <CardContent className="p-8">
                  <div className="text-center">
                    <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No has enviado ninguna solicitud</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((request) => (
                <Card key={request.id} variant="gradient">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={
                            request.receiver?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.receiver?.id}`
                          }
                        />
                        <AvatarFallback>
                          {request.receiver?.name?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg">{request.receiver?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {request.receiver?.email}
                            </p>
                            <Badge variant="secondary" className="text-xs mt-1 bg-role-manager/10 text-role-manager">
                              Manager
                            </Badge>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>

                        {request.message && (
                          <p className="text-muted-foreground mb-3 p-3 rounded-lg bg-secondary/30">
                            "{request.message}"
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Enviada el {format(new Date(request.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
