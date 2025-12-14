import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useUpdateRequestStatus } from '@/lib/requests';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RequestCard } from '@/components/booking/RequestCard';
import { RequestDetailModal } from '@/components/booking/RequestDetailModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSentRequests } from '@/lib/requests';
import { Clock, Check, Loader2, HelpCircle } from 'lucide-react';


const VenueRequests = () => {
  const { data: requests = [], isLoading } = useSentRequests();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');

  // Filtrado por nombre de artista y fecha
  const filterRequests = (arr) => arr.filter(r => {
    const artistName = r.artist?.name?.toLowerCase() || '';
    const matchesName = artistName.includes(search.toLowerCase());
    const matchesDate = date ? (r.date && r.date.startsWith(date)) : true;
    return matchesName && matchesDate;
  });

  const pendingRequests = filterRequests(requests.filter(r => r.status === 'Pending'));
  const acceptedRequests = filterRequests(requests.filter(r => r.status === 'Accepted'));

  // Mutación para cancelar solicitud
  const { mutateAsync: updateRequestStatus } = useUpdateRequestStatus();
  const [isUpdating, setIsUpdating] = useState(false);

  // Acción cancelar
  const handleCancel = async (id) => {
    setIsUpdating(true);
    try {
      await updateRequestStatus({ id, status: 'Rejected' });
    } finally {
      setIsUpdating(false);
    }
  };
  // Estado para el modal de detalles
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openDetailModal = (request: any) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  // Acción reenviar (puedes personalizar la lógica)
  const handleResend = (id) => {
    // Aquí podrías abrir un modal o reenviar la solicitud
    alert('Funcionalidad de reenviar aún no implementada.');
  };

  // Acción editar (puedes personalizar la lógica)
  const handleEdit = (id) => {
    // Aquí podrías abrir un modal de edición
    alert('Funcionalidad de editar aún no implementada.');
  };


  // Navegación para el HeaderLayout (ajusta el id según sea necesario)
  const id = '';
  const localNav = [
    { to: `/venue/${id}/discover`, label: 'Inicio' },
    { to: '/venue/dashboard', label: 'Panel de datos' },
    { to: `/venue/profile/${id}`, label: 'Mi perfil' },
    { to: `/venue/calendar/${id}`, label: 'Calendario' },
    { to: '/venue/requests', label: 'Solicitudes' },
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
      <HeaderLayout profileTabs={localNav}>
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
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="gap-2">
              <Check className="w-4 h-4" />
              Aceptadas ({acceptedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <div key={request.id} className="relative">
                    <RequestCard
                      request={request}
                      isReceiver={false}
                      onViewDetails={() => openDetailModal(request)}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(request.id)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(request.id)} disabled={isUpdating}>
                        Cancelar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleResend(request.id)}>
                        Reenviar
                      </Button>
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
                  <div key={request.id} className="relative">
                    {/* Estado ya mostrado en RequestCard */}
                    <RequestCard
                      request={request}
                      isReceiver={false}
                      onViewDetails={() => openDetailModal(request)}
                    />
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
          onEdit={selectedRequest ? () => handleEdit(selectedRequest.id) : undefined}
          onResend={selectedRequest ? () => handleResend(selectedRequest.id) : undefined}
        />
    </HeaderLayout>
  );
};

export default VenueRequests;
