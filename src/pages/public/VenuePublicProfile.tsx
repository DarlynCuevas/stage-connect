import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Globe,
  Users,
  Clock,
  Phone,
  Mail,
  Building2,
  Calendar,
  Music,
  Wifi,
  Car,
  Shield,
  Volume2,
  LogIn,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';

interface Venue {
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
  website?: string;
  capacity?: number;
  amenities?: string[];
  openingTime?: string;
  closingTime?: string;
  mapUrl?: string;
  gallery?: string[];
}

function VenuePublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const isOwner = Number(user?.id) === Number(id);
  const isArtist = user?.role === 'Artista';
  const isPromoter = user?.role === 'Promotor';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    
    console.log('🔍 [VenuePublicProfile] Fetching venue with id:', id);
    
    apiFetch(`/public/users/${id}`)
      .then((data) => {
        console.log('✅ [VenuePublicProfile] Venue data received:', data);
        setVenue(data);
        setFormData(data); // Initialize form data
      })
      .catch((err: any) => {
        console.error('❌ [VenuePublicProfile] Error:', err);
        setError(err.message || 'Error fetching venue');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(venue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(venue);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      setVenue(response);
      setFormData(response);
      setIsEditing(false);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente.",
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error",
        description: err.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando local...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || 'Local no encontrado'}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = venue.nickName || venue.name || 'Local';
  const location = [venue.city, venue.province].filter(Boolean).join(', ');
  const fullAddress = venue.address || location;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="h-64 lg:h-80">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <Button variant="glass" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2">
            {!isEditing ? (
              <Button variant="glass" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button variant="glass" size="sm" onClick={handleCancel} disabled={saving}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button variant="hero" size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </>
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                  <AvatarImage src={venue.avatar} alt={displayName} />
                  <AvatarFallback className="text-3xl bg-role-venue text-white">
                    {displayName?.[0]?.toUpperCase() || 'L'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isEditing ? (
                      <Input
                        value={formData.nickName || formData.name || ''}
                        onChange={(e) => handleInputChange('nickName', e.target.value)}
                        className="text-3xl lg:text-4xl font-display font-bold bg-background/80 border-primary/30"
                        placeholder="Nombre del local"
                      />
                    ) : (
                      <h1 className="text-3xl lg:text-4xl font-display font-bold">{displayName}</h1>
                    )}
                    <Badge variant="secondary" className="text-sm">
                      <Building2 className="h-3 w-3 mr-1" />
                      Local
                    </Badge>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4" />
                      <Input
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-background/80 border-primary/30"
                        placeholder="Dirección completa"
                      />
                    </div>
                  ) : (
                    fullAddress && (
                      <div className="flex items-center gap-1 text-muted-foreground mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{fullAddress}</span>
                      </div>
                    )
                  )}

                  {venue.capacity && (
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <Users className="w-4 h-4" />
                      <span>Capacidad: {venue.capacity} personas</span>
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
            {(venue.bio || isEditing) && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre el local</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Describe tu local, servicios, ambiente, etc..."
                      className="min-h-[100px] bg-background/80 border-primary/30"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {venue.bio}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card variant="gradient" className="mb-8 border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {(venue.capacity || isEditing) && (
                    <div className="text-center">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={formData.capacity || ''}
                          onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                          className="text-4xl font-bold text-center bg-background/80 border-primary/30 mb-1"
                          placeholder="0"
                        />
                      ) : (
                        <div className="text-4xl font-bold text-primary mb-1">
                          {venue.capacity}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">Capacidad máxima</p>
                    </div>
                  )}
                  
                  {((venue.openingTime && venue.closingTime) || isEditing) && (
                    <div className="text-center border-l border-border pl-6">
                      {isEditing ? (
                        <div className="space-y-1">
                          <Input
                            type="time"
                            value={formData.openingTime || ''}
                            onChange={(e) => handleInputChange('openingTime', e.target.value)}
                            className="text-center bg-background/80 border-primary/30"
                            placeholder="09:00"
                          />
                          <Input
                            type="time"
                            value={formData.closingTime || ''}
                            onChange={(e) => handleInputChange('closingTime', e.target.value)}
                            className="text-center bg-background/80 border-primary/30"
                            placeholder="22:00"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl font-bold text-primary mb-1">
                          {venue.openingTime} - {venue.closingTime}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">Horario de apertura</p>
                    </div>
                  )}

                  <div className="text-center border-l border-border pl-6">
                    <div className="flex items-center justify-center mb-1">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">Disponible para eventos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {(venue.amenities && venue.amenities.length > 0) || isEditing && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Servicios y Comodidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={(formData.amenities || []).join(', ')}
                        onChange={(e) => handleInputChange('amenities', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Ej: WiFi gratis, Parking, Sistema de sonido, Bar, Aire acondicionado..."
                        className="bg-background/80 border-primary/30"
                      />
                      <p className="text-xs text-muted-foreground">Separa los servicios con comas</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {venue.amenities?.map((amenity, idx) => {
                        // Mapear algunos servicios a iconos
                        const getAmenityIcon = (amenity: string) => {
                          if (amenity.toLowerCase().includes('wifi') || amenity.toLowerCase().includes('internet')) return <Wifi className="h-5 w-5" />;
                          if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('aparcamiento')) return <Car className="h-5 w-5" />;
                          if (amenity.toLowerCase().includes('sonido') || amenity.toLowerCase().includes('audio')) return <Volume2 className="h-5 w-5" />;
                          if (amenity.toLowerCase().includes('música') || amenity.toLowerCase().includes('music')) return <Music className="h-5 w-5" />;
                          return <CheckCircle className="h-5 w-5" />;
                        };

                        return (
                          <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20">
                            {getAmenityIcon(amenity)}
                            <span className="text-sm">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {venue.gallery && venue.gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Galería del Local</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.gallery.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={url}
                          alt={`${displayName} - Imagen ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {(venue.mapUrl || isEditing) && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.mapUrl || ''}
                        onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                        placeholder="URL del mapa de Google Maps (embed)"
                        className="bg-background/80 border-primary/30"
                      />
                      <p className="text-xs text-muted-foreground">
                        Copia la URL de inserción de Google Maps
                      </p>
                    </div>
                  ) : (
                    venue.mapUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={venue.mapUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )
                  )}
                  {fullAddress && (
                    <p className="text-sm text-muted-foreground mt-2">{fullAddress}</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card - Only for Artists/Promoters */}
            {isAuthenticated && (isArtist || isPromoter) && !isOwner && (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {venue.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${venue.phone}`} className="hover:underline">
                        {venue.phone}
                      </a>
                    </div>
                  )}
                  {venue.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${venue.email}`} className="hover:underline text-sm">
                        {venue.email}
                      </a>
                    </div>
                  )}
                  {venue.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-sm"
                      >
                        Sitio web
                      </a>
                    </div>
                  )}

                  <Button className="w-full" size="lg">
                    Solicitar Evento
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* CTA for non-authenticated users */}
            {!isAuthenticated && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-6 text-center space-y-4">
                  <LogIn className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">¿Eres artista o promotor?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inicia sesión para contactar este local y organizar eventos
                    </p>
                  </div>
                  <Button onClick={() => navigate('/login')} className="w-full" size="lg">
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {venue.capacity && (
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capacidad: {venue.capacity} personas</span>
                  </div>
                )}
                {venue.openingTime && venue.closingTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Horario: {venue.openingTime} - {venue.closingTime}</span>
                  </div>
                )}
                {fullAddress && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{fullAddress}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const VenuePublicProfileWithLayout = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <>
        <Sidebar />
        <div className="lg:ml-64">
          <VenuePublicProfile />
        </div>
      </>
    );
  }
  
  return <VenuePublicProfile />;
};

export default VenuePublicProfileWithLayout;