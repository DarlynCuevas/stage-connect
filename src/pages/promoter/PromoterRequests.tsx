import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestCard } from '@/components/booking/RequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSentRequests } from '@/lib/requests';
import { Clock, Check } from 'lucide-react';

export default function PromoterRequests() {
  const { data: requests = [], isLoading } = useSentRequests();

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const acceptedRequests = requests.filter(r => r.status === 'Accepted');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">
            Mis Solicitudes
          </h1>
          <p className="text-muted-foreground">
            Revisa el estado de las solicitudes que has enviado a artistas.
          </p>
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
                  <RequestCard
                    key={request.id}
                    request={request}
                    isReceiver={false}
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

          <TabsContent value="accepted">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {acceptedRequests.length > 0 ? (
                acceptedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    isReceiver={false}
                  />
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
    </DashboardLayout>
  );
}
