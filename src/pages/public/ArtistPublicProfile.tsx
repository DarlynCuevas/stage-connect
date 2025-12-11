import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirmedRequests } from '@/lib/requests';
import { useBlockedDatesCalendar } from '@/lib/blocked-days';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArtistCalendar } from '@/components/calendar/ArtistCalendar';
import {
  ArrowLeft,
  MapPin,
  Star,
  Music,
  Instagram,
  Youtube,
  CheckCircle,
  Calendar,
  Send,
  DollarSign,
  Globe,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function ArtistPublicProfile() {
  const { id } = useParams();
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [artist, setArtist] = useState<any | null>(null);
  const [loadingArtist, setLoadingArtist] = useState(false);
  const [artistError, setArtistError] = useState<string | null>(null);
  
  const { data: confirmedRequests = [] } = useConfirmedRequests(id ? Number(id) : undefined);
  const blockedDates = useBlockedDatesCalendar(id ? Number(id) : undefined);
  const toDateStr = (value: string | Date) =>
    typeof value === 'string' ? value.slice(0, 10) : format(value, 'yyyy-MM-dd');

  // Convert confirmed requests to calendar dates
  const calendarDates = useMemo(() => {
    const confirmed = confirmedRequests.map(req => ({
      date: toDateStr(req.eventDate),
      available: false,
      note: `${req.eventType} - ${req.eventLocation}`,
      confirmed: true,
    }));
    
    // Combine confirmed and blocked dates
    return [...confirmed, ...blockedDates];
  }, [confirmedRequests, blockedDates]);

  useEffect(() => {
    if (!id) return;
    setLoadingArtist(true);
    setArtistError(null);
    apiFetch(`/public/users/${id}`)
      .then((data) => setArtist(data))
      .catch((err: any) => setArtistError(err.message || 'Error fetching artist'))
      .finally(() => setLoadingArtist(false));
  }, [id]);

  if (loadingArtist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Cargando artista...</div>
      </div>
    );
  }

  if (artistError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Error: {artistError}</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artista no encontrado</h1>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allowedRolesForBooking = ['Local', 'local', 'Venue', 'venue', 'Promotor', 'promoter'];
  const canSeePrices = isAuthenticated && allowedRolesForBooking.includes(user?.role ?? '');
  const canBook = canSeePrices;

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      toast({ title: 'Debes iniciar sesión', description: 'Inicia sesión como Local o Promotor para enviar solicitudes', variant: 'destructive', duration: 4000 });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const budget = Number(formData.get('budget'));
    const location = (formData.get('location') as string) || '';
    const eventType = (formData.get('eventType') as string) || '';
    const message = (formData.get('message') as string) || undefined;

    if (!id) return;

    try {
      await apiFetch('/requests', {
        method: 'POST',
        token,
        body: {
          artistId: Number(id),
          eventDate: new Date(date).toISOString(),
          eventLocation: location,
          eventType,
          offeredPrice: budget,
          message,
        },
      });
// Invalidate sent requests query to update the counter
      queryClient.invalidateQueries({ queryKey: ['sent-requests'] });

      
      setBookingDialogOpen(false);
      toast({
        title: 'Solicitud enviada',
        description: `Tu solicitud para ${artist.nickName || artist.name} ha sido enviada correctamente.`,
        duration: 4000,
      });
    } catch (err: any) {
      const messageErr = err?.message || 'No se pudo enviar la solicitud';
      toast({ title: 'Error', description: messageErr, variant: 'destructive', duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="h-64 lg:h-80">
          {artist.banner ? (
            <img
              src={artist.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={`https://picsum.photos/1200/400?random=${Math.random()}`}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="absolute top-4 left-4">
          <Button
            variant="glass"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarImage src={artist.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist'} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {artist.nickName?.charAt(0) || artist.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl lg:text-4xl font-display font-bold">
                      {artist.nickName || artist.name}
                    </h1>
                    {artist.verified && (
                      <CheckCircle className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">{artist.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    {(artist.city || artist.country) && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{artist.city || 'Ciudad'}, {artist.country || 'País'}</span>
                      </div>
                    )}
                    {artist.rating && (
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{artist.rating}</span>
                        {artist.totalShows > 0 && (
                          <span className="text-muted-foreground">
                            ({artist.totalShows} shows)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {canBook && (
                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="lg">
                      <Send className="w-5 h-5 mr-2" />
                      Solicitar Contratación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Solicitar a {artist.nickName || artist.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Fecha del evento</Label>
                          <Input 
                            id="date" 
                            name="date" 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Presupuesto (€)</Label>
                          <Input id="budget" name="budget" type="number" placeholder="2500" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Ubicación del evento</Label>
                        <Input id="location" name="location" placeholder="Nombre del local, ciudad" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Tipo de evento</Label>
                        <Input id="eventType" name="eventType" placeholder="Festival, Club Night, Concierto..." required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje (opcional)</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Describe tu evento y lo que esperas del artista..."
                          rows={3}
                        />
                      </div>
                      <Button type="submit" variant="gradient" className="w-full">
                        Enviar Solicitud
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Sobre {artist.nickName || artist.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{artist.bio || 'Sin biografía disponible'}</p>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Géneros Musicales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.genre?.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-sm px-3 py-1">
                      <Music className="w-3 h-3 mr-1" />
                      {genre}
                    </Badge>
                  ))}
                  {(!artist.genre || artist.genre.length === 0) && (
                    <p className="text-muted-foreground text-sm">Sin géneros especificados</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {artist.gallery && artist.gallery.length > 0 && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Galería</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {artist.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                     calt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendar */}
            <ArtistCalendar 
              dates={calendarDates} 
              editable={false}
              onDateSelect={(date) => {
                setSelectedDate(format(date, 'yyyy-MM-dd'));
                if (canBook) {
                  setBookingDialogOpen(true);
                }
              }}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing - only visible for venues/promoters */}
            {canSeePrices && (
              <Card variant="gradient" className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Precios
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm text-muted-foreground mb-1">Caché base</p>
                    <p className="text-3xl font-bold text-primary">
                      €{artist.basePrice?.toLocaleString() || '0'}
                    </p>
                  </div>

                  {artist.priceVariants?.map((variant) => (
                    <div key={variant.id} className="p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{variant.name}</p>
                        <p className="font-bold text-primary">
                          €{variant.price?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {variant.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {!isAuthenticated && (
              <Card variant="gradient" className="border-primary/30">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-bold mb-2">
                    ¿Quieres contratar a {artist.nickName || artist.name}?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inicia sesión como Local o Promotor para ver precios y enviar solicitudes.
                  </p>
                  <Button variant="gradient" className="w-full" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Social links */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span>{artist.socialLinks.instagram.replace('@', '')}</span>
                  </a>
                )}
                {artist.socialLinks?.youtube && (
                  <a
                    href={`https://youtube.com/${artist.socialLinks.youtube.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span>@{artist.socialLinks.youtube.replace('@', '')}</span>
                  </a>
                )}
                {artist.socialLinks?.spotify && (
                  <a
                    href={`https://open.spotify.com/artist/${artist.socialLinks.spotify}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <Music className="w-5 h-5 text-green-500" />
                    <span>Spotify</span>
                  </a>
                )}
                {artist.socialLinks?.website && (
                  <a
                    href={artist.socialLinks.website.startsWith('http') ? artist.socialLinks.website : `https://${artist.socialLinks.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span>{artist.socialLinks.website}</span>
                  </a>
                )}
                {!artist.socialLinks?.instagram && !artist.socialLinks?.youtube && !artist.socialLinks?.spotify && !artist.socialLinks?.website && (
                  <p className="text-muted-foreground text-sm">Sin redes sociales configuradas</p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shows realizados</span>
                  <span className="font-bold text-xl">{artist.totalShows || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valoración media</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-accent fill-current" />
                    <span className="font-bold text-xl">{artist.rating || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
