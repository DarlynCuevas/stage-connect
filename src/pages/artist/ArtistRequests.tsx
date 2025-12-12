import { useState } from 'react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { RequestCard } from '@/components/booking/RequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookingRequests, mockArtists } from '@/data/mockData';
import { BookingRequest } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Clock, Check } from 'lucide-react';

export default function ArtistRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>(mockBookingRequests);
  const artist = mockArtists[0];
  const { toast } = useToast();

  const handleAccept = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
    toast({ title: 'Solicitud aceptada' });
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    toast({ title: 'Solicitud rechazada' });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const negotiatingRequests = requests.filter(r => r.status === 'negotiating');
  const completedRequests = requests.filter(r => ['accepted', 'rejected', 'confirmed'].includes(r.status));

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar showSearch={false} />
      <main className="container-tight py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Solicitudes</h1>
          <p className="text-muted-foreground">Gestiona las propuestas de contratación.</p>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending"><Clock className="w-4 h-4 mr-2" />Pendientes ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="negotiating"><MessageSquare className="w-4 h-4 mr-2" />Negociando ({negotiatingRequests.length})</TabsTrigger>
            <TabsTrigger value="completed"><Check className="w-4 h-4 mr-2" />Completadas ({completedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.map((r) => (
                <RequestCard key={r.id} request={r} artist={artist} isReceiver onAccept={() => handleAccept(r.id)} onReject={() => handleReject(r.id)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="negotiating">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {negotiatingRequests.map((r) => <RequestCard key={r.id} request={r} artist={artist} isReceiver />)}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedRequests.map((r) => <RequestCard key={r.id} request={r} artist={artist} />)}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
