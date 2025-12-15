
import { useState } from 'react';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { User, Lock, Trash2, LogOut } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';



export default function Settings() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deleting, setDeleting] = useState(false);
  const [dniNif, setDniNif] = useState('');
  const location = useLocation();
  const { toast } = useToast();

  // Guardar cambios de perfil
  const handleSaveProfile = async () => {
    try {
      // Aquí deberías llamar a tu API para actualizar el perfil
      // await api.updateProfile({ name, email });
      toast({ title: 'Perfil actualizado', description: 'Tus datos han sido guardados correctamente.' });
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el perfil', variant: 'destructive' });
    }
  };

  // Cambiar contraseña (placeholder)
  const handleChangePassword = async () => {
    toast({ title: 'Función no implementada', description: 'Próximamente podrás cambiar tu contraseña aquí.' });
  };

  // Eliminar cuenta (placeholder)
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // await api.deleteAccount();
      toast({ title: 'Cuenta eliminada', description: 'Tu cuenta ha sido eliminada.' });
      logout();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la cuenta', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  // Protección de autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <HeaderLayout>
      <div className="max-w-2xl mx-auto space-y-8 py-8 px-2 md:px-0">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Ajustes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y preferencias.
          </p>
        </div>

        <Accordion type="multiple" className="w-full">
          {/* Información Personal */}
          <AccordionItem value="personal">
            <AccordionTrigger>
              <span className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Información Personal</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información de perfil.</CardDescription>
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
            </AccordionContent>
          </AccordionItem>

          {/* Datos fiscales */}
          <AccordionItem value="fiscal">
            <AccordionTrigger>
              <span className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Datos fiscales</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Datos fiscales</CardTitle>
                  <CardDescription>Información necesaria para facturación y verificación de identidad.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dni">DNI/NIF</Label>
                    <Input id="dni" placeholder="Introduce tu DNI o NIF" value={dniNif} onChange={e => setDniNif(e.target.value)} />
                      <Input id="dni" placeholder="Introduce tu DNI o NIF" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razon">Razón social (opcional)</Label>
                    <Input id="razon" placeholder="Nombre fiscal o empresa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección fiscal</Label>
                    <Input id="direccion" placeholder="Calle, número, piso..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input id="ciudad" placeholder="Ciudad" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input id="provincia" placeholder="Provincia" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cp">Código Postal</Label>
                      <Input id="cp" placeholder="Código Postal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input id="pais" placeholder="País" />
                    </div>
                  </div>
                  <Button variant="gradient">
                    Guardar datos fiscales
                  </Button>

                  {/* Verificación de identidad */}
                  <Separator />
                  <div className="space-y-2">
                    <Label>Verificación de identidad</Label>
                    {user?.verified ? (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Usuario verificado
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
                          <span className="text-sm">Pendiente de verificación</span>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <Label htmlFor="doc-upload">Sube tu DNI/NIF (foto o PDF)</Label>
                          <Input id="doc-upload" type="file" accept="image/*,application/pdf" />
                          <Button variant="outline" className="w-fit">Enviar para verificación</Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Tu información será revisada por nuestro equipo. Recibirás una notificación cuando tu cuenta sea verificada.</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Seguridad */}
          <AccordionItem value="security">
            <AccordionTrigger>
              <span className="flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Seguridad</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Cambia tu contraseña para mantener tu cuenta segura.</CardDescription>
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
            </AccordionContent>
          </AccordionItem>

          {/* Danger zone */}
          <AccordionItem value="danger">
            <AccordionTrigger>
              <span className="flex items-center gap-2 text-destructive"><Trash2 className="w-5 h-5" /> Zona de Peligro</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card variant="gradient" className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                  <CardDescription>Acciones irreversibles para tu cuenta.</CardDescription>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>


      </div>
    </HeaderLayout>
  )
}
