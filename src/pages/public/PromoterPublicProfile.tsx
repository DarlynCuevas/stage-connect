import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Globe,
  Award,
  Users,
  Briefcase,
  Languages,
  TrendingUp,
  Clock,
  MessageSquare,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail,
  Calendar,
  Music,
  Megaphone,
  DollarSign,
  Building2,
  Sparkles,
  Target,
  LogIn,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';

interface Promoter {
  id: number;
  name: string;
  nickName?: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  bio?: string;
  city?: string;
  province?: string;
  address?: string;
  company?: string;
  website?: string;
  yearsOfExperience?: number;
  totalEventsOrganized?: number;
  achievements?: string;
  certifications?: string[];
  rating?: number;
  totalReviews?: number;
  eventTypes?: string[];
  musicGenres?: string[];
  audienceSize?: string;
  budgetRange?: string;
  services?: string[];
  hasVenues?: boolean;
  providesMarketing?: boolean;
  providesSponsorship?: boolean;
  languages?: string[];
  coverageAreas?: string[];
  internationalEvents?: boolean;
  featuredEvents?: string[];
  artistsWorkedWith?: string[];
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  acceptingProjects?: boolean;
  responseTime?: string;
  preferredProjectSize?: string;
}

function PromoterPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [promoter, setPromoter] = useState<Promoter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = Number(user?.id) === Number(id);
  const isArtist = user?.role === 'Artista';
  const isVenue = user?.role === 'Local';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    
    console.log('🔍 [PromoterPublicProfile] Fetching promoter with id:', id);
    
    apiFetch(`/public/users/${id}`)
      .then((data) => {
        console.log('✅ [PromoterPublicProfile] Promoter data received:', data);
        setPromoter(data);
      })
      .catch((err: any) => {
        console.error('❌ [PromoterPublicProfile] Error:', err);
        setError(err.message || 'Error fetching promoter');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !promoter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || 'Promotor no encontrado'}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = promoter.nickName || promoter.name || 'Promotor';
  const location = [promoter.city, promoter.province].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="h-64 lg:h-80">
          <div className="w-full h-full bg-gradient-to-r from-accent via-primary to-secondary" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <Button variant="glass" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          {isOwner && (
            <Button variant="glass" size="sm" onClick={() => navigate('/promoter/profile')}>
              Editar Perfil
            </Button>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarImage src={promoter.avatar} alt={displayName} />
                  <AvatarFallback className="text-3xl bg-role-promoter text-white">
                    {displayName?.[0]?.toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl lg:text-4xl font-display font-bold">{displayName}</h1>
                    <Badge variant="secondary" className="text-sm">
                      <Megaphone className="h-3 w-3 mr-1" />
                      Promotor
                    </Badge>
                  </div>

                  {promoter.company && (
                    <p className="text-lg text-muted-foreground">{promoter.company}</p>
                  )}

                  {location && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {promoter.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre mí</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {promoter.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Stats Card - Airbnb Style */}
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold">{promoter.totalEventsOrganized || 0}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Eventos organizados
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-3xl font-bold">{promoter.yearsOfExperience || 0}</div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Award className="h-4 w-4" />
                      Años experiencia
                    </div>
                  </div>
                  {promoter.rating && (
                    <div className="text-center space-y-1">
                      <div className="text-3xl font-bold flex items-center justify-center gap-1">
                        {promoter.rating.toFixed(1)}
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {promoter.totalReviews || 0} reseñas
                      </div>
                    </div>
                  )}
                  <div className="text-center space-y-1">
                    {promoter.acceptingProjects ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                        <div className="text-sm font-medium text-green-600">
                          Aceptando proyectos
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl">🔒</div>
                        <div className="text-sm text-muted-foreground">
                          No disponible
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Info Tabs */}
            <Tabs defaultValue="experience" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="experience">Experiencia</TabsTrigger>
                <TabsTrigger value="services">Servicios</TabsTrigger>
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="coverage">Cobertura</TabsTrigger>
              </TabsList>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-6 mt-6">
                {promoter.achievements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Logros y Reconocimientos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {promoter.achievements}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {promoter.certifications && promoter.certifications.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Certificaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {promoter.artistsWorkedWith && promoter.artistsWorkedWith.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Artistas Destacados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.artistsWorkedWith.map((artist, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {artist}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6 mt-6">
                {promoter.services && promoter.services.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Servicios Ofrecidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {promoter.services.map((service, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {promoter.budgetRange && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Rango de Presupuesto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{promoter.budgetRange}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Presupuesto típico de eventos que maneja
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Building2 className={`h-8 w-8 mx-auto mb-2 ${promoter.hasVenues ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="font-medium text-sm">
                        {promoter.hasVenues ? 'Tiene locales' : 'Sin locales propios'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Megaphone className={`h-8 w-8 mx-auto mb-2 ${promoter.providesMarketing ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="font-medium text-sm">
                        {promoter.providesMarketing ? 'Marketing incluido' : 'Sin marketing'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-4">
                      <Sparkles className={`h-8 w-8 mx-auto mb-2 ${promoter.providesSponsorship ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="font-medium text-sm">
                        {promoter.providesSponsorship ? 'Gestiona patrocinios' : 'Sin patrocinios'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {promoter.responseTime && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Tiempo de Respuesta
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{promoter.responseTime}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6 mt-6">
                {promoter.eventTypes && promoter.eventTypes.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Tipos de Eventos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.eventTypes.map((type, idx) => (
                          <Badge key={idx} variant="secondary" className="text-sm">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {promoter.musicGenres && promoter.musicGenres.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Géneros Musicales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.musicGenres.map((genre, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {promoter.audienceSize && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Tamaño de Audiencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{promoter.audienceSize}</p>
                    </CardContent>
                  </Card>
                )}

                {promoter.preferredProjectSize && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Tamaño de Proyecto Preferido
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{promoter.preferredProjectSize}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Featured Events Gallery */}
                {promoter.featuredEvents && promoter.featuredEvents.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Eventos Destacados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {promoter.featuredEvents.map((url, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={url}
                              alt={`Evento ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Coverage Tab */}
              <TabsContent value="coverage" className="space-y-6 mt-6">
                {promoter.languages && promoter.languages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Languages className="h-5 w-5" />
                        Idiomas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {promoter.coverageAreas && promoter.coverageAreas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Áreas de Cobertura
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {promoter.coverageAreas.map((area, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Eventos Internacionales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {promoter.internationalEvents ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Organiza eventos internacionales</span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Solo eventos nacionales/locales</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card - Only for Artists/Venues */}
            {isAuthenticated && (isArtist || isVenue) && !isOwner && (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Contactar Promotor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {promoter.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${promoter.phone}`} className="hover:underline">
                        {promoter.phone}
                      </a>
                    </div>
                  )}
                  {promoter.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${promoter.email}`} className="hover:underline text-sm">
                        {promoter.email}
                      </a>
                    </div>
                  )}
                  {promoter.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={promoter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        Sitio web
                      </a>
                    </div>
                  )}

                  {promoter.acceptingProjects && (
                    <Button className="w-full" size="lg">
                      Proponer Evento
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* CTA for non-authenticated users */}
            {!isAuthenticated && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-6 text-center space-y-4">
                  <LogIn className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">¿Eres artista o tienes un local?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inicia sesión para contactar a este promotor y organizar eventos increíbles
                    </p>
                  </div>
                  <Button onClick={() => navigate('/login')} className="w-full" size="lg">
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {promoter.socialLinks && Object.keys(promoter.socialLinks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {promoter.socialLinks.linkedin && (
                    <a
                      href={promoter.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {promoter.socialLinks.instagram && (
                    <a
                      href={promoter.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {promoter.socialLinks.facebook && (
                    <a
                      href={promoter.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-500" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {promoter.socialLinks.twitter && (
                    <a
                      href={promoter.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-sky-500" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {promoter.socialLinks.youtube && (
                    <a
                      href={promoter.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-red-500" />
                      <span>YouTube</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PromoterPublicProfileWithLayout = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <>
        <Sidebar />
        <div className="lg:ml-64">
          <PromoterPublicProfile />
        </div>
      </>
    );
  }
  
  return <PromoterPublicProfile />;
};

export default PromoterPublicProfileWithLayout;