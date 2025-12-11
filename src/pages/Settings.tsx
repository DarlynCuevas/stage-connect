import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, LogOut, Trash2 } from 'lucide-react';
import { deleteUser } from '@/lib/users';

export default function Settings() {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deleting, setDeleting] = useState(false);

  const handleSaveProfile = () => {
    toast({
      title: 'Perfil actualizado',
      description: 'Los cambios se han guardado correctamente.',
    });
  };

  const handleChangePassword = () => {
    toast({
      title: 'Contraseña actualizada',
      description: 'Tu contraseña ha sido cambiada correctamente.',
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirm = window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.');
    if (!confirm) return;
    try {
      setDeleting(true);
      // Assuming token is managed within apiFetch via context; if not, inject from useAuth
      await deleteUser(user.id as number, token as string);
      toast({ title: 'Cuenta eliminada', description: 'Tu cuenta ha sido eliminada correctamente.' });
      // Logout and redirect to landing
      logout();
    } catch (err: any) {
      toast({ title: 'Error al eliminar', description: err?.message || 'No se pudo eliminar la cuenta.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Ajustes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y preferencias.
          </p>
        </div>

        {/* Profile settings */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Actualiza tu información de perfil.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button variant="gradient" onClick={handleSaveProfile}>
              Guardar cambios
            </Button>
          </CardContent>
        </Card>

        {/* Password */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Cambia tu contraseña para mantener tu cuenta segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Cambiar contraseña
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card variant="gradient" className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
            <CardDescription>
              Acciones irreversibles para tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Cerrar sesión</p>
                <p className="text-sm text-muted-foreground">
                  Salir de tu cuenta en este dispositivo.
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-destructive">Eliminar cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Eliminar permanentemente tu cuenta y todos tus datos.
                </p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Eliminando…' : 'Eliminar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
