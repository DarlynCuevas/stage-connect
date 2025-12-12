import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockArtists, mockCalendarDates } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArtistCalendar } from '@/components/calendar/ArtistCalendar';
import { ArrowLeft, MapPin, Star, Music, CheckCircle, Send, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ArtistPublicProfile() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const artist = mockArtists.find(a => a.id === id);

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Artista no encontrado</h1>
          <Button asChild><Link to="/">Volver</Link></Button>
        </div>
      </div>
    );
  }

  const canSeePrices = isAuthenticated && (user?.role === 'venue' || user?.role === 'promoter');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingDialogOpen(false);
    toast({ title: 'Solicitud enviada', description: `Tu solicitud para ${artist.stageName} ha sido enviada.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-tight py-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Volver
        </Button>

        <div className="flex items-start gap-6 mb-8">
          <img src={artist.avatar} alt={artist.stageName} className="w-24 h-24 rounded-xl object-cover border border-border" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">{artist.stageName}</h1>
              {artist.verified && <CheckCircle className="w-5 h-5 text-success" />}
            </div>
            <p className="text-muted-foreground mb-2">{artist.name}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3.5 h-3.5" />{artist.city}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent" />{artist.rating} ({artist.totalShows} shows)</span>
            </div>
          </div>
          {canSeePrices && (
            <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg"><Send className="w-4 h-4 mr-2" />Contratar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Solicitar a {artist.stageName}</DialogTitle></DialogHeader>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Fecha</Label><Input type="date" required /></div>
                    <div><Label>Presupuesto (€)</Label><Input type="number" required /></div>
                  </div>
                  <div><Label>Ubicación</Label><Input placeholder="Local, ciudad" required /></div>
                  <div><Label>Mensaje</Label><Textarea rows={3} /></div>
                  <Button type="submit" className="w-full">Enviar Solicitud</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="outline">
              <CardHeader><CardTitle className="text-base">Sobre {artist.stageName}</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">{artist.bio}</p></CardContent>
            </Card>
            <Card variant="outline">
              <CardHeader><CardTitle className="text-base">Géneros</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.genre.map((g) => <Badge key={g} variant="secondary"><Music className="w-3 h-3 mr-1" />{g}</Badge>)}
                </div>
              </CardContent>
            </Card>
            <ArtistCalendar dates={mockCalendarDates} editable={false} />
          </div>

          <div className="space-y-6">
            {canSeePrices && (
              <Card variant="outline">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><DollarSign className="w-4 h-4 text-primary" />Precios</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <p className="text-xs text-muted-foreground">Caché base</p>
                    <p className="text-2xl font-bold text-primary">€{artist.basePrice.toLocaleString()}</p>
                  </div>
                  {artist.priceVariants?.map((v) => (
                    <div key={v.id} className="flex justify-between text-sm p-2 bg-secondary/30 rounded">
                      <span>{v.name}</span><span className="font-medium text-primary">€{v.price.toLocaleString()}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {!isAuthenticated && (
              <Card variant="outline">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">Inicia sesión para ver precios y contratar.</p>
                  <Button asChild className="w-full"><Link to="/login">Iniciar Sesión</Link></Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
