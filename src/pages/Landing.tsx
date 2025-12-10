import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Music,
  Users,
  Building2,
  Megaphone,
  ArrowRight,
  Star,
  Shield,
  Zap,
  Globe,
  CheckCircle,
} from 'lucide-react';

const roles = [
  {
    icon: Music,
    title: 'Artistas',
    description: 'Gestiona tu perfil, precios y disponibilidad. Recibe y negocia solicitudes de contratación.',
    color: 'text-role-artist',
    bgColor: 'bg-role-artist/10',
  },
  {
    icon: Users,
    title: 'Managers',
    description: 'Administra múltiples artistas desde un solo panel. Gestiona perfiles, precios y solicitudes.',
    color: 'text-role-manager',
    bgColor: 'bg-role-manager/10',
  },
  {
    icon: Building2,
    title: 'Locales',
    description: 'Busca artistas con filtros avanzados. Envía propuestas y negocia contrataciones.',
    color: 'text-role-venue',
    bgColor: 'bg-role-venue/10',
  },
  {
    icon: Megaphone,
    title: 'Promotores',
    description: 'Organiza eventos y festivales. Encuentra el talento perfecto para cada ocasión.',
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
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">STAGEBOOK</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in">
              <Star className="w-3 h-3 mr-1 text-accent" />
              La plataforma #1 de contratación artística
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Conecta con el{' '}
              <span className="gradient-text">talento</span>{' '}
              que tu evento necesita
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Stagebook es la plataforma definitiva para artistas, managers, locales y promotores. 
              Gestiona perfiles, negocia contratos y cierra actuaciones de forma profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button size="xl" variant="hero" asChild>
                <Link to="/register">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="xl" variant="glass" asChild>
                <Link to="/login">
                  Ya tengo cuenta
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Una plataforma,{' '}
              <span className="gradient-text">cuatro roles</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada usuario tiene su propio espacio personalizado con las herramientas que necesita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card
                key={role.title}
                variant="gradient"
                className="group hover:shadow-glow hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${role.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <role.icon className={`w-7 h-7 ${role.color}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Todo lo que necesitas para{' '}
                <span className="gradient-text">profesionalizar</span>{' '}
                tus contrataciones
              </h2>
              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-border/50 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-display font-bold gradient-text mb-2">500+</div>
                  <p className="text-muted-foreground">Artistas registrados</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-4 rounded-xl glass border border-border/50 shadow-elevated">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Verificación profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              ¿Listo para llevar tu carrera al{' '}
              <span className="gradient-text">siguiente nivel</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Únete a Stagebook hoy y comienza a conectar con oportunidades reales.
            </p>
            <Button size="xl" variant="hero" asChild>
              <Link to="/register">
                Crear mi cuenta gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              <span className="font-display font-bold">STAGEBOOK</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Stagebook. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
