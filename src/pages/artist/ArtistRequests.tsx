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
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ArtistRequests() {
    const { id } = useParams();
    const { user: authUser } = useAuth();
    if (id && authUser && String(authUser.id) !== String(id)) {
      return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
    }
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
      </HeaderLayout>
  );
}
