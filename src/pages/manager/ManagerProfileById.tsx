import { useParams } from 'react-router-dom';
import { useUser } from '@/lib/users';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ManagerProfileById() {
  const { id } = useParams();
  const { data: manager, isLoading, error } = useUser(id ? Number(id) : undefined);

  if (isLoading) return <DashboardLayout><p>Cargando...</p></DashboardLayout>;
  if (error || !manager) return <DashboardLayout><p>No se encontró el manager</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Perfil del Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={manager.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${manager.id}`} />
            <AvatarFallback>{manager.name?.charAt(0) || 'M'}</AvatarFallback>
          </Avatar>
          <div className="mb-2 font-bold text-lg">{manager.name}</div>
          <div className="mb-2 text-muted-foreground">{manager.email}</div>
          <Badge variant="secondary">Manager</Badge>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
