
import ArtistGallery from '@/components/artist/ArtistGallery';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useArtistRating } from '@/hooks/useArtistRating';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useArtist, useUser } from '@/lib/users';
import useUploadImage from '@/hooks/useUploadImage';
import { useConfirmedRequests } from '@/lib/requests';
import { useRemoveManagerRelation, useReceivedManagerRequests, useCreateManagerRequest } from '@/lib/manager-requests';
import { useCreateBookingRequest } from '@/lib/requests';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { genres } from '@/data/mockData';
import {
  Edit,
  Save,
  X,
  MapPin,
  Star,
  Instagram,
  Youtube,
  Music,
  Plus,
  Trash2,
  CheckCircle,
  Globe,
  User,
  UserPlus,
  UserMinus,
  Award,
  Video,
  Mic,
  Languages,
  Briefcase,
  Clock,
  Users,
  PlayCircle,
  ImagePlus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ModalSolicitudContratacion from '@/components/calendar/ModalSolicitudContratacion';

export default function ArtistProfile() {
    // Estado para el tab activo
    const [activeTab, setActiveTab] = useState('perfil');
  const params = useParams();
  const { user: authUser, token, setUser } = useAuth();
  const uploadImage = useUploadImage(token);

  // --- Detección robusta de contexto y mainContext igual que VenueProfile ---
  let mainContext: 'artist' | 'venue' = 'artist';
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
    const match = path.match(/artist\/(\d+)/);
    if (match) artistId = match[1];
  }


  function renderEditButton() {
      if (!canEdit) return null;
      if (!isEditing) {
        return (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar Perfil
          </Button>
        );
      }
      return (
        <Button onClick={handleCancel} variant="outline">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      );
    }

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [newGenre, setNewGenre] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

  // Only Promoter and Venue can send artist requests
  const canSendRequest = authUser?.role === 'Promotor' || authUser?.role === 'Local';
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: freshArtist } = useArtist(artistId);
  const { data: confirmedRequests = [] } = useConfirmedRequests(Number(artistId));
  const createBookingRequestMutation = useCreateBookingRequest();
  const createManagerRequestMutation = useCreateManagerRequest();
  const removeManagerRelationMutation = useRemoveManagerRelation();
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  const [managerIdToAdd, setManagerIdToAdd] = useState('');

  // prefer server data when available, memoizado para evitar renders innecesarios
  // Normaliza el id para que siempre sea number y se llame id
  const currentArtist = useMemo(() => {
    const base = freshArtist || authUser;
    console.log('freshArtist , ', freshArtist);
     console.log('authUser , ', authUser);
    
    if (!base) return undefined;
    // Si viene como user_id, lo mapeamos a id
    let id = base.id ?? base.user_id;
    // Si es string, lo convertimos a number
    if (typeof id === 'string') id = Number(id);
    return { ...base, id };
  }, [freshArtist, authUser]);
  const cacheBase = currentArtist?.basePrice ?? 0;
  // Obtener rating y totalReviews con el custom hook
  const { averageRating, totalReviews, loading: ratingLoading } = useArtistRating(currentArtist?.id);

  // Fetch manager data if exists
  const { data: managerData } = useUser(
    currentArtist?.managerId ? Number(currentArtist.managerId) : undefined,
    token as string
  );

  // Solo puede editar si es artista y su id coincide con la url y NO es visitante
  const canEdit = !params.artistId && authUser && authUser.role === 'Artista' && String(authUser.id) === String(params.id);

  useEffect(() => {
    if (currentArtist) {
      setEditData(currentArtist);
    }
  }, [currentArtist]);

  // Si no hay usuario, mostrar mensaje
  if (!currentArtist) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No se encontró el artista</p>
        </div>
      </DashboardLayout>
    );
  }

  const addGenre = () => {
    if (newGenre && !editData?.genre?.includes(newGenre)) {
      setEditData({
        ...editData,
        genre: [...(editData?.genre || []), newGenre]
      });
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setEditData({
      ...editData,
      genre: editData?.genre?.filter(g => g !== genreToRemove) || []
    });
  };

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
      // Asegurar que basePrice es un número válido
      const dataToSend = {
        ...editData,
        basePrice: editData?.basePrice ? Number(editData.basePrice) : 0,
        negotiable: !!editData?.negotiable,
      };

      const updatedUser = await updateProfileMutation.mutateAsync({
        profileData: dataToSend,
        token
      });

      // Actualizar el usuario en AuthContext
      if (updatedUser?.user) {
        setUser(updatedUser.user);
      }

      setIsEditing(false);
      toast({
        title: 'Perfil actualizado',
        description: 'Los cambios se han guardado correctamente en la base de datos.',
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
    setEditData(currentArtist);
    setIsEditing(false);
  };

  const handleSolicitudContratacion = useCallback((date: Date) => {
    if (!canSendRequest) return;
    setFechaSeleccionada(date);
    setModalOpen(true);
  }, [canSendRequest, setFechaSeleccionada, setModalOpen]);

  function handleEnviarSolicitud(data: { fecha: Date; oferta: number; tipoEvento: string; ubicacion: string; nombreLocal?: string; ciudadLocal?: string; mensaje?: string }) {
    if (!artistId) return;
    createBookingRequestMutation.mutate({
      artistId: Number(artistId),
      eventDate: data.fecha.toISOString(),
      eventLocation: data.ubicacion,
      eventType: data.tipoEvento,
      offeredPrice: data.oferta,
      message: data.mensaje || '',
      nombreLocal: data.nombreLocal || '',
      ciudadLocal: data.ciudadLocal || '',
    });
  }
  // Usar siempre el id normalizado de currentArtist para los menús

  return (
    <HeaderLayout>
      
      {/* Header with banner */}
      <div className="relative w-full flex flex-col items-center mb-20">
        <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden relative" style={{ height: '180px' }}>
          <img
            src={`https://picsum.photos/1200/400?random=${Math.random()}`}
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
      </div>

     

        {/* Avatar e información principal */}
        <div className="w-full max-w-6xl mx-auto flex items-end gap-6 mt-[-60px]">
          <div className="relative">
            <Avatar className="h-36 w-36 border-4 border-background shadow-2xl bg-white dark:bg-background">
              <AvatarImage src={currentArtist?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist'} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {currentArtist?.nickName?.charAt(0) || currentArtist?.name?.charAt(0) || 'A'}
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
          <div className="flex-1 flex flex-col justify-end">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
              <div className="flex items-center gap-3 flex-wrap">
                {isEditing ? (
                  <Input
                    value={editData?.nickName || ''}
                    onChange={(e) => setEditData({ ...editData, nickName: e.target.value })}
                    placeholder="Nombre artístico"
                    className="text-2xl font-display font-bold max-w-md"
                  />
                ) : (
                  <h1 className="text-3xl font-display font-bold">{currentArtist?.nickName || currentArtist?.name || 'Artista'}</h1>
                )}
                {currentArtist?.verified && (
                  <CheckCircle className="w-6 h-6 text-primary" />
                )}
                {/* Precio base destacado editable */}
                {isEditing ? (
                  <div className="flex items-center gap-2 ml-2">
                    <Input
                      type="number"
                      min={0}
                      value={editData?.basePrice ?? ''}
                      onChange={e => setEditData({ ...editData, basePrice: e.target.value })}
                      className="w-32 text-lg font-bold border-primary/30"
                      placeholder="Caché base"
                    />
                    <span className="text-xs font-normal text-muted-foreground">€ caché base</span>
                    <label className="flex items-center gap-1 ml-4 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!editData?.negotiable}
                        onChange={e => setEditData({ ...editData, negotiable: e.target.checked })}
                        className="accent-primary"
                      />
                      <span className="text-xs text-muted-foreground">Negociable</span>
                    </label>
                  </div>
                ) : (
                  <span className="ml-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-lg border border-primary/30 shadow-sm">
                    €{(currentArtist?.basePrice ?? 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">caché base</span>
                    {currentArtist?.negotiable && (
                      <span className="ml-2 text-xs text-primary font-semibold">(Negociable)</span>
                    )}
                  </span>
                )}
                {/* Valoración en cabecera */}
                <span className="flex items-center gap-1 ml-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < Math.round(averageRating) ? '#facc15' : 'none'} />
                  ))}
                  <span className="font-bold text-lg text-foreground">{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
                </span>
              </div>
              {!isEditing && canEdit && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
            {/* Género debajo del nombre */}
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <User className="w-4 h-4" />
              {isEditing ? (
                <Select
                  value={editData?.gender || ''}
                  onValueChange={(value) => setEditData({ ...editData, gender: value })}
                >
                  <SelectTrigger className="h-8 min-w-[140px]">
                    <SelectValue placeholder="Selecciona género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hombre">Hombre</SelectItem>
                    <SelectItem value="Mujer">Mujer</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span>{currentArtist?.gender || 'No especificado'}</span>
              )}
            </div>
            {/* Géneros musicales encima del género */}
            <div className="flex flex-wrap gap-1 mb-1">
              {Array.isArray(editData?.genre ? editData.genre : currentArtist?.genre) && (isEditing ? editData.genre : currentArtist?.genre)?.map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs px-2 py-0.5 h-5 relative">
                  <Music className="w-2.5 h-2.5 mr-1" />
                  {genre}
                  {isEditing && canEdit && (
                    <button
                      onClick={() => {
                        setEditData({
                          ...editData,
                          genre: editData?.genre?.filter(g => g !== genre) || []
                        });
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </Badge>
              ))}
              {isEditing && canEdit && (
                <div className="flex gap-2">
                  <Select value={newGenre} onValueChange={setNewGenre}>
                    <SelectTrigger className="flex-1 h-8 min-w-[120px]">
                      <SelectValue placeholder="Añadir género" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.filter(g => !editData?.genre?.includes(g)).map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addGenre} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir
                  </Button>
                </div>
              )}
            </div>
            {/* Ciudad, País debajo del género */}
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={editData?.city || ''}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    placeholder="Ciudad"
                  className="h-6 text-sm"
                />
                <Input
                  value={editData?.country || ''}
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                  placeholder="País"
                  className="h-6 text-sm"
                />
              </div>
            ) : (
              <span>{currentArtist?.city || 'Ciudad'}, {currentArtist?.country || 'País'}</span>
            )}
          </div>
          {/* Resto de info: rating y botón editar */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {averageRating > 0 && (
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barra de tabs tipo YouTube adaptada */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8 max-w-6xl mx-auto px-4">
          <button className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            ${activeTab === 'perfil' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('perfil')}
          >
            Perfil
          </button>
          <button className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            ${activeTab === 'galeria' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('galeria')}
          >
            Galería
          </button>
          <button className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            ${activeTab === 'resenas' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('resenas')}
          >
            Reseñas
          </button>
          <button className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            ${activeTab === 'agenda' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('agenda')}
          >
            Agenda
          </button>
          <button className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
            ${activeTab === 'requisitos' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('requisitos')}
          >
            Requisitos
          </button>
        </nav>
      </div>
      {activeTab === 'galeria' && (
        <ArtistGallery
        />
      )}

      {/* Mostrar calendario solo si el tab activo es 'agenda' */}
      {activeTab === 'agenda' && (
        <ArtistCalendarComponent
          artistId={currentArtist?.id}
          editable={authUser && currentArtist && String(authUser.id) === String(currentArtist.id)}
          onDateToggle={authUser && currentArtist && String(authUser.id) === String(currentArtist.id) ? handleSolicitudContratacion : undefined}
          onDateSelect={
            authUser &&
              currentArtist &&
              String(authUser.id) !== String(currentArtist.id) &&
              canSendRequest
              ? handleSolicitudContratacion
              : undefined
          }
        />
      )}
          {/* Main info and sidebar wrapper */}
      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 w-full max-w-6xl mx-auto">
          {/* Columna izquierda: info principal */}
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-6 h-6" /> Biografía
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea value={editData?.bio || ''} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} rows={4} className="resize-none text-base" />
                ) : (
                  <p className="text-base text-foreground leading-relaxed">
                    {currentArtist?.bio ? currentArtist.bio : <span className="italic text-gray-400">Este artista aún no ha escrito su biografía.</span>}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Briefcase className="w-6 h-6" /> Experiencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Input type="number" min="0" value={editData?.yearsOfExperience || ''} onChange={e => setEditData({ ...editData, yearsOfExperience: Number(e.target.value) })} placeholder="Años de experiencia" className="w-40 mb-2" />
                ) : (
                  <span className="font-medium">
                    {currentArtist?.yearsOfExperience ? `${currentArtist.yearsOfExperience} años de experiencia` : <span className="italic text-gray-400">Sin experiencia especificada</span>}
                  </span>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="w-6 h-6" /> Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                {managerData ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={managerData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${managerData.id}`} />
                      <AvatarFallback>{managerData.name?.charAt(0) || 'M'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{managerData.name}</div>
                      <div className="text-sm text-muted-foreground">{managerData.email}</div>
                    </div>
                  </div>
                ) : (
                  <span className="italic text-gray-400">No hay manager asignado</span>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="w-6 h-6" /> Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8">
                  <div>
                    <div className="text-sm text-muted-foreground">Shows totales</div>
                    <div className="font-bold text-lg">{confirmedRequests.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Valoración</div>
                    <div className="flex items-center gap-1 text-accent font-bold text-lg">
                      <Star className="w-5 h-5 fill-current" />
                      {ratingLoading ? '...' : averageRating !== null ? averageRating.toFixed(1) : 0}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({ratingLoading ? '...' : totalReviews !== null ? totalReviews : 0} reseñas)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Globe className="w-6 h-6" /> Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isEditing || currentArtist?.socialLinks?.instagram) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" /> Instagram
                    </Label>
                    {isEditing ? (
                      <Input value={editData?.socialLinks?.instagram || ''} onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData?.socialLinks, instagram: e.target.value } })} placeholder="usuario (sin @)" />
                    ) : currentArtist?.socialLinks?.instagram ? (
                      <a href={`https://instagram.com/${currentArtist.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">{currentArtist.socialLinks.instagram.replace('@', '')}</a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.youtube) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" /> YouTube
                    </Label>
                    {isEditing ? (
                      <Input value={editData?.socialLinks?.youtube || ''} onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData?.socialLinks, youtube: e.target.value } })} placeholder="usuario o @canal" />
                    ) : currentArtist?.socialLinks?.youtube ? (
                      <a href={`https://youtube.com/${currentArtist.socialLinks.youtube.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">{currentArtist.socialLinks.youtube.replace('@', '')}</a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.spotify) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-green-500" /> Spotify
                    </Label>
                    {isEditing ? (
                      <Input value={editData?.socialLinks?.spotify || ''} onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData?.socialLinks, spotify: e.target.value } })} placeholder="ID de artista o nombre" />
                    ) : currentArtist?.socialLinks?.spotify ? (
                      <a href={`https://open.spotify.com/artist/${currentArtist.socialLinks.spotify}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">{currentArtist.socialLinks.spotify}</a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.website) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" /> Sitio Web
                    </Label>
                    {isEditing ? (
                      <Input value={editData?.socialLinks?.website || ''} onChange={(e) => setEditData({ ...editData, socialLinks: { ...editData?.socialLinks, website: e.target.value } })} placeholder="https://tudominio.com" />
                    ) : currentArtist?.socialLinks?.website ? (
                      <a href={currentArtist.socialLinks.website.startsWith('http') ? currentArtist.socialLinks.website : `https://${currentArtist.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{currentArtist.socialLinks.website}</a>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
                )} 

                      {/* Sección de Requisitos del artista */}
      {activeTab === 'requisitos' && (
        <section className="max-w-6xl mx-auto mt-10 mb-20 px-4">
          <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-2">Requisitos del Artista</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              {/* Rider Técnico */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Rider Técnico</h3>
                <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                  <li>Micrófonos: 2 dinámicos, 1 de condensador</li>
                  <li>Monitores de escenario (mínimo 2)</li>
                  <li>Mezcladora con al menos 8 canales</li>
                  <li>Iluminación básica en escenario</li>
                  <li>Espacio mínimo: 4x3 metros</li>
                  <li>Conexiones eléctricas accesibles</li>
                </ul>
              </div>
              {/* Rider de Hospitalidad */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Hospitalidad</h3>
                <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                  <li>Bebidas: agua, refrescos, café</li>
                  <li>Snacks ligeros y fruta</li>
                  <li>Comida vegetariana disponible</li>
                  <li>Toallas y camerino privado</li>
                </ul>
              </div>
            </div>
            <div className="space-y-10">
              {/* Logística y Producción */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Logística y Producción</h3>
                <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                  <li>Acceso a camerino y estacionamiento</li>
                  <li>Horario de prueba de sonido: 2 horas antes del show</li>
                  <li>Equipo: 4 personas</li>
                  <li>Material promocional en el recinto</li>
                </ul>
              </div>
              {/* Otros Requisitos */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Otros</h3>
                <ul className="list-disc list-inside text-base text-muted-foreground space-y-1">
                  <li>Condiciones de pago: 50% anticipado, 50% tras el show</li>
                  <li>No se permite grabación profesional sin autorización</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

        {/* Save button */}
        {isEditing && (
          <div className="fixed bottom-6 right-6 lg:right-10">
            <Button size="lg" variant="hero" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}

        <ModalSolicitudContratacion open={modalOpen && canSendRequest} onClose={() => setModalOpen(false)} fecha={fechaSeleccionada} cacheBase={cacheBase} onSubmit={handleEnviarSolicitud} />
    
      {/* Sección de Reseñas: solo mostrar si el tab activo es 'resenas' */}
      {activeTab === 'resenas' && (
        <div className="mt-12 max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" fill="#facc15" />
            Reseñas recientes
          </h2>
          {authUser?.role === 'Local' && (
            <ReviewForm targetId={currentArtist.id} token={token} type="artist" />
          )}
          <ReviewsList artistId={currentArtist?.id} />
        </div>
      )}
  </HeaderLayout>
  );
}

// Componente para mostrar las reseñas
import { Review } from '@/types/review';
import { apiFetch } from '@/lib/api';
import { Star as StarIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import ArtistCalendarComponent from '@/components/calendar/ArtistCalendarComponent';

function ReviewsList({ artistId }: { artistId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!artistId) return;
    (async () => {
      try {
        const data = await apiFetch<Review[]>(`/reviews/artist/${artistId}`);
        setReviews(data);
      } catch (error) {
        console.error('Error al cargar reviews:', error);
        setReviews([]); // No reviews si hay error
      }
    })();
  }, [artistId]);

  if (!reviews.length) {
    return <div className="text-muted-foreground text-center py-8">Este artista aún no tiene reseñas.</div>;
  }

  const reviewsToShow = showAll ? reviews : reviews.slice(0, 2);

  return (
    <div className="space-y-8">
      {reviewsToShow.map((review) => (
        <div key={review.id} className="flex gap-4 items-start border-b pb-6">
          <div>
            <img
              src={review.reviewer.avatar || '/default-avatar.png'}
              alt={review.reviewer.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{review.reviewer.name}</span>
              <span className="text-xs text-muted-foreground">
                {review.reviewer.city ? review.reviewer.city + ', ' : ''}{review.reviewer.country || ''}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill={i < review.rating ? '#facc15' : 'none'}
                />
              ))}
              <span className="text-xs text-muted-foreground">
                {review.eventDate
                  ? format(new Date(review.eventDate), 'MMMM yyyy', { locale: es })
                  : formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: es })}
              </span>
            </div>
            <div className="mb-2 text-sm text-foreground">{review.comment}</div>
          </div>
        </div>
      ))}
      {reviews.length > 2 && (
        <div className="text-center mt-2">
          <button
            className="text-blue-500 hover:underline text-sm font-medium"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Mostrar menos' : 'Mostrar más'}
          </button>
        </div>
      )}
    </div>
  );
}
