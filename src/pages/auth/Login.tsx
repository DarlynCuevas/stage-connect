import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Music, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: '¡Bienvenido de vuelta!',
          description: 'Has iniciado sesión correctamente.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error de autenticación',
          description: 'Email o contraseña incorrectos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Algo salió mal. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'carlos@example.com', role: 'Artista', variant: 'artist' as const },
    { email: 'maria@example.com', role: 'Manager', variant: 'manager' as const },
    { email: 'club@example.com', role: 'Local', variant: 'venue' as const },
    { email: 'pedro@example.com', role: 'Promotor', variant: 'promoter' as const },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-hero" />
      <div className="fixed inset-0 mesh-gradient opacity-40" />
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px]" />

      <div className="w-full max-w-sm relative z-10">
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
            <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
            <CardDescription className="text-sm">
              Accede a tu cuenta de Stagebook
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Cuentas de demostración
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setEmail(account.email)}
                  >
                    <span className={`text-role-${account.variant}`}>{account.role}</span>
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Regístrate
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
