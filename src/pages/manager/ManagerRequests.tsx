import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestCard } from '@/components/booking/RequestCard';
import { ManagerRequestCard } from '@/components/manager/ManagerRequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useManagerRequests, useSentRequests, useUpdateRequestStatus } from '@/lib/requests';
import { useManagedArtists } from '@/lib/users';
import { useAuth } from '@/contexts/AuthContext';
import { useReceivedManagerRequests, useUpdateManagerRequestStatus } from '@/lib/manager-requests';
import { Clock, Check, X, MessageSquare, User, Users } from 'lucide-react';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

import { useState, useMemo } from 'react';

export default function ManagerRequests() {
  const { data: managerRequests = [], isLoading } = useManagerRequests();
  const { data: sentRequests = [] } = useSentRequests();
  const { data: managerRequestsRepresentation = [] } = useReceivedManagerRequests();
  const { user } = useAuth();
  const { data: allArtists = [] } = useManagedArtists();
  const updateStatusMutation = useUpdateRequestStatus();
  const updateManagerRequestStatus = useUpdateManagerRequestStatus();
  const [selectedArtistId, setSelectedArtistId] = useState<string | 'all'>('all');

  // Artistas representados por el manager
  console.log('allArtists:', allArtists);
  console.log('manager user id:', user?.id);
  // Ya no filtramos aquí, el backend solo devuelve los artistas gestionados
  const managedArtists = allArtists || [];

  // Filtrar solicitudes por artista seleccionado
  const filteredManagerRequests = useMemo(() => {
    if (selectedArtistId === 'all') return managerRequests;
    return managerRequests.filter((r: any) => String(r.artist?.user_id) === String(selectedArtistId));
  }, [managerRequests, selectedArtistId]);
  const filteredSentRequests = useMemo(() => {
    if (selectedArtistId === 'all') return sentRequests.filter((r: any) => r.requester?.role === 'Manager');
    return sentRequests.filter((r: any) => r.requester?.role === 'Manager' && String(r.artist?.user_id) === String(selectedArtistId));
  }, [sentRequests, selectedArtistId]);

  // Contratación
  const receivedRequests = filteredManagerRequests;
  const allSentRequests = filteredSentRequests;
  const pendingRequests = [
    ...receivedRequests.filter((r: any) => r.status === 'Pending'),
    ...allSentRequests.filter((r: any) => r.status === 'Pending')
  ];
  const completedRequests = [
    ...receivedRequests.filter((r: any) => ['Accepted', 'Rejected'].includes(r.status)),
    ...allSentRequests.filter((r: any) => ['Accepted', 'Rejected'].includes(r.status))
  ];

  // Representación
  const pendingManagerRequests = managerRequestsRepresentation.filter((r: any) => r.status === 'Pending');
  const completedManagerRequests = managerRequestsRepresentation.filter((r: any) => ['Accepted', 'Rejected'].includes(r.status));

  return (
    <HeaderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Solicitudes de contratación</h1>
          <p className="text-muted-foreground">Solicitudes que llegan a tus artistas representados. Puedes aceptarlas o rechazarlas en su nombre.</p>
        </div>

        {/* Filtro de artista visualmente mejorado */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-base font-semibold text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Filtrar por artista
          </span>
          <div className="relative">
            <select
              className="appearance-none border border-border bg-white dark:bg-background rounded-lg px-4 py-2 pr-8 text-sm shadow focus:outline-none focus:ring-2 focus:ring-primary/40 transition min-w-[160px]"
              value={selectedArtistId}
              onChange={e => setSelectedArtistId(e.target.value)}
            >
              <option value="all">Todos</option>
              {managedArtists.map((artist: any) => (
                <option key={artist.user_id} value={artist.user_id}>{artist.nickName || artist.name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="received" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Recibidas ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pendingRequests.length})
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

          <TabsContent value="received">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request: any) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={request.artist}
                    isReceiver
                    onAccept={() => updateStatusMutation.mutateAsync({ id: String(request.id), status: 'Accepted' })}
                    onReject={() => updateStatusMutation.mutateAsync({ id: String(request.id), status: 'Rejected' })}
                    onNegotiate={() => {}}
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
                pendingRequests.map((request: any) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={request.artist}
                    isReceiver={!!managerRequests.find((r: any) => r.id === request.id)}
                    onAccept={() => updateStatusMutation.mutateAsync({ id: String(request.id), status: 'Accepted' })}
                    onReject={() => updateStatusMutation.mutateAsync({ id: String(request.id), status: 'Rejected' })}
                    onNegotiate={() => {}}
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
                allSentRequests.map((request: any) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={request.artist}
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
                completedRequests.map((request: any) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={request.artist}
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
                    <p>No tienes artista asignado actualmente</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </HeaderLayout>
  );
}
