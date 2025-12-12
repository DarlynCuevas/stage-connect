import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Music,
  Users,
  Building2,
  Megaphone,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

const roles = [
  {
    icon: Music,
    title: 'Artistas',
    description: 'Gestiona tu perfil, precios y disponibilidad. Recibe solicitudes.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Users,
    title: 'Managers',
    description: 'Administra múltiples artistas desde un solo panel.',
    color: 'text-role-manager',
    bgColor: 'bg-role-manager/10',
  },
  {
    icon: Building2,
    title: 'Locales',
    description: 'Busca artistas y envía propuestas de contratación.',
    color: 'text-role-venue',
    bgColor: 'bg-role-venue/10',
  },
  {
    icon: Megaphone,
    title: 'Promotores',
    description: 'Organiza eventos y encuentra el talento perfecto.',
    color: 'text-role-promoter',
    bgColor: 'bg-role-promoter/10',
  },
];

const features = [
  {
    icon: Shield,
    title: 'Negociación Segura',
    description: 'Sistema de contraofertas transparente y protegido.',
  },
  {
    icon: Zap,
    title: 'Respuesta Rápida',
    description: 'Comunicación directa entre artistas y contratantes.',
  },
  {
    icon: Globe,
    title: 'Alcance Global',
    description: 'Conecta con talento de todo el mundo hispano.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container-tight h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Bookify</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-5 leading-[1.15] tracking-tight">
              Conecta con el talento que tu evento necesita
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Bookify es la plataforma para artistas, managers, locales y promotores. 
              Gestiona perfiles, negocia contratos y cierra actuaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="xl" asChild>
                <Link to="/register">
                  Comenzar gratis
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/login">
                  Ya tengo cuenta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 lg:py-20">
        <div className="container-tight">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
              Una plataforma, cuatro roles
            </h2>
            <p className="text-muted-foreground">
              Cada usuario tiene su propio espacio personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <Card
                key={role.title}
                variant="outline"
                className="group hover:shadow-md hover:border-border transition-all duration-300 cursor-default animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center mb-3`}>
                    <role.icon className={`w-5 h-5 ${role.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {role.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-6">
                Todo lo que necesitas para profesionalizar tus contrataciones
              </h2>
              <div className="space-y-5">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-0.5">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-secondary border border-border p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">500+</div>
                  <p className="text-muted-foreground">Artistas registrados</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-3 rounded-xl bg-background border border-border shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-medium text-sm text-foreground">Verificación profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container-tight">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
              ¿Listo para empezar?
            </h2>
            <p className="text-muted-foreground mb-6">
              Únete a Bookify hoy y conecta con oportunidades reales.
            </p>
            <Button size="xl" asChild>
              <Link to="/register">
                Crear mi cuenta gratis
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-sm">BOOKIFY</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Bookify. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
