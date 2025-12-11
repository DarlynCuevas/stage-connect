import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Music, Users, Building2, Megaphone, ArrowLeft, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: any; color: string; bgColor: string }[] = [
  { value: 'Artista', label: 'Artista', icon: Music, color: 'text-role-artist', bgColor: 'bg-role-artist/10' },
  { value: 'Manager', label: 'Manager', icon: Users, color: 'text-role-manager', bgColor: 'bg-role-manager/10' },
  { value: 'Local', label: 'Local', icon: Building2, color: 'text-role-venue', bgColor: 'bg-role-venue/10' },
  { value: 'Promotor', label: 'Promotor', icon: Megaphone, color: 'text-role-promoter', bgColor: 'bg-role-promoter/10' },
];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: 'Selecciona un rol',
        description: 'Debes elegir qué tipo de usuario eres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(name, email, password, selectedRole);
      if (success) {
        toast({
          title: '¡Cuenta creada!',
          description: 'Bienvenido a Stagebook.',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-hero" />
      <div className="fixed inset-0 mesh-gradient opacity-40" />
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <Card variant="glass" className="shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-3 shadow-glow">
              <Music className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl">Crear Cuenta</CardTitle>
            <CardDescription className="text-sm">
              Únete a la comunidad de Stagebook
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selection */}
              <div className="space-y-2.5">
                <Label className="text-sm">¿Qué tipo de usuario eres?</Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-200",
                        selectedRole === role.value
                          ? `border-primary/60 ${role.bgColor} shadow-sm`
                          : "border-border/60 hover:border-border hover:bg-secondary/50"
                      )}
                    >
                      {selectedRole === role.value && (
                        <div className="absolute top-2 right-2">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                        role.bgColor
                      )}>
                        <role.icon className={cn("w-5 h-5", role.color)} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        selectedRole === role.value ? role.color : "text-foreground"
                      )}>
                        {role.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                size="lg"
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
