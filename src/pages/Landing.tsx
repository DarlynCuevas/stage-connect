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
  Sparkles,
} from 'lucide-react';

const roles = [
  {
    icon: Music,
    title: 'Artistas',
    description: 'Gestiona tu perfil, precios y disponibilidad. Recibe y negocia solicitudes de contratación.',
    color: 'text-role-artist',
    bgColor: 'bg-role-artist/10',
    borderColor: 'group-hover:border-role-artist/30',
  },
  {
    icon: Users,
    title: 'Managers',
    description: 'Administra múltiples artistas desde un solo panel. Gestiona perfiles, precios y solicitudes.',
    color: 'text-role-manager',
    bgColor: 'bg-role-manager/10',
    borderColor: 'group-hover:border-role-manager/30',
  },
  {
    icon: Building2,
    title: 'Locales',
    description: 'Busca artistas con filtros avanzados. Envía propuestas y negocia contrataciones.',
    color: 'text-role-venue',
    bgColor: 'bg-role-venue/10',
    borderColor: 'group-hover:border-role-venue/30',
  },
  {
    icon: Megaphone,
    title: 'Promotores',
    description: 'Organiza eventos y festivales. Encuentra el talento perfecto para cada ocasión.',
    color: 'text-role-promoter',
    bgColor: 'bg-role-promoter/10',
    borderColor: 'group-hover:border-role-promoter/30',
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
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Music className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Artime</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link to="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="glass" className="mb-5 animate-fade-in px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1.5 text-accent" />
              La plataforma #1 de contratación artística
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-5 animate-fade-in-up leading-[1.1]" style={{ animationDelay: '0.1s' }}>
              Conecta con el{' '}
              <span className="gradient-text">talento</span>{' '}
              que tu evento necesita
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Stagebook es la plataforma definitiva para artistas, managers, locales y promotores. 
              Gestiona perfiles, negocia contratos y cierra actuaciones de forma profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button size="xl" variant="hero" asChild>
                <Link to="/register">
                  Comenzar gratis
                  <ArrowRight className="w-4 h-4 ml-1" />
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
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Una plataforma,{' '}
              <span className="gradient-text">cuatro roles</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Cada usuario tiene su propio espacio personalizado con las herramientas que necesita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <Card
                key={role.title}
                variant="gradient"
                className={`group hover:shadow-lg hover-lift ${role.borderColor} animate-fade-in-up cursor-default`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-5">
                  <div className={`w-11 h-11 rounded-lg ${role.bgColor} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <role.icon className={`w-5 h-5 ${role.color}`} />
                  </div>
                  <h3 className={`text-lg font-display font-semibold mb-2 group-hover:${role.color} transition-colors`}>
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {role.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 leading-tight">
                Todo lo que necesitas para{' '}
                <span className="gradient-text">profesionalizar</span>{' '}
                tus contrataciones
              </h2>
              <div className="space-y-5">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-border/50 p-8 flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-display font-bold gradient-text mb-2">500+</div>
                  <p className="text-muted-foreground text-sm">Artistas registrados</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-3.5 rounded-xl glass-strong shadow-elevated animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="font-medium text-sm">Verificación profesional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              ¿Listo para llevar tu carrera al{' '}
              <span className="gradient-text">siguiente nivel</span>?
            </h2>
            <p className="text-muted-foreground text-base mb-8">
              Únete a Stagebook hoy y comienza a conectar con oportunidades reales.
            </p>
            <Button size="xl" variant="hero" asChild>
              <Link to="/register">
                Crear mi cuenta gratis
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary" />
              <span className="font-display font-semibold text-sm">STAGEBOOK</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Stagebook. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
