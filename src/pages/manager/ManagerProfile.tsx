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
import { Edit, Save, X, MapPin, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

export default function ManagerProfile() {
  const { id, managerId } = useParams();
  let resolvedManagerId = managerId || id;
  let path = '';
  if (typeof window !== 'undefined') {
    path = window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname;
    // Si no hay id en params, intentar extraerlo de la URL con regex
    if (!resolvedManagerId && typeof path === 'string') {
      const match = path.match(/manager\/(\d+)/);
      if (match) resolvedManagerId = match[1];
    }
  }
  const { user: authUser, token, setUser } = useAuth();
  const managerIdNumber = resolvedManagerId ? Number(resolvedManagerId) : undefined;
  const { data: manager } = useUser(managerIdNumber);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();


  let mainContext: 'manager' | 'artist' | 'promoter' | 'venue' = 'manager';
  if (typeof window !== 'undefined') {
    path = window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname;
    if (/^\/manager\//.test(path)) {
      mainContext = 'manager';
    } else if (/^\/venue\//.test(path)) {
      mainContext = 'venue';
    } else if (/^\/promoter\//.test(path)) {
      mainContext = 'promoter';
    } else if (/^\/artist\//.test(path)) {
      mainContext = 'artist';
    }
  }
  
  const isOwnProfile = authUser && resolvedManagerId && String(authUser.id) === String(resolvedManagerId);

  useEffect(() => {
    if (isOwnProfile && authUser) {
      setEditData(authUser);
    } else if (manager) {
      setEditData(manager);
    }
  }, [isOwnProfile, authUser, manager]);

  if (!editData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No se encontró el manager</p>
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
    setEditData(manager);
    setIsEditing(false);
  };

  return (
    <HeaderLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-role-manager/20 to-role-manager/5 p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={manager?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager'} />
                <AvatarFallback className="text-2xl bg-role-manager text-white">
                  {manager?.name?.charAt(0) || 'M'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-display font-bold">{manager?.name || 'Manager'}</h1>
                <p className="text-muted-foreground">{manager?.email}</p>
              </div>
            </div>
            {isOwnProfile && (
              !isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
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
              )
            )}
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
                <Label htmlFor="name">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData?.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">{manager?.name || 'No especificado'}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <p className="text-sm text-muted-foreground mt-1">{manager?.email}</p>
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
                  <p className="text-sm text-muted-foreground mt-1">{(manager as any)?.gender || 'No especificado'}</p>
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
                  placeholder="Cuéntanos sobre tu experiencia como manager..."
                  className="min-h-[200px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {(manager as any)?.bio || 'No hay biografía disponible.'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </HeaderLayout>
  );
}
