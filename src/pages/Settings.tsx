import { useState } from 'react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, LogOut, Trash2 } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

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

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar showSearch={false} />
      
      <main className="container-tight py-6 md:py-8">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">Ajustes</h1>
            <p className="text-muted-foreground">Gestiona tu cuenta y preferencias.</p>
          </div>

          <div className="space-y-6">
            <Card variant="outline">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-primary" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button onClick={handleSaveProfile}>Guardar cambios</Button>
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="w-4 h-4 text-primary" />
                  Seguridad
                </CardTitle>
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
                <Button variant="outline" onClick={handleChangePassword}>Cambiar contraseña</Button>
              </CardContent>
            </Card>

            <Card variant="outline" className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive text-base">Zona de Peligro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Cerrar sesión</p>
                    <p className="text-sm text-muted-foreground">Salir de tu cuenta.</p>
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
                    <p className="text-sm text-muted-foreground">Eliminar permanentemente.</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
