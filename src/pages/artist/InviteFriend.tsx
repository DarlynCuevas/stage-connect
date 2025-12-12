
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Gift, UserPlus, Settings } from 'lucide-react';

export default function InviteFriend() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  // Usa la variable de entorno si existe, si no window.location.origin
  const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
  const inviteLink = `${baseUrl}/register?ref=${user?.id ?? ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <HeaderLayout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-center mb-4">
          Invita a un amigo y recibe <span className="text-primary">beneficios exclusivos</span>
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl">
          Comparte tu enlace de invitación y ambos recibiréis <b>1 mes gratis de membresía premium</b> cuando tu amigo se registre y complete su perfil. ¡Aprovecha esta oportunidad para crecer juntos en Artime!
        </p>
        <div className="flex flex-col md:flex-row gap-6 mb-10 w-full max-w-3xl justify-center">
          <Card className="flex-1 p-6 flex flex-col items-center border-2 border-primary/30">
            <UserPlus className="w-10 h-10 text-primary mb-2" />
            <h2 className="font-bold text-lg mb-1">Invita a un artista</h2>
            <p className="text-sm text-muted-foreground mb-2 text-center">Tu amigo podrá disfrutar de todas las ventajas de la app y tú recibirás un mes extra de membresía.</p>
            <Badge variant="success">+1 mes gratis</Badge>
          </Card>
          <Card className="flex-1 p-6 flex flex-col items-center border-2 border-primary/30">
            <Gift className="w-10 h-10 text-accent mb-2" />
            <h2 className="font-bold text-lg mb-1">Invita a un local</h2>
            <p className="text-sm text-muted-foreground mb-2 text-center">Si tu invitado es un local, ambos recibiréis visibilidad extra y acceso prioritario a eventos destacados.</p>
            <Badge variant="secondary">+1 mes premium</Badge>
          </Card>
        </div>
        <div className="w-full max-w-xl flex flex-col items-center gap-4 mb-8">
          <Input
            readOnly
            value={inviteLink}
            className="text-center text-lg font-mono bg-secondary/40 border-primary/30"
          />
          <Button onClick={handleCopy} className="w-full md:w-auto" variant="gradient">
            {copied ? '¡Enlace copiado!' : 'Copiar enlace de invitación'}
          </Button>
        </div>
        <Link to="/artist/settings" className="text-sm text-primary underline hover:opacity-80 mb-2 flex items-center gap-1">
          <Settings className="w-4 h-4" /> Gestionar membresía
        </Link>
        <p className="text-xs text-muted-foreground text-center max-w-2xl mt-6">
          Solo para miembros registrados. El beneficio se activa cuando el invitado completa su registro y perfil. Consulta <a href="/terms" className="underline">condiciones</a>.
        </p>
      </div>
    </HeaderLayout>
  );
}
