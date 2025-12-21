import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useUpdateRequestStatus, useCreateBookingRequest } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RequestCard } from '@/components/booking/RequestCard';
import { RequestDetailModal } from '@/components/booking/RequestDetailModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSentRequests } from '@/lib/requests';
import { useEffect, useCallback } from 'react';
import { getInterestedByVenue, Interested } from '@/lib/interested';
import { updateInterestedStatus } from '@/lib/interested';
import { useQuery } from '@tanstack/react-query';
import { Clock, Check, Loader2, HelpCircle, X } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';


const VenueRequests = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);



  // Acción editar (abre modal de edición, placeholder)
  const handleEdit = (request) => {
    setEditRequest(request);
    setEditModalOpen(true);
    alert('Funcionalidad de editar: aquí se abriría un modal para editar la solicitud.');
  };

  // Contratar interesado: crea solicitud de booking
  const { mutate: createBookingRequest } = useCreateBookingRequest();
  const handleHireInterested = async (interested: Interested) => {
    if (!interested || !interested.artist || !authUser) return;
    // Tomar datos actualizados del perfil del venue
    const venueProfile = authUser;
    createBookingRequest({
      artistId: interested.artist.id,
      eventDate: interested.date,
      eventLocation: venueProfile.address || venueProfile.name || '',
      eventType: 'Contratación',
      offeredPrice: interested.price || 0,
      nombreLocal: venueProfile.name || '',
      ciudadLocal: venueProfile.city || '',
      message: `Solicitud generada desde interesado (ID: ${interested.id})`
    });
    // Opcional: actualizar estado a 'accepted' si lo requiere el flujo
    // await updateInterestedStatus(interested.id, 'accepted');
    refetchInterested();
  };

  // Rechazar interesado: actualiza estado a 'rejected'
  const handleRejectInterested = async (interested: Interested) => {
    if (!interested) return;
    await updateInterestedStatus(interested.id, 'rejected');
    refetchInterested();
  };

  const openDetailModal = (request: any) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };
  const { user: authUser, token } = useAuth();
  const { data: requests = [], isLoading } = useSentRequests();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  // Usar React Query para interesados
  const {
    data: interested = [],
    isLoading: loadingInterested,
    refetch: refetchInterested
  } = useQuery({
    queryKey: ['interested', authUser?.id],
    queryFn: () => authUser?.id ? getInterestedByVenue(Number(authUser.id), token) : [],
    enabled: !!authUser?.id && !!token,
  });

  // Filtrado por nombre de artista y fecha
  const filterRequests = (arr) => arr.filter(r => {
    const artistName = r.artist?.name?.toLowerCase() || '';
    const matchesName = artistName.includes(search.toLowerCase());
    const matchesDate = date ? (r.date && r.date.startsWith(date)) : true;
    return matchesName && matchesDate;
  });

  const pendingRequests = filterRequests(requests.filter(r => r.status === 'Pending'));
  const acceptedRequests = filterRequests(requests.filter(r => r.status === 'Accepted'));
  const rejectedRequests = filterRequests(requests.filter(r => r.status === 'Rejected'));

  // Mutaciones para cancelar y reenviar solicitud
  const { mutateAsync: updateRequestStatus } = useUpdateRequestStatus();
  const { mutate: resendBookingRequest } = useCreateBookingRequest();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<any>(null);

  // Acción cancelar
  const handleCancel = async (id) => {
    setIsUpdating(true);
    try {
      await updateRequestStatus({ id, status: 'Rejected' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Acción reenviar (crea una nueva solicitud con los mismos datos)
  const handleResend = (request) => {
    if (!request) return;
    resendBookingRequest({
      artistId: request.artistId,
      eventDate: request.eventDate,
      eventLocation: request.eventLocation,
      eventType: request.eventType,
      offeredPrice: request.offeredPrice,
      message: request.message || '',
    });
  };
  const { id } = useParams();

  // Comprobación de seguridad: solo el dueño puede ver sus solicitudes
  if (id && authUser && String(authUser.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const localNav = [
    { to: `/venue/${id}/discover`, label: 'Inicio' },
    { to: `/venue/${id}/dashboard`, label: 'Panel de datos' },
    { to: `/venue/${id}/profile`, label: 'Mi perfil' },
    { to: `/venue/${id}/calendar/`, label: 'Calendario' },
    { to: `/venue/${id}/requests`, label: 'Solicitudes' },
  ];

  // Exportar a CSV
  const exportToCSV = () => {
    const allRequests = [...pendingRequests, ...acceptedRequests];
    if (allRequests.length === 0) return;
    const headers = [
      'ID', 'Artista', 'Fecha', 'Estado', 'Precio', 'Mensaje'
    ];
    const rows = allRequests.map(r => [
      r.id,
      r.artist?.name || '',
      r.eventDate || '',
      r.status,
      r.offeredPrice,
      r.message ? r.message.replace(/\n/g, ' ') : ''
    ]);
    const csvContent = [headers, ...rows]
      .map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'solicitudes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <HeaderLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin w-12 h-12 text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Cargando solicitudes...</p>
        </div>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout profileTabs={localNav}>
      <div className="space-y-6">
        {/* ...eliminado resumen superior duplicado... */}
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> Ayuda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-bold mb-2">¿Necesitas ayuda?</h2>
              <p className="mb-2">Si tienes problemas con las solicitudes o necesitas soporte, contáctanos:</p>
              <ul className="text-sm space-y-1">
                <li>Email: <a href="mailto:soporte@tusitio.com" className="text-primary underline">soporte@tusitio.com</a></li>
                <li>Teléfono: <span className="text-primary">+34 600 000 000</span></li>
              </ul>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Mis Solicitudes
          </h1>
          <p className="text-muted-foreground">
            Revisa el estado de las solicitudes que has enviado a artistas.
          </p>
        </div>

        {/* Filtros de búsqueda y exportar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-end">
          <Input
            placeholder="Buscar por artista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={exportToCSV} variant="outline" className="ml-0 md:ml-4 mt-2 md:mt-0">
            Exportar a Excel
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="gap-2 bg-yellow-100/80 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 data-[state=active]:bg-yellow-200/80 data-[state=active]:text-yellow-900">
              <Clock className="w-4 h-4 text-yellow-500" />
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="gap-2 bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300 data-[state=active]:bg-green-200/80 data-[state=active]:text-green-900">
              <Check className="w-4 h-4 text-green-600" />
              Aceptadas ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2 bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 data-[state=active]:bg-red-200/80 data-[state=active]:text-red-900">
              <X className="w-4 h-4 text-red-500" />
              Canceladas ({rejectedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="interested" className="gap-2 bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 data-[state=active]:bg-blue-200/80 data-[state=active]:text-blue-900">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Interesados ({interested.length})
            </TabsTrigger>
          </TabsList>
        <TabsContent value="accepted">
          {/* ...resto de código... */}
        </TabsContent>
        {/* Apartado de Interesados */}
        {/* Pestañas de interesados */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500" /> Interesados
          </h2>
          <Tabs defaultValue="pending-interested" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending-interested" className="gap-2 bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 data-[state=active]:bg-blue-200/80 data-[state=active]:text-blue-900">
                Pendientes ({interested.filter(i => i.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="rejected-interested" className="gap-2 bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 data-[state=active]:bg-red-200/80 data-[state=active]:text-red-900">
                Rechazados ({interested.filter(i => i.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>
           
            <TabsContent value="pending-interested">
              {loadingInterested ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh]">
                  <Loader2 className="animate-spin w-10 h-10 text-primary mb-2" />
                  <p className="text-muted-foreground">Cargando interesados...</p>
                </div>
              ) : interested.filter(i => i.status === 'pending').length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {interested.filter(i => i.status === 'pending').map((item) => (
                    <div key={item.id} className="rounded-xl bg-white/70 dark:bg-zinc-900/60 shadow p-4 flex flex-col gap-2 border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{item.artist?.name || 'Artista'}</span>
                        {item.manager && (
                          <span className="text-xs text-muted-foreground">(Manager: {item.manager?.name})</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>Fecha: <b>{item.date}</b></span>
                        {item.price && <span>Oferta: <b>{item.price}€</b></span>}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="capitalize">{item.status}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default" onClick={() => handleHireInterested(item)}>
                          Contratar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectInterested(item)}>
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay interesados pendientes</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="rejected-interested">
              {loadingInterested ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh]">
                  <Loader2 className="animate-spin w-10 h-10 text-primary mb-2" />
                  <p className="text-muted-foreground">Cargando interesados...</p>
                </div>
              ) : interested.filter(i => i.status === 'rejected').length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {interested.filter(i => i.status === 'rejected').map((item) => (
                    <div key={item.id} className="rounded-xl bg-white/70 dark:bg-zinc-900/60 shadow p-4 flex flex-col gap-2 border border-red-200 dark:border-red-900">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-700 dark:text-red-300">{item.artist?.name || 'Artista'}</span>
                        {item.manager && (
                          <span className="text-xs text-muted-foreground">(Manager: {item.manager?.name})</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>Fecha: <b>{item.date}</b></span>
                        {item.price && <span>Oferta: <b>{item.price}€</b></span>}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="capitalize">{item.status}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay interesados rechazados</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
          <TabsContent value="rejected">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {rejectedRequests.length > 0 ? (
                rejectedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="relative rounded-xl bg-white/70 dark:bg-zinc-900/60 shadow-sm hover:shadow-lg focus-within:shadow-lg hover:bg-white/90 dark:hover:bg-zinc-900/80 ring-0 hover:ring-2 focus-within:ring-2 ring-destructive/30 border-b border-gray-300 dark:border-white/20 last:border-b-0 last:pb-0 transition-colors duration-200"
                    tabIndex={0}
                  >
                    {/* Icono contextual grande */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
                      <X className="w-12 h-12 text-red-500 bg-white dark:bg-zinc-900 rounded-full shadow-lg p-2 border-4 border-red-100 dark:border-red-900" />
                    </div>
                    <div className="pt-8">
                      <RequestCard
                        request={request}
                        isReceiver={false}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default" onClick={() => openDetailModal(request)} className="flex items-center gap-1 animate-pulse focus:animate-none">
                          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m6 0l-3-3m3 3l-3 3" /></svg>
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <X className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay solicitudes canceladas</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="relative group pb-4 border-b border-gray-300 dark:border-white/20 last:border-b-0 last:pb-0 transition-colors duration-200 rounded-xl bg-white/70 dark:bg-zinc-900/60 hover:bg-white/90 dark:hover:bg-zinc-900/80 ring-0 hover:ring-2 focus-within:ring-2 ring-primary/30"
                    tabIndex={0}
                  >
                    {/* Icono contextual grande */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
                      <Clock className="w-12 h-12 text-yellow-400 bg-white dark:bg-zinc-900 rounded-full shadow-lg p-2 border-4 border-yellow-100 dark:border-yellow-900" />
                    </div>
                    <div className="pt-8">
                      <RequestCard
                        request={request}
                        isReceiver={false}
                        onViewDetails={() => openDetailModal(request)}
                      />
                      {/* Botones ocultos y desplegables al hover */}
                      <div className="overflow-hidden">
                        <div className="rounded-lg px-2 py-2 flex justify-center gap-2 bg-white/80 dark:bg-zinc-900/60 transform -translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(request)} className="transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 hover:bg-primary/10 min-w-[110px]">
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCancel(request.id)} disabled={isUpdating} className="transition-colors focus-visible:ring-2 focus-visible:ring-red-400/60 hover:bg-red-100 dark:hover:bg-red-900/30 min-w-[110px]">
                            Cancelar
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleResend(request)} className="transition-colors focus-visible:ring-2 focus-visible:ring-secondary/60 hover:bg-secondary/10 min-w-[110px]">
                            Reenviar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No tienes solicitudes pendientes</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accepted">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {acceptedRequests.length > 0 ? (
                acceptedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="relative rounded-xl bg-white/70 dark:bg-zinc-900/60 shadow-sm hover:shadow-lg focus-within:shadow-lg hover:bg-white/90 dark:hover:bg-zinc-900/80 ring-0 hover:ring-2 focus-within:ring-2 ring-primary/30 transition-colors duration-200"
                    tabIndex={0}
                  >
                    {/* Icono contextual grande */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 flex justify-center w-full">
                      <Check className="w-12 h-12 text-green-500 bg-white dark:bg-zinc-900 rounded-full shadow-lg p-2 border-4 border-green-100 dark:border-green-900" />
                    </div>
                    <div className="pt-8">
                      {/* Estado ya mostrado en RequestCard */}
                      <RequestCard
                        request={request}
                        isReceiver={false}
                        onViewDetails={() => openDetailModal(request)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="default" onClick={() => openDetailModal(request)} className="flex items-center gap-1 animate-pulse focus:animate-none">
                          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m6 0l-3-3m3 3l-3 3" /></svg>
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <Check className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay solicitudes aceptadas</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
      <RequestDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        request={selectedRequest}
        onCancel={selectedRequest ? () => handleCancel(selectedRequest.id) : undefined}
        onEdit={selectedRequest ? () => handleEdit(selectedRequest) : undefined}
        onResend={selectedRequest ? () => handleResend(selectedRequest) : undefined}
      />
    </HeaderLayout>
  );
}

export default VenueRequests;
