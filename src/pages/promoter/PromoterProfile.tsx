import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useUser } from '@/lib/users';
import { Edit, Save, X, Megaphone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PromoterProfile() {
    function renderEditButton() {
      if (!isEditing) {
        return (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        );
      }
      return (
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button onClick={handleCancel} variant="ghost">
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>
      );
    }
  const { id } = useParams();
  const { user: authUser, token, setUser } = useAuth();
  // const isOwnProfile = authUser && id && String(authUser.id) === String(id);
  const promoterId = id ? Number(id) : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: promoter } = useUser(promoterId);

  useEffect(() => {
    if (promoter) {
      setEditData(promoter);
    } else if (authUser) {
      setEditData(authUser);
    }
  }, [authUser, promoter]);

  if (!editData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No se encontró el promotor</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleSave = async () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'No estás autenticado',
        variant: 'destructive',
        duration: 4000,
      });
      return;
    }

    try {
      const updatedUser = await updateProfileMutation.mutateAsync({ 
        profileData: editData, 
        token 
      });
      
      if (updatedUser?.user) {
        setUser(updatedUser.user);
      }
      
      setIsEditing(false);
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente.',
        duration: 4000,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el perfil',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setEditData(promoter);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-role-promoter/20 to-role-promoter/5 p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={promoter?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=promoter'} />
                <AvatarFallback className="text-2xl bg-role-promoter text-white">
                  {promoter?.name?.charAt(0) || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-display font-bold">{promoter?.name || 'Promotor'}</h1>
                <p className="text-muted-foreground">{promoter?.email}</p>
              </div>
            </div>
            {renderEditButton()}
          </div>
        </div>
        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre / Empresa</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData?.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Tu nombre o empresa"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{promoter?.name || 'No especificado'}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-sm text-muted-foreground mt-1">{promoter?.email}</p>
              </div>
              <div>
                <Label htmlFor="gender">Género</Label>
                {isEditing ? (
                  <Input
                    id="gender"
                    value={(editData as any)?.gender || ''}
                    onChange={(e) => setEditData({ ...editData, gender: e.target.value } as any)}
                    placeholder="Tu género"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{(promoter as any)?.gender || 'No especificado'}</p>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Biografía</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={(editData as any)?.bio || ''}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value } as any)}
                  placeholder="Cuéntanos sobre tu experiencia organizando eventos..."
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {(promoter as any)?.bio || 'No hay biografía disponible.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}