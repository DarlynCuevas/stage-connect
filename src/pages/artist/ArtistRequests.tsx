import { useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { RequestCard } from '@/components/booking/RequestCard';
import { ManagerRequestCard } from '@/components/manager/ManagerRequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArtists } from '@/data/mockData';
import { BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useArtistRequests, useSentRequests, useUpdateRequestStatus } from '@/lib/requests';
import { useInterestedByArtist } from '@/lib/interested';
import { useReceivedManagerRequests, useUpdateManagerRequestStatus } from '@/lib/manager-requests';
import { MessageSquare, Clock, Check, X, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ArtistRequests() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  if (id && authUser && String(authUser.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const { data: requests = [], isLoading } = useArtistRequests();
  const { data: sentRequests = [] } = useSentRequests();
  const { data: managerRequests = [] } = useReceivedManagerRequests();
  const artist = mockArtists[0];
  const { toast } = useToast();
  const updateStatusMutation = useUpdateRequestStatus();
  const updateManagerRequestStatus = useUpdateManagerRequestStatus();
  const interestedQuery = useInterestedByArtist(authUser?.id);
  const interestedList = interestedQuery.data || [];

  const handleAccept = useCallback(async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: requestId, status: 'Accepted' });
      toast({
        title: '¡Contratación aceptada!',
        description: 'Has confirmado la solicitud de este evento.',
        duration: 4000,
      });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateStatusMutation, toast]);

  const handleReject = useCallback(async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: requestId, status: 'Rejected' });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateStatusMutation]);

  const handleNegotiate = (requestId: string) => {
    toast({
      title: 'Modo negociación',
      description: 'Ahora puedes enviar una contraoferta.',
      duration: 4000,
    });
  };

  // Recibidas: todas las solicitudes recibidas
  const receivedRequests = requests;
  // Enviadas: todas las solicitudes enviadas
  const allSentRequests = sentRequests;
  // Pendientes: todas las solicitudes (recibidas o enviadas) en estado Pending
  const pendingRequests = [
    ...requests.filter(r => r.status === 'Pending'),
    ...sentRequests.filter(r => r.status === 'Pending')
  ];
  // Completadas: todas las solicitudes (recibidas o enviadas) en estado Accepted o Rejected
  const completedRequests = [
    ...requests.filter(r => ['Accepted', 'Rejected'].includes(r.status)),
    ...sentRequests.filter(r => ['Accepted', 'Rejected'].includes(r.status))
  ];
  const pendingManagerRequests = managerRequests.filter((r: any) => r.status === 'Pending');
  const completedManagerRequests = managerRequests.filter((r: any) => ['Accepted', 'Rejected'].includes(r.status));

  return (

    <HeaderLayout>
      <div className="space-y-6">
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="h-48 lg:h-64">
            <img
              src={`https://picsum.photos/1200/400?random=1}`}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
          {/* Rating sobre la imagen, esquina inferior derecha */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full shadow-lg">
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Solicitudes de Contratación
          </h1>
          <p className="text-muted-foreground">
            Gestiona las propuestas que recibes de locales y promotores.
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="interest" className="gap-2">
              <User className="w-4 h-4 text-primary" />
              Ofertas de interés (0)
            </TabsTrigger>
            <TabsTrigger value="received" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Recibidas ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <X className="w-4 h-4" />
              Enviadas ({allSentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Check className="w-4 h-4" />
              Completadas ({completedRequests.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="interest">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Aquí se mostrarán las ofertas de interés. Reemplaza el array por el hook real cuando esté disponible. */}
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary" />
                <p className="text-lg">No tienes ofertas de interés por ahora</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="received">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                    isReceiver
                    onAccept={() => handleAccept(String(request.id))}
                    onReject={() => handleReject(String(request.id))}
                    onNegotiate={() => handleNegotiate(String(request.id))}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tienes solicitudes recibidas</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                    isReceiver={!!requests.find(r => r.id === request.id)}
                    onAccept={() => handleAccept(String(request.id))}
                    onReject={() => handleReject(String(request.id))}
                    onNegotiate={() => handleNegotiate(String(request.id))}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tienes solicitudes pendientes</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allSentRequests.length > 0 ? (
                allSentRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <X className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tienes solicitudes enviadas</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedRequests.length > 0 ? (
                completedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Check className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay solicitudes completadas</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

     
      {/* Sección de Ofertas de interés */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Ofertas de interés
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {interestedQuery.isLoading ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary" />
              <p className="text-lg">Cargando ofertas de interés...</p>
            </div>
          ) : interestedList.length > 0 ? (
            interestedList.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/70 dark:bg-zinc-900/60 shadow-sm p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{item.venue?.name || 'Local'}</span>
                  <span className="text-xs text-muted-foreground ml-2">{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Caché ofertado:</span>
                  <span className="font-bold text-primary">{item.price ? `€${item.price}` : 'Sin caché'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Estado:</span>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{item.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <User className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary" />
              <p className="text-lg">No tienes ofertas de interés por ahora</p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Solicitudes de Representación */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-role-manager" />
          Solicitudes de Representación
        </h2>
        <Tabs defaultValue="pending-manager" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending-manager" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pendingManagerRequests.length})
            </TabsTrigger>
            <TabsTrigger value="assigned-manager" className="gap-2">
              <Check className="w-4 h-4" />
              Asignada ({completedManagerRequests.filter((r: any) => r.status === 'Accepted').length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending-manager">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {pendingManagerRequests.length > 0 ? (
                pendingManagerRequests.map((request: any) => (
                  <ManagerRequestCard
                    key={request.id}
                    request={request}
                    onAccept={() => updateManagerRequestStatus.mutate({ requestId: request.id, status: 'Accepted' })}
                    onReject={() => updateManagerRequestStatus.mutate({ requestId: request.id, status: 'Rejected' })}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No tienes solicitudes de representación pendientes</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="assigned-manager">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedManagerRequests.filter((r: any) => r.status === 'Accepted').length > 0 ? (
                completedManagerRequests.filter((r: any) => r.status === 'Accepted').map((request: any) => (
                  <ManagerRequestCard
                    key={request.id}
                    request={request}
                    isAssigned={true}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No tienes manager asignado actualmente</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
      </HeaderLayout >
  );
}
