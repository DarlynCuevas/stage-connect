import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useUpdateRequestStatus, useCreateBookingRequest } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// import { RequestCard } from '@/components/booking/RequestCard';
import { RequestDetailModal } from '@/components/booking/RequestDetailModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSentRequests } from '@/lib/requests';
import { useEffect, useCallback } from 'react';
import { getInterestedByVenue, Interested } from '@/lib/interested';
import { updateInterestedStatus } from '@/lib/interested';
import { useQuery } from '@tanstack/react-query';
import { Clock, Check, Loader2, Send } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ModalSolicitudContratacion from '@/components/calendar/ModalSolicitudContratacion';
import CardItemRequest from '@/components/booking/CardItemRequest';
 // Asegúrate de tener este hook o el que corresponda


const TABS = [
  'Contratación',
  'Interesados',
]; // 'Bandeja' tab removed

// Dummy data para ejemplo visual
const dummyItems = [
  { id: 1, type: 'Contratación', name: 'Evento Rock', summary: 'Solicitud de contratación para el 10/01/2026', status: 'Nuevas' },
  { id: 2, type: 'Interesados', name: 'Artista Blue', summary: 'Interesado en tocar en tu sala', status: 'Leídas' },
  { id: 3, type: 'Representación', name: 'Manager Pro', summary: 'Solicitud de representación', status: 'Pendientes' },
  { id: 4, type: 'Bandeja de solicitudes', name: 'Artista Pop', summary: 'Mensaje recibido: ¿Hay fechas libres?', status: 'Nuevas' },
];
function RequestDetail({ item }) {
  // Botones aceptar/rechazar solo para interesados con estado 'interested'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleAccept = async () => {
    // Solo abrir el modal de contratación, sin cambiar el estado del interesado
    if (window && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openHireModal', { detail: item }));
    }
    if (typeof setSelected === 'function') {
      setSelected(null);
    }
  };
  const handleReject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateInterestedStatus(item.id, 'rejected');
    } catch (err) {
      setError('Error al rechazar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="font-bold text-xl mb-2">
        {item.artist?.nickname || item.artist?.name || item.artist?.nickmane || item.name}
      </h2>
      <p className="text-gray-600 mb-4">{item.summary || 'Solicitud de interés para tu sala.'}</p>
      <div className="flex flex-row items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-400 mb-2">Tipo: {item.type || 'Interesado'}</div>
          <div className="mb-2">
            <span className="font-semibold">Artista:</span> {item.artist?.nickname || item.artist?.name || item.artist?.nickmane || item.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Fecha solicitada:</span> {item.date ? new Date(item.date).toLocaleDateString('es-ES') : 'Sin fecha'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Oferta:</span> {item.price ? `${item.price} €` : 'Sin oferta'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Estado:</span> {item.status}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Solicitado el:</span> {item.createdAt ? new Date(item.createdAt).toLocaleString('es-ES') : 'Desconocido'}
          </div>
        </div>
        {item.status === 'interested' && (
          <div className="flex flex-row gap-2 items-start ml-4">
            <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Rechazar'}
            </Button>
            <Button variant="default" onClick={handleAccept} disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Aceptar'}
            </Button>
          </div>
        )}
      </div>
      {error && <div className="text-destructive mt-2">{error}</div>}
    </div>
  );
}

const VenueRequests = () => {
    // Escuchar evento para abrir el modal de contratación desde RequestDetail
    useEffect(() => {
      const handler = (e) => {
        setSelectedInterested(e.detail);
        setModalOpen(true);
      };
      window.addEventListener('openHireModal', handler);
      return () => window.removeEventListener('openHireModal', handler);
    }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedInterested, setSelectedInterested] = useState<Interested | null>(null); // Nuevo estado
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState(() => {
    // Si la pestaña activa es 'Interesados', por defecto 'Nuevas', si no 'Todas'
    return TABS[1] === 'Interesados' ? 'Nuevas' : 'Todas';
  });

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
    console.log('[handleSubmitContratacion] Enviando solicitud:', {
      artistId,
      eventDate: data.fecha,
      eventLocation: data.ubicacion,
      eventType: data.tipoEvento,
      offeredPrice: data.oferta,
      nombreLocal: data.nombreLocal,
      ciudadLocal: data.ciudadLocal,
      message: data.mensaje || '',
      selectedInterested,
      authUser
    });
    createBookingRequest({
      artistId,
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

  // Filtra los items según el tab activo y el filtro
  const items = dummyItems.filter(i =>
    i.type === activeTab &&
    (filter === 'Todas' || i.status === filter)
  ); // 'Representación' tab removed, so this is safe

   // Usa la misma data para bookingRequests
   const bookingRequests = requests;
   const loadingRequests = isLoading;

  // Filtra por tab y filtro
  const filteredRequests = (bookingRequests || []).filter(req => {
    if (activeTab !== 'Contratación') return false;
    if (filter === 'Todas') return true;
    // Ajusta los valores de status según tu backend
    if (filter === 'Nuevas') return req.status === 'Pending';
    if (filter === 'Pendientes') return req.status === 'Pending';
    if (filter === 'Completadas') return req.status === 'Accepted';
    if (filter === 'Canceladas') return req.status === 'Rejected';
    return true;
  });

  return (
    <HeaderLayout profileTabs={localNav}>
 <div className="max-w-3xl mx-auto w-full bg-card rounded-xl shadow-md border border-border mt-8 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border bg-background rounded-t-xl">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`flex-1 py-3 text-center font-display font-semibold transition
              ${activeTab === tab ? 'border-b-2 border-primary text-primary bg-background' : 'text-muted-foreground'}`}
            onClick={() => { setActiveTab(tab); setSelected(null); }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Buscador */}
      <div className="p-4 border-b border-border bg-background">
        <input
          className="w-full rounded-lg bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Buscar..."
        />
        {/* Filtros debajo del buscador */}
        <div className="flex gap-2 mt-3">
          {(activeTab === 'Contratación'
            ? ['Todas', 'Nuevas', 'Pendientes', 'Completadas', 'Canceladas']
            : ['Nuevas', 'Aceptadas']
          ).map(filtro => (
            <button
              key={filtro}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                ${filter === filtro ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
              onClick={() => setFilter(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>
      {/* Lista de tarjetas */}
      {activeTab === 'Contratación' ? (
        <div className="overflow-y-auto flex flex-col gap-6 py-4 px-2" style={{ maxHeight: 400, minHeight: 240 }}>
          {loadingRequests ? (
            <div className="text-center text-muted-foreground py-10">Cargando solicitudes...</div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <CardItemRequest
                key={request.id}
                item={request}
                onClick={() => setSelected(request)}
                selected={selected?.id === request.id}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">No hay solicitudes de contratación en esta sección.</div>
          )}
        </div>
      ) : activeTab === 'Interesados' ? (
        <div className="overflow-y-auto bg-card" style={{ maxHeight: 400, minHeight: 240 }}>
          {(() => {
            let filtered = [];
            if (filter === 'Nuevas') {
              filtered = interested.filter(item => item.status === 'interested');
            } else if (filter === 'Aceptadas') {
              filtered = interested.filter(item => item.status === 'accepted');
            }
            if (filter === 'Nuevas' && filtered.length > 0) {
              // Agrupar por fecha
              const grouped = filtered.reduce((acc, item) => {
                const dateKey = item.date ? new Date(item.date).toISOString().split('T')[0] : 'Sin fecha';
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(item);
                return acc;
              }, {});
              return Object.entries(grouped).map(([date, items]) => {
                const itemsArray = items as typeof filtered;
                // Formato elegante: ejemplo 'Jueves, 25 de diciembre de 2025'
                let formatted = 'Sin fecha';
                if (date !== 'Sin fecha') {
                  const d = new Date(date);
                  formatted = d.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  // Capitalizar la primera letra
                  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
                }
                return (
                  <div key={date} className="mb-6">
                    <div className="mb-2 text-xs font-normal" style={{marginLeft: 2, marginBottom: 8}}>{formatted}</div>
                    <div className="flex flex-col gap-2">
                      {itemsArray.map(item => (
                        <CardItemRequest key={item.id} item={item} onClick={() => setSelected(item)} selected={selected?.id === item.id} />
                      ))}
                    </div>
                  </div>
                );
              });
            }
            return filtered.length > 0 ? (
              filtered.map(item => (
                <CardItemRequest key={item.id} item={item} onClick={() => setSelected(item)} selected={selected?.id === item.id} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">No hay interesados en esta sección.</div>
            );
          })()}
        </div>
      ) : null}
      {/* Panel de mensajes/detalle */}
      <div className="border-t border-border bg-background">
        {selected ? (
          <RequestDetail item={selected} />
        ) : (
          <div className="text-center text-muted-foreground py-10">
            <Send className="mx-auto w-16 h-16 mb-4 opacity-30" />
            <h2 className="font-display font-bold text-lg mb-2">Tus mensajes</h2>
            <p>Selecciona una solicitud o mensaje para ver los detalles aquí.</p>
          </div>
        )}
      </div>
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
