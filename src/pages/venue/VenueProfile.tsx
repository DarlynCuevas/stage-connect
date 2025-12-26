import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  MapPinned,
  DoorOpen,
  UserCog,
  Headphones,
  Radio,
  Drum,
  KeyRound,
  Bus,
  UserPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { countries, cities } from '@/data/mockData';
import { VenueCalendarComponent } from '@/components/calendar/VenueCalendarComponent';
import { CalendarComponent } from '@/components/calendar/CalendarComponent';
import { CalendarDays, User as UserIcon, Music } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useConfirmedRequestsByVenue } from '@/lib/requests';
import useUploadImage from '@/hooks/useUploadImage';


export default function VenueProfile() {
  const [tabValue, setTabValue] = useState('info');
   const { user: authUser, token, setUser } = useAuth();
  // Hook para subir imágenes
  const uploadImage = useUploadImage(token);
  const [eventsToShow, setEventsToShow] = useState(3);
  // Próximos eventos reales desde el backend
  const params = useParams();
  const venueIdParam = params.venueId || params.id;
  const venueId = venueIdParam ? Number(venueIdParam) : undefined;
  const { data: confirmedEvents = [] } = useConfirmedRequestsByVenue(venueId);
  // Filtrar solo eventos futuros y ordenarlos por fecha ascendente
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingEvents = Array.isArray(confirmedEvents)
    ? confirmedEvents
        .filter(ev => ev.eventDate.slice(0, 10) >= todayStr)
        .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
    : [];
  // Soporta ambas rutas: /venue/:id/profile y /artist/:artistId/venue/:venueId/profile

  // Soporta ambas rutas: /venue/:id/profile y /artist/:artistId/venue/:venueId/profile
  // venueId puede venir como 'id' o 'venueId' según la ruta
 
  // Comprobación de seguridad: solo el dueño puede ver su perfil en /venue/:id/profile
  const isOwnProfile = authUser && venueIdParam && String(authUser.id) === String(venueIdParam);
  if (!params.venueId && venueIdParam && authUser && String(authUser.id) !== String(venueIdParam)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: venue } = useUser(venueId);
  const [venueState, setVenueState] = useState<any>(null);

  useEffect(() => {
    if (isOwnProfile && authUser) {
      setEditData(authUser);
      setVenueState(authUser);
    } else if (venue) {
      setEditData(venue);
      setVenueState(venue);
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
        setVenueState(updatedUser.user);
        setEditData(updatedUser.user);
      } else if (updatedUser) {
        setVenueState(updatedUser);
        setEditData(updatedUser);
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
    setEditData(venueState); // Usar el estado más reciente, no el objeto venue original
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
    { id: 'backstage', label: 'Camerino privado / backstage', icon: DoorOpen },
    { id: 'tecnico', label: 'Técnico de sonido/luz incluido', icon: UserCog },
    { id: 'djbooth', label: 'Cabina de DJ equipada', icon: Headphones },
    { id: 'micros', label: 'Micrófonos inalámbricos', icon: Radio },
    { id: 'instrumentos', label: 'Instrumentos disponibles (batería, teclado, amplificadores)', icon: Drum },
    { id: 'entradaexclusiva', label: 'Acceso exclusivo/entrada reservada', icon: KeyRound },
    { id: 'shuttle', label: 'Servicio de transporte (shuttle)', icon: Bus },
  ];

  // Detectar el contexto principal según el orden de la URL (soporte hash routing)
  // Si la ruta empieza por /artist/:artistId/venue/:venueId/profile => contexto artista
  // Si la ruta empieza por /venue/:venueId/artist/:artistId/profile => contexto local
  let mainContext: 'artist' | 'venue' = 'venue';
  let path = '';
  if (typeof window !== 'undefined') {
    path = window.location.hash ? window.location.hash.replace(/^#/, '') : window.location.pathname;
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
      {/* Header con banner visual tipo ArtistProfile */}
      {/* Banner estilo YouTube */}
      <div className="relative w-full flex flex-col items-center mb-20">
        <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden group relative" style={{height: '120px'}}>
          <img
            src={editData?.banner || venue?.banner || `https://picsum.photos/1600/300?random=1`}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          {isEditing && (
            <label className="absolute left-1/2 -translate-x-1/2 bottom-2 w-2/3 flex items-center justify-center cursor-pointer group" style={{ zIndex: 20 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-background/90 border border-border shadow text-xs font-medium text-primary hover:bg-primary hover:text-white transition">
                <ImagePlus className="w-4 h-4" /> Cambiar banner
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadImage(file);
                    if (url) {
                      setEditData((prev: any) => ({ ...prev, banner: url }));
                    }
                  }
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
        {/* Avatar centrado y sobresaliendo */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{top: '80px'}}>
          <div className="relative group">
            <Avatar className="h-36 w-36 border-4 border-background shadow-2xl bg-white dark:bg-background">
              <AvatarImage src={editData?.avatar || venue?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=venue'} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {venue?.name?.charAt(0) || 'V'}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <label className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 flex items-center justify-center cursor-pointer group" style={{ zIndex: 20 }}>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-background/90 border border-border shadow text-xs font-medium text-primary hover:bg-primary hover:text-white transition">
                    <ImagePlus className="w-4 h-4" /> Cambiar foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImage(file);
                        if (url) {
                          setEditData((prev: any) => ({ ...prev, avatar: url }));
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
        </div>
        {/* Info principal centrada debajo del avatar */}
        <div className="flex flex-col items-center mt-24 w-full">
          <div className="flex flex-col items-center gap-2">
            {isEditing ? (
              <Input
                value={editData?.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Nombre del local"
                className="text-3xl font-display font-bold max-w-md bg-white/80 dark:bg-background/80 border-none shadow-none focus:ring-2 focus:ring-primary/30 text-center"
              />
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <h1 className="text-4xl font-display font-bold tracking-tight text-center text-gray-900 dark:text-white drop-shadow-sm flex items-center">
                  {venue?.name || 'Mi Local'}
                  {venue?.verified && (
                    <span title="Local verificado" className="inline-flex items-center bg-black rounded-full p-1 border-2 border-white dark:border-background ml-2 align-middle" style={{width: '32px', height: '32px'}}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#111" />
                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </h1>
              </div>
            )}
            {/* Tipo de negocio y capacidad en la misma línea */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-1 justify-center">
              {/* Vista pública: tipo de negocio y capacidad juntos */}
              {!isEditing && (
                <>
                  {venue?.type && (
                    <span className="text-base font-semibold">{venue.type}</span>
                  )}
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/40 text-muted-foreground text-sm font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{venue?.capacity || '—'}</span>
                  </div>
                </>
              )}
              {/* Edición: selector y capacidad */}
              {isEditing && (
                <>
                  <select
                    value={editData?.type || ''}
                    onChange={e => setEditData({ ...editData, type: e.target.value })}
                    className="max-w-xs text-center rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-muted mb-1"
                  >
                    <option value="">Seleccionar tipo de negocio</option>
                    <option value="Bar">Bar</option>
                    <option value="Discoteca">Discoteca</option>
                    <option value="Sala de conciertos">Sala de conciertos</option>
                    <option value="Teatro">Teatro</option>
                    <option value="Pub">Pub</option>
                    <option value="Club social">Club social</option>
                    <option value="Centro cultural">Centro cultural</option>
                    <option value="Restaurante con música en vivo">Restaurante con música en vivo</option>
                    <option value="Terraza/Rooftop">Terraza/Rooftop</option>
                    <option value="Espacio multiusos">Espacio multiusos</option>
                    <option value="Auditorio">Auditorio</option>
                    <option value="Café concierto">Café concierto</option>
                    <option value="Lounge">Lounge</option>
                    <option value="Carpa/Espacio al aire libre">Carpa/Espacio al aire libre</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/40 text-muted-foreground text-sm font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    <Input
                      type="number"
                      min={1}
                      value={editData?.capacity || ''}
                      onChange={e => setEditData({ ...editData, capacity: e.target.value })}
                      placeholder="Capacidad"
                      className="w-16 text-center bg-transparent border-none shadow-none focus:ring-0 p-0"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1 justify-center">
              <MapPin className="w-5 h-5" />
              <span className="text-base">{isEditing
                ? ((editData as any)?.city || 'Ciudad') + ', ' + ((editData as any)?.country || 'País')
                : ((venue as any)?.city || 'Ciudad') + ', ' + ((venue as any)?.country || 'País')
              }</span>
            </div>
            {/* Horario de apertura y cierre */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-1 justify-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Horario:</span>
                {isEditing ? (
                  <>
                    <Input
                      type="time"
                      value={editData?.openingTime || ''}
                      onChange={e => setEditData({ ...editData, openingTime: e.target.value })}
                      className="w-24 text-center"
                    />
                    <span>-</span>
                    <Input
                      type="time"
                      value={editData?.closingTime || ''}
                      onChange={e => setEditData({ ...editData, closingTime: e.target.value })}
                      className="w-24 text-center"
                    />
                  </>
                ) : (
                  <span>
                    {(venue as any)?.openingTime || 'No especificado'} - {(venue as any)?.closingTime || 'No especificado'}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Botones de edición */}
          {isOwnProfile && (
            <div className="flex gap-3 mt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="lg" className="rounded-full px-6 py-2 text-base font-semibold shadow-sm hover:bg-primary/10 transition-all">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={updateProfileMutation.isPending} size="lg" className="rounded-full px-6 py-2 text-base font-semibold shadow-md bg-primary text-white hover:bg-primary/90 transition-all">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button onClick={handleCancel} variant="ghost" size="lg" className="rounded-full px-6 py-2 text-base font-semibold shadow-sm hover:bg-muted/30 transition-all">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        {/* Biografía/Descripción del local debajo de la cabecera */}
        <div className="w-full max-w-xl mx-auto mt-6 mb-2">
          {isEditing ? (
            <Textarea
              value={(editData as any)?.bio || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value } as any)}
              placeholder="Describe tu local: ambiente, tipo de música, eventos que organizas, lo que hace especial a tu local..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed text-center text-lg">
              {(venue as any)?.bio || 'No hay descripción disponible.'}
            </p>
          )}
        </div>

        {/* Galería de fotos debajo de la biografía */}
        <div className="w-full max-w-4xl mx-auto mt-4 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
            <span>Galería de fotos</span>
            <ImagePlus className="w-5 h-5 text-primary" />
          </h2>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-border/30">
            <div className="flex gap-4 min-w-[320px] pb-2">
              {(isEditing
                ? Array.isArray(editData?.gallery)
                  ? editData.gallery
                  : typeof editData?.gallery === 'string'
                    ? editData.gallery.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : []
                : Array.isArray(venueState?.gallery)
                  ? venueState.gallery
                  : typeof venueState?.gallery === 'string'
                    ? venueState.gallery.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : []
              ).map((photo: string, index: number) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="relative group aspect-square w-40 sm:w-48 md:w-56 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0">
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
              ))}
              {isEditing && (
                <div className="aspect-square w-40 sm:w-48 md:w-56 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 p-4 flex-shrink-0">
                  <label className="w-full flex flex-col items-center justify-center cursor-pointer group">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-background/90 border border-border shadow text-xs font-medium text-primary hover:bg-primary hover:text-white transition">
                      <ImagePlus className="w-4 h-4" /> Añadir foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file);
                          if (url) {
                            setEditData((prev: any) => ({
                              ...prev,
                              gallery: [...((prev?.gallery || [])), url]
                            }));
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pestañas de información, calendario y ubicación */}
        <div className="w-full max-w-4xl mx-auto mt-2">
          <Tabs defaultValue="informacion" value={tabValue} onValueChange={v => {
            setTabValue(v);
            if (v === 'events') setEventsToShow(3);
          }} className="w-full">
            <TabsList className="w-full flex justify-center mb-4">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" /> Próximos eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center">No hay eventos próximos.</p>
                  ) : (
                    <>
                      <ul className="space-y-4">
                        {upcomingEvents.slice(0, eventsToShow).map(ev => (
                          <li
                            key={ev.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/10"
                            style={{ listStyle: 'none' }}
                          >
                            <img src={ev.artist?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist'} alt={ev.artist?.name || 'Artista'} className="w-14 h-14 rounded-full object-cover border border-primary/40" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Music className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-base truncate">{ev.eventType}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <UserIcon className="w-4 h-4" />
                                <span className="truncate">{ev.artist?.name || 'Artista'}</span>
                                {ev.artist?.genre && (
                                  <><span className="mx-2">·</span><span>{Array.isArray(ev.artist.genre) ? ev.artist.genre.join(', ') : ev.artist.genre}</span></>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end min-w-[90px]">
                              <span className="text-primary font-bold text-lg">{new Date(ev.eventDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                              <span className="text-xs text-muted-foreground">{new Date(ev.eventDate).toLocaleDateString('es-ES', { year: 'numeric' })}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {upcomingEvents.length > eventsToShow && (
                        <div className="flex justify-center mt-4">
                          <button
                            className="px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
                            onClick={() => setEventsToShow(eventsToShow + 3)}
                          >
                            Cargar más eventos
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
                        
            <TabsContent value="info">
              {/* Información del local unificada */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music2 className="w-5 h-5" />
                    Información del local
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Equipamiento y servicios */}
                  <div>
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <Music2 className="w-4 h-4" /> Equipamiento y Servicios
                    </h3>
                    {(() => {
                      // Dividir amenities en dos columnas
                      const mid = Math.ceil(amenitiesList.length / 2);
                      const col1 = amenitiesList.slice(0, mid);
                      const col2 = amenitiesList.slice(mid);
                      if (isEditing) {
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <ul className="space-y-2">
                              {col1.map((amenity) => {
                                const checked = ((editData as any)?.amenities || []).includes(amenity.id);
                                return (
                                  <li
                                    key={amenity.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/10"
                                    style={{ listStyle: 'none' }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleAmenity(amenity.id)}
                                      className="form-checkbox h-5 w-5 text-primary border-primary focus:ring-primary/40"
                                      id={`amenity-${amenity.id}`}
                                    />
                                    <label htmlFor={`amenity-${amenity.id}`} className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                                      <amenity.icon className="w-5 h-5" />
                                      <span>{amenity.label}</span>
                                    </label>
                                  </li>
                                );
                              })}
                            </ul>
                            <ul className="space-y-2">
                              {col2.map((amenity) => {
                                const checked = ((editData as any)?.amenities || []).includes(amenity.id);
                                return (
                                  <li
                                    key={amenity.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/10"
                                    style={{ listStyle: 'none' }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleAmenity(amenity.id)}
                                      className="form-checkbox h-5 w-5 text-primary border-primary focus:ring-primary/40"
                                      id={`amenity-${amenity.id}`}
                                    />
                                    <label htmlFor={`amenity-${amenity.id}`} className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                                      <amenity.icon className="w-5 h-5" />
                                      <span>{amenity.label}</span>
                                    </label>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      } else {
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                            <ul className="space-y-2">
                              {col1.map((amenity) => {
                                const hasAmenity = ((venue as any)?.amenities || []).includes(amenity.id);
                                return (
                                  <li
                                    key={amenity.id}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150
                                      ${hasAmenity
                                        ? 'bg-primary/10 border border-primary/60 text-primary shadow-sm'
                                        : 'bg-muted/10 text-muted-foreground opacity-40'}
                                    `}
                                    style={{ listStyle: 'none' }}
                                  >
                                    <amenity.icon className={`w-5 h-5 transition-all duration-150 ${hasAmenity ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className={hasAmenity ? 'font-semibold' : ''}>{amenity.label}</span>
                                    {hasAmenity && <Check className="w-4 h-4 text-primary ml-auto" />}
                                  </li>
                                );
                              })}
                            </ul>
                            <ul className="space-y-2">
                              {col2.map((amenity) => {
                                const hasAmenity = ((venue as any)?.amenities || []).includes(amenity.id);
                                return (
                                  <li
                                    key={amenity.id}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150
                                      ${hasAmenity
                                        ? 'bg-primary/10 border border-primary/60 text-primary shadow-sm'
                                        : 'bg-muted/10 text-muted-foreground opacity-40'}
                                    `}
                                    style={{ listStyle: 'none' }}
                                  >
                                    <amenity.icon className={`w-5 h-5 transition-all duration-150 ${hasAmenity ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className={hasAmenity ? 'font-semibold' : ''}>{amenity.label}</span>
                                    {hasAmenity && <Check className="w-4 h-4 text-primary ml-auto" />}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      }
                    })()}
                  </div>
                  {/* Horario movido a la sección principal de información */}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar">
              <div className="rounded-2xl bg-white/80 dark:bg-background/80 shadow-md border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">Calendario de la sala</h2>
                <VenueCalendarComponent venueId={venueId} editable={isOwnProfile} />
              </div>
            </TabsContent>
            {/* Ubicación al final de la página */}
          </Tabs>
        </div>
      </div>
      {/* ...resto del contenido... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mt-10">
        {/* Columna principal (2/3) */}
        </div>
        {/* Columna lateral (1/3) */}
        <div className="flex flex-col gap-8">
          {/* Info detallada, amenities, capacidad, horario, ubicación, contacto, etc. */}
          {/* Puedes seguir añadiendo aquí más tarjetas según lo necesites */}
        </div>
      {/* Ubicación al final de la página */}
      <div className="w-full max-w-4xl mx-auto mt-0 mb-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="w-5 h-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="flex flex-col gap-2 mb-2">
                <input
                  type="text"
                  className="rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
                  placeholder="Dirección (calle, número, etc)"
                  value={editData?.address || ''}
                  onChange={e => setEditData({ ...editData, address: e.target.value })}
                />
                <input
                  type="text"
                  className="rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
                  placeholder="URL de Google Maps (opcional)"
                  value={editData?.mapUrl || ''}
                  onChange={e => setEditData({ ...editData, mapUrl: e.target.value })}
                />
                <div className="text-xs text-muted-foreground">Pega aquí la URL de Google Maps para mostrar el mapa en tu perfil.</div>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  {(venue as any)?.address || 'No especificado'}<br />
                  {(venue as any)?.city || ''}{(venue as any)?.city ? ', ' : ''}{(venue as any)?.country || ''}
                </div>
                {(venue as any)?.mapUrl && (
                  <div className="rounded-lg overflow-hidden border border-border h-40">
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </HeaderLayout>
  );
}
