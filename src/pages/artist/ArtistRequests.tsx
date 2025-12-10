import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestCard } from '@/components/booking/RequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookingRequests, mockArtists } from '@/data/mockData';
import { BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Clock, Check, X } from 'lucide-react';

export default function ArtistRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const artist = mockArtists[0];
  const { toast } = useToast();

  const handleAccept = (requestId: string) => {
    setRequests(requests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    ));
    toast({
      title: 'Solicitud aceptada',
      description: 'El contratante será notificado.',
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
    toast({
      title: 'Solicitud rechazada',
      description: 'El contratante será notificado.',
    });
  };

  const handleNegotiate = (requestId: string) => {
    setRequests(requests.map(r =>
      r.id === requestId ? { ...r, status: 'negotiating' as const } : r
    ));
    toast({
      title: 'Modo negociación',
      description: 'Ahora puedes enviar una contraoferta.',
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const negotiatingRequests = requests.filter(r => r.status === 'negotiating');
  const completedRequests = requests.filter(r => ['accepted', 'rejected', 'confirmed'].includes(r.status));

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
            <TabsTrigger value="negotiating" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Negociando ({negotiatingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <Check className="w-4 h-4" />
              Completadas ({completedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                    isReceiver
                    onAccept={() => handleAccept(request.id)}
                    onReject={() => handleReject(request.id)}
                    onNegotiate={() => handleNegotiate(request.id)}
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

          <TabsContent value="negotiating">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {negotiatingRequests.length > 0 ? (
                negotiatingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    artist={artist}
                    isReceiver
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No hay negociaciones en curso</p>
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
      </div>
    </DashboardLayout>
  );
}
