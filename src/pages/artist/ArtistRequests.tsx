import { useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { RequestCard } from '@/components/booking/RequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArtists } from '@/data/mockData';
import { BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useArtistRequests, useUpdateRequestStatus } from '@/lib/requests';
import { MessageSquare, Clock, Check, X } from 'lucide-react';

export default function ArtistRequests() {
  const { data: requests = [], isLoading } = useArtistRequests();
  const artist = mockArtists[0];
  const { toast } = useToast();
  const updateStatusMutation = useUpdateRequestStatus();

  const handleAccept = useCallback(async (requestId: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: requestId, status: 'Accepted' });
    } catch (err) {
      // error already handled by mutation
    }
  }, [updateStatusMutation]);

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

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const completedRequests = requests.filter(r => ['Accepted', 'Rejected'].includes(r.status));

  return (
    
      <HeaderLayout>
        <DashboardLayout noSidebar>
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
      </HeaderLayout>
  );
}
