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
import { Clock, Check, Loader2, HelpCircle, X, Inbox } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ModalSolicitudContratacion from '@/components/calendar/ModalSolicitudContratacion';


const VenueRequests = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedInterested, setSelectedInterested] = useState<Interested | null>(null); // Nuevo estado



  // Acción editar (abre modal de edición, placeholder)
  const handleEdit = (request) => {
    setEditRequest(request);
    setEditModalOpen(true);
    alert('Funcionalidad de editar: aquí se abriría un modal para editar la solicitud.');
  };

  // Contratar interesado: ahora abre el modal en vez de enviar directamente
  const handleHireInterested = (interested: Interested) => {
    setSelectedInterested(interested);
    setModalOpen(true);
  };

  // Enviar solicitud desde el modal
  const { mutate: createBookingRequest } = useCreateBookingRequest();
  const handleSubmitContratacion = (data: {
    fecha: Date;
    oferta: number;
    tipoEvento: string;
    ubicacion: string;
    nombreLocal: string;
    ciudadLocal: string;
    mensaje?: string;
  }) => {
    if (!selectedInterested || !authUser) return;
    const artistId = selectedInterested.artist?.user_id ?? selectedInterested.artistId ?? selectedInterested.id;
    createBookingRequest({
      artistId: selectedInterested.artist?.user_id,
      eventDate: data.fecha.toISOString(),
      eventLocation: data.ubicacion,
      eventType: data.tipoEvento,
      offeredPrice: data.oferta,
      nombreLocal: data.nombreLocal,
      ciudadLocal: data.ciudadLocal,
      message: data.mensaje || '',
    });
    setModalOpen(false);
    setSelectedInterested(null);
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
    { to: `/venue/${id}/requests`, label: 'Solicitudes', badge: pendingRequests.length },
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
    <div className="space-y-6 max-w-full overflow-x-hidden px-1 sm:px-0">
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
      {/* --- Sección 1: Mis Solicitudes de contratación --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Check className="w-6 h-6 text-primary" /> Mis Solicitudes de contratación
        </h2>
        <p className="text-muted-foreground mb-4">Revisa el estado de las solicitudes que has enviado a artistas o managers.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-end w-full max-w-full">
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
        <Tabs defaultValue="pending" className="w-full max-w-full overflow-x-hidden">
          <TabsList className="mb-6">
            <TabsTrigger
              value="pending"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              <Clock className="w-4 h-4" />
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="accepted"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Aceptadas ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Canceladas ({rejectedRequests.length})
            </TabsTrigger>
            <TabsTrigger
              value="interested"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Interesados ({interested.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {/* ...contenido de pendientes... */}
          </TabsContent>
          <TabsContent value="accepted">
            {/* ...contenido de aceptadas... */}
          </TabsContent>
          <TabsContent value="rejected">
            {/* ...contenido de canceladas... */}
          </TabsContent>
          <TabsContent value="interested">
            {/* ...contenido de interesados... */}
          </TabsContent>
        </Tabs>
      </section>
      {/* --- Sección 2: Interesados --- */}
      <section className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Interesados
        </h2>
        <Tabs defaultValue="pending-interested" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger
              value="pending-interested"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              Pendientes ({interested.filter(i => i.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected-interested"
              className="gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent font-medium transition-colors"
            >
              Rechazados ({interested.filter(i => i.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending-interested">
            {/* ...contenido de interesados pendientes... */}
          </TabsContent>
          <TabsContent value="rejected-interested">
            {/* ...contenido de interesados rechazados... */}
          </TabsContent>
        </Tabs>
      </section>
      {/* --- Sección 3: Bandeja de solicitudes --- */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Inbox className="w-6 h-6 text-primary" /> Bandeja de solicitudes
        </h2>
        <p className="text-muted-foreground mb-6">Aquí verás las peticiones de artistas que quieren actuar en tu sala. Estas tarjetas muestran mensajes personalizados enviados por los artistas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-full">
          {/* Mock de tarjetas de solicitudes */}
          {[{
            id: 1,
            artist: { name: 'Luna Rivera', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
            message: '¡Hola! Me encantaría tocar en tu sala el próximo mes. Mi banda tiene un show enérgico y repertorio propio. ¿Podemos agendar una fecha?',
            date: '2025-01-15',
          }, {
            id: 2,
            artist: { name: 'Diego Torres', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
            message: 'Buenas, soy Diego. Estoy de gira y busco fechas en tu ciudad. ¿Te gustaría que toquemos en tu local? ¡Gracias!',
            date: '2025-02-10',
          }].map((req) => (
            <div key={req.id} className="rounded-2xl bg-white/90 dark:bg-zinc-900/70 shadow-lg p-6 flex flex-col gap-3 border border-gray-200 dark:border-zinc-800 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <img src={req.artist.avatar} alt={req.artist.name} className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{req.artist.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(req.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-gray-700 dark:text-gray-200 text-sm mb-2">{req.message}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="default">Ver perfil</Button>
                <Button size="sm" variant="outline">Responder</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    <RequestDetailModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      request={selectedRequest}
      onCancel={selectedRequest ? () => handleCancel(selectedRequest.id) : undefined}
      onEdit={selectedRequest ? () => handleEdit(selectedRequest) : undefined}
      onResend={selectedRequest ? () => handleResend(selectedRequest) : undefined}
    />
    <ModalSolicitudContratacion
      open={modalOpen}
      onClose={() => { setModalOpen(false); setSelectedInterested(null); }}
      fecha={selectedInterested ? (selectedInterested.date ? new Date(selectedInterested.date) : null) : null}
      cacheBase={selectedInterested?.artist?.basePrice || 0}
      allowNegotiation={false}
      nombreLocalDefault={authUser?.name || ''}
      ciudadLocalDefault={authUser?.city || ''}
      ubicacionDefault={authUser?.address || ''}
      fixedPrice={selectedInterested?.price}
      onSubmit={handleSubmitContratacion}
    />
  </HeaderLayout>
);}

export default VenueRequests;
