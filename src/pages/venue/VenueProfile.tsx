import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useUser } from '@/lib/users';
import { 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Building2, 
  Music2, 
  Users, 
  Clock, 
  Mic2,
  Volume2,
  ImagePlus,
  Trash2,
  Check,
  MapPinned
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { VenueCalendarComponent } from '@/components/calendar/VenueCalendarComponent';


export default function VenueProfile() {
  // Soporta ambas rutas: /venue/:id/profile y /artist/:artistId/venue/:venueId/profile
  const params = useParams();

  // Soporta ambas rutas: /venue/:id/profile y /artist/:artistId/venue/:venueId/profile
  // venueId puede venir como 'id' o 'venueId' según la ruta
  const venueIdParam = params.venueId || params.id;
  const { user: authUser, token, setUser } = useAuth();
  // Comprobación de seguridad: solo el dueño puede ver su perfil en /venue/:id/profile
  const isOwnProfile = authUser && venueIdParam && String(authUser.id) === String(venueIdParam);
  if (!params.venueId && venueIdParam && authUser && String(authUser.id) !== String(venueIdParam)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const venueId = venueIdParam ? Number(venueIdParam) : undefined;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: venue } = useUser(venueId);

  useEffect(() => {
    if (isOwnProfile && authUser) {
      setEditData(authUser);
    } else if (venue) {
      setEditData(venue);
    }
  }, [isOwnProfile, authUser, venue]);

  if (!editData) {
    return (
      <HeaderLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No se encontró el local</p>
        </div>
      </HeaderLayout>
    );
  }

  const handleSave = async () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'No estás autenticado',
        variant: 'destructive',
        duration: 4000,
      });
      return;
    }

    try {
      const updatedUser = await updateProfileMutation.mutateAsync({ 
        profileData: editData, 
        token 
      });
      
      if (updatedUser?.user) {
        setUser(updatedUser.user);
      }
      
      setIsEditing(false);
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente.',
        duration: 4000,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el perfil',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setEditData(venue);
    setIsEditing(false);
  };

  const addPhoto = () => {
    if (newPhotoUrl && editData) {
      const currentGallery = (editData as any)?.gallery || [];
      setEditData({
        ...editData,
        gallery: [...currentGallery, newPhotoUrl]
      } as any);
      setNewPhotoUrl('');
    }
  };

  const removePhoto = async (index: number) => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'No estás autenticado',
        variant: 'destructive',
        duration: 4000,
      });
      return;
    }
    if (editData) {
      const currentGallery = (editData as any)?.gallery || [];
      const newGallery = currentGallery.filter((_: any, i: number) => i !== index);
      setEditData({
        ...editData,
        gallery: newGallery
      } as any);
      try {
        const updatedUser = await updateProfileMutation.mutateAsync({
          profileData: { ...editData, gallery: newGallery },
          token
        });
        if (updatedUser?.user) {
          setUser(updatedUser.user);
        }
        toast({
          title: 'Foto eliminada',
          description: 'La foto fue eliminada de la galería.',
          duration: 3000,
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'No se pudo eliminar la foto',
          variant: 'destructive',
          duration: 4000,
        });
      }
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (editData) {
      const currentAmenities = (editData as any)?.amenities || [];
      const hasAmenity = currentAmenities.includes(amenity);
      setEditData({
        ...editData,
        amenities: hasAmenity 
          ? currentAmenities.filter((a: string) => a !== amenity)
          : [...currentAmenities, amenity]
      } as any);
    }
  };

  const amenitiesList = [
    { id: 'stage', label: 'Tarima/Escenario', icon: Mic2 },
    { id: 'sound', label: 'Sistema de Sonido Profesional', icon: Volume2 },
    { id: 'lights', label: 'Iluminación Profesional', icon: Music2 },
    { id: 'bar', label: 'Bar', icon: Building2 },
    { id: 'vip', label: 'Zona VIP', icon: Users },
    { id: 'parking', label: 'Parking', icon: MapPin },
  ];

  // Detectar el contexto principal según el orden de la URL (soporte hash routing)
  // Si la ruta empieza por /artist/:artistId/venue/:venueId/profile => contexto artista
  // Si la ruta empieza por /venue/:venueId/artist/:artistId/profile => contexto local
  let mainContext: 'artist' | 'venue' = 'venue';
  let path = '';
  if (typeof window !== 'undefined') {
    path = window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname;
    console.log('VenueProfile path detectado:', path);
    if (/^\/artist\//.test(path)) {
      mainContext = 'artist';
    } else if (/^\/venue\//.test(path)) {
      mainContext = 'venue';
    }
  }

  // Extraer artistId de params o de la URL si no existe
  let artistId = params.artistId;
  if (!artistId && path) {
    const match = path.match(/^\/artist\/(\d+)/);
    if (match) artistId = match[1];
  }
  const artistNav = artistId ? [
    { to: `/artist/${artistId}/discover`, label: 'Inicio' },
    { to: `/artist/${artistId}/dashboard`, label: 'Panel de datos' },
    { to: `/artist/${artistId}/profile`, label: 'Mi perfil' },
    { to: `/artist/${artistId}/calendar`, label: 'Calendario' },
    { to: `/artist/${artistId}/requests`, label: 'Solicitudes' },
  ] : [];

  // Tabs de local
  const localNav = [
    { to: `/venue/${venueIdParam}/discover`, label: 'Inicio' },
    { to: `/venue/${venueIdParam}/dashboard`, label: 'Panel de datos' },
    { to: `/venue/${venueIdParam}/profile`, label: 'Mi perfil' },
    { to: `/venue/${venueIdParam}/calendar`, label: 'Calendario' },
    { to: `/venue/${venueIdParam}/requests`, label: 'Solicitudes' },
  ];

  // Log de depuración para menú seleccionado
  return (
    <HeaderLayout profileTabs={mainContext === 'artist' ? artistNav : localNav}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">
                {venue?.name || 'Mi Local'}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{(venue as any)?.city || 'Ciudad'}, {(venue as any)?.country || 'País'}</span>
              </div>
            </div>
            {/* Avatar + Eliminar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 border-2 border-sidebar-border">
                <AvatarImage src={editData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=venue'} />
                <AvatarFallback>{venue?.name?.charAt(0) || 'V'}</AvatarFallback>
              </Avatar>
              {isEditing && editData?.avatar && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-2"
                  onClick={() => setEditData({ ...editData, avatar: '' })}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Quitar foto
                </Button>
              )}
            </div>
          </div>
          {isOwnProfile && (
            !isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="lg">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateProfileMutation.isPending} size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button onClick={handleCancel} variant="ghost" size="lg">
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )
          )}
        </div>

        {/* Photo Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5" />
              Fotos del Local
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {((venue as any)?.gallery && (venue as any).gallery.length > 0)
                ? (venue as any).gallery.map((photo: string, index: number) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                          <img 
                            src={photo} 
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                await removePhoto(index);
                              }}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-0">
                        <img 
                          src={photo} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-auto max-h-[90vh] object-contain"
                        />
                      </DialogContent>
                    </Dialog>
                  ))
                : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 p-4">
                    <Input
                      placeholder="URL de la foto"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      className="text-xs"
                    />
                    <Button size="sm" onClick={addPhoto} disabled={!newPhotoUrl}>
                      <ImagePlus className="w-4 h-4 mr-1" />
                      Añadir
                    </Button>
                  </div>
                )}
              {isEditing && (venue as any)?.gallery && (venue as any).gallery.length > 0 && (
                <div className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 p-4">
                  <Input
                    placeholder="URL de la foto"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button size="sm" onClick={addPhoto} disabled={!newPhotoUrl}>
                    <ImagePlus className="w-4 h-4 mr-1" />
                    Añadir
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar debajo de galería */}
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-2">Calendario de la sala</h2>
          <p className="text-muted-foreground mb-4">Consulta y gestiona la disponibilidad de este local.</p>
          <VenueCalendarComponent venueId={venueId} editable={isOwnProfile} />
        </div>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre este local</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={(editData as any)?.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value } as any)}
                placeholder="Describe tu local: ambiente, tipo de música, eventos que organizas, lo que hace especial a tu local..."
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">
                {(venue as any)?.bio || 'No hay descripción disponible.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Venue Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amenities & Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="w-5 h-5" />
                Equipamiento y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {amenitiesList.map((amenity) => {
                  const hasAmenity = ((venue as any)?.amenities || []).includes(amenity.id);
                  return (
                    <div key={amenity.id}>
                      {isEditing ? (
                        <button
                          onClick={() => toggleAmenity(amenity.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                            ((editData as any)?.amenities || []).includes(amenity.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <amenity.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{amenity.label}</span>
                          </div>
                          {((editData as any)?.amenities || []).includes(amenity.id) && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      ) : (
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${hasAmenity ? 'opacity-100' : 'opacity-40'}`}>
                          <amenity.icon className="w-5 h-5" />
                          <span className="text-sm">{amenity.label}</span>
                          {hasAmenity && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Capacity & Hours */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Capacidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Aforo máximo</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={(editData as any)?.capacity || ''}
                      onChange={(e) => setEditData({ ...editData, capacity: e.target.value } as any)}
                      placeholder="Ej: 500"
                    />
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold text-primary">
                      {(venue as any)?.capacity || '—'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">personas</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="openingTime">Hora de apertura</Label>
                  {isEditing ? (
                    <Input
                      id="openingTime"
                      type="time"
                      value={(editData as any)?.openingTime || ''}
                      onChange={(e) => setEditData({ ...editData, openingTime: e.target.value } as any)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {(venue as any)?.openingTime || 'No especificado'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="closingTime">Hora de cierre</Label>
                  {isEditing ? (
                    <Input
                      id="closingTime"
                      type="time"
                      value={(editData as any)?.closingTime || ''}
                      onChange={(e) => setEditData({ ...editData, closingTime: e.target.value } as any)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      {(venue as any)?.closingTime || 'No especificado'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location & Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="w-5 h-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address">Dirección</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={(editData as any)?.address || ''}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value } as any)}
                    placeholder="Calle y número"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {(venue as any)?.address || 'No especificado'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={(editData as any)?.city || ''}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value } as any)}
                    placeholder="Ciudad"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {(venue as any)?.city || 'No especificado'}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                {isEditing ? (
                  <Input
                    id="country"
                    value={(editData as any)?.country || ''}
                    onChange={(e) => setEditData({ ...editData, country: e.target.value } as any)}
                    placeholder="País"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {(venue as any)?.country || 'No especificado'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div>
                <Label htmlFor="mapUrl">URL del mapa (Google Maps embed)</Label>
                <Input
                  id="mapUrl"
                  value={(editData as any)?.mapUrl || ''}
                  onChange={(e) => setEditData({ ...editData, mapUrl: e.target.value } as any)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ve a Google Maps → Compartir → Insertar un mapa → Copia el código iframe src
                </p>
              </div>
            )}

            {(venue as any)?.mapUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-[400px]">
                <iframe
                  src={(venue as any).mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <p className="text-sm text-muted-foreground mt-1">{venue?.email}</p>
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={(editData as any)?.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value } as any)}
                  placeholder="+34 123 456 789"
                />
              ) : (
                <p className="text-sm text-muted-foreground mt-1">
                  {(venue as any)?.phone || 'No especificado'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </HeaderLayout>
  );
}
