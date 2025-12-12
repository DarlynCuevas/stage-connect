import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useArtist, useUser } from '@/lib/users';
import { useConfirmedRequests } from '@/lib/requests';
import { useCreateManagerRequest, useRemoveManagerRelation, useReceivedManagerRequests } from '@/lib/manager-requests';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ArtistProfile() {
  const { user: artist, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(artist);
  const [newGenre, setNewGenre] = useState('');
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfile();
  const { data: freshArtist } = useArtist(artist?.id);
  const { data: confirmedRequests = [] } = useConfirmedRequests(artist?.id ? Number(artist.id) : undefined);
  const createManagerRequestMutation = useCreateManagerRequest();
  const removeManagerRelationMutation = useRemoveManagerRelation();
  const { data: receivedRequests = [] } = useReceivedManagerRequests();
  const [showManagerDialog, setShowManagerDialog] = useState(false);
  const [managerIdToAdd, setManagerIdToAdd] = useState('');

  // prefer server data when available
  const currentArtist = freshArtist || artist;
  
  // Fetch manager data if exists
  const { data: managerData } = useUser(
    currentArtist?.managerId ? Number(currentArtist.managerId) : undefined,
    token as string
  );

  useEffect(() => {
    if (currentArtist) {
      setEditData(currentArtist);
    }
  }, [currentArtist]);

  // Si no hay usuario, mostrar mensaje
  if (!artist) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">No hay usuario autenticado</p>
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
    setEditData(artist);
    setIsEditing(false);
  };

  return (
    
      <HeaderLayout profileTabs={[
        { to: '/artist', label: 'Inicio' },
        { to: '/artist/profile', label: 'Mi perfil' },
        { to: '/artist/calendar', label: 'Calendario' },
        { to: '/artist/requests', label: 'Solicitudes' },
      ]}>
        <DashboardLayout noSidebar>
        <div className="space-y-6">
        {/* Header with banner */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="h-48 lg:h-64">
            {currentArtist?.banner ? (
              <img
                src={currentArtist.banner}
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
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={currentArtist?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=artist'} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {currentArtist?.nickName?.charAt(0) || currentArtist?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
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
                  </div>
                  <p className="text-muted-foreground">{currentArtist?.name}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1 text-muted-foreground">
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
                    <div className="flex items-center gap-1 text-muted-foreground">
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
                    {currentArtist?.rating && currentArtist.rating > 0 && (
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{currentArtist.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant={isEditing ? "outline" : "gradient"}
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Biografía</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editData?.bio || ''}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{currentArtist?.bio || 'Sin biografía'}</p>
                )}
              </CardContent>
            </Card>

            {/* Genres */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Géneros Musicales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editData?.genre?.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-sm relative">
                      <Music className="w-3 h-3 mr-1" />
                      {genre}
                      {isEditing && (
                        <button
                          onClick={() => removeGenre(genre)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Select value={newGenre} onValueChange={setNewGenre}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecciona un género" />
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
              </CardContent>
            </Card>

            {/* Professional Information - Tabs */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Información Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="experience" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="experience">Experiencia</TabsTrigger>
                    <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
                    <TabsTrigger value="technical">Técnico</TabsTrigger>
                    <TabsTrigger value="coverage">Cobertura</TabsTrigger>
                  </TabsList>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Años de experiencia
                      </Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editData?.yearsOfExperience || ''}
                          onChange={(e) => setEditData({ ...editData, yearsOfExperience: Number(e.target.value) })}
                          placeholder="3"
                        />
                      ) : (
                        <p className="text-muted-foreground">{currentArtist?.yearsOfExperience || 'No especificado'} años</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Logros y premios
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.achievements?.join('\n') || ''}
                          onChange={(e) => setEditData({ ...editData, achievements: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Premio Mejor DJ 2024&#10;Actuación en Festival Internacional&#10;..."
                          rows={4}
                        />
                      ) : (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {currentArtist?.achievements?.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          )) || <li>No hay logros registrados</li>}
                        </ul>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Certificaciones y formación</Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.certifications?.join('\n') || ''}
                          onChange={(e) => setEditData({ ...editData, certifications: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Certificación Ableton Live&#10;Curso de producción musical&#10;..."
                          rows={3}
                        />
                      ) : (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {currentArtist?.certifications?.map((cert, i) => (
                            <li key={i}>{cert}</li>
                          )) || <li>No hay certificaciones</li>}
                        </ul>
                      )}
                    </div>
                  </TabsContent>

                  {/* Multimedia Tab */}
                  <TabsContent value="multimedia" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-red-500" />
                        Video Demo / Showreel
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData?.showreelUrl || ''}
                          onChange={(e) => setEditData({ ...editData, showreelUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      ) : currentArtist?.showreelUrl ? (
                        <a href={currentArtist.showreelUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" />
                          Ver video
                        </a>
                      ) : (
                        <p className="text-muted-foreground">No hay video demo</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-green-500" />
                        Perfil de Spotify
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData?.spotifyUrl || ''}
                          onChange={(e) => setEditData({ ...editData, spotifyUrl: e.target.value })}
                          placeholder="https://open.spotify.com/artist/..."
                        />
                      ) : currentArtist?.spotifyUrl ? (
                        <a href={currentArtist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                          Ver en Spotify
                        </a>
                      ) : (
                        <p className="text-muted-foreground">No configurado</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500" />
                        Canal de YouTube
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData?.youtubeChannel || ''}
                          onChange={(e) => setEditData({ ...editData, youtubeChannel: e.target.value })}
                          placeholder="https://youtube.com/@tucanal"
                        />
                      ) : currentArtist?.youtubeChannel ? (
                        <a href={currentArtist.youtubeChannel} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
                          Ver canal
                        </a>
                      ) : (
                        <p className="text-muted-foreground">No configurado</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Technical Tab */}
                  <TabsContent value="technical" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mic className="w-4 h-4 text-primary" />
                        Rider técnico
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.technicalRider || ''}
                          onChange={(e) => setEditData({ ...editData, technicalRider: e.target.value })}
                          placeholder="2 micrófonos dinámicos&#10;Mesa de mezclas de 4 canales&#10;2 monitores de escenario&#10;..."
                          rows={5}
                        />
                      ) : (
                        <p className="text-muted-foreground whitespace-pre-line">{currentArtist?.technicalRider || 'No especificado'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Equipo propio</Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.equipment?.join('\n') || ''}
                          onChange={(e) => setEditData({ ...editData, equipment: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Controlador DDJ-400&#10;Laptop con software&#10;Cables XLR&#10;..."
                          rows={4}
                        />
                      ) : (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {currentArtist?.equipment?.map((item, i) => (
                            <li key={i}>{item}</li>
                          )) || <li>No especificado</li>}
                        </ul>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Tiempo de montaje/desmontaje
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData?.setupTime || ''}
                          onChange={(e) => setEditData({ ...editData, setupTime: e.target.value })}
                          placeholder="30 minutos"
                        />
                      ) : (
                        <p className="text-muted-foreground">{currentArtist?.setupTime || 'No especificado'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Duración típica del set</Label>
                      {isEditing ? (
                        <Input
                          value={editData?.setDuration || ''}
                          onChange={(e) => setEditData({ ...editData, setDuration: e.target.value })}
                          placeholder="2 horas"
                        />
                      ) : (
                        <p className="text-muted-foreground">{currentArtist?.setDuration || 'No especificado'}</p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Coverage Tab */}
                  <TabsContent value="coverage" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Languages className="w-4 h-4 text-primary" />
                        Idiomas
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.languages?.join(', ') || ''}
                          onChange={(e) => setEditData({ ...editData, languages: e.target.value.split(',').map(l => l.trim()).filter(Boolean) })}
                          placeholder="Español, Inglés, Francés"
                          rows={2}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {currentArtist?.languages?.map((lang, i) => (
                            <Badge key={i} variant="secondary">{lang}</Badge>
                          )) || <p className="text-muted-foreground">No especificado</p>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Áreas de cobertura
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.coverageAreas?.join(', ') || ''}
                          onChange={(e) => setEditData({ ...editData, coverageAreas: e.target.value.split(',').map(a => a.trim()).filter(Boolean) })}
                          placeholder="Madrid, Barcelona, Valencia"
                          rows={2}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {currentArtist?.coverageAreas?.map((area, i) => (
                            <Badge key={i} variant="outline">{area}</Badge>
                          )) || <p className="text-muted-foreground">No especificado</p>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>¿Dispuesto a viajar?</Label>
                      {isEditing ? (
                        <Select
                          value={editData?.willingToTravel ? 'yes' : 'no'}
                          onValueChange={(value) => setEditData({ ...editData, willingToTravel: value === 'yes' })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Sí, dispuesto a viajar</SelectItem>
                            <SelectItem value="no">No, solo local</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-muted-foreground">{currentArtist?.willingToTravel ? 'Sí, dispuesto a viajar' : 'Solo local'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        Tipos de eventos
                      </Label>
                      {isEditing ? (
                        <Textarea
                          value={editData?.performanceTypes?.join(', ') || ''}
                          onChange={(e) => setEditData({ ...editData, performanceTypes: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                          placeholder="Clubs, Festivales, Bodas, Eventos privados"
                          rows={2}
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {currentArtist?.performanceTypes?.map((type, i) => (
                            <Badge key={i} variant="secondary">{type}</Badge>
                          )) || <p className="text-muted-foreground">No especificado</p>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Tamaño de audiencia habitual
                      </Label>
                      {isEditing ? (
                        <Select
                          value={editData?.audienceSize || ''}
                          onValueChange={(value) => setEditData({ ...editData, audienceSize: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona rango" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-50">0-50 personas</SelectItem>
                            <SelectItem value="50-200">50-200 personas</SelectItem>
                            <SelectItem value="200-500">200-500 personas</SelectItem>
                            <SelectItem value="500-1000">500-1000 personas</SelectItem>
                            <SelectItem value="1000-5000">1000-5000 personas</SelectItem>
                            <SelectItem value="5000+">Más de 5000</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-muted-foreground">{currentArtist?.audienceSize || 'No especificado'} personas</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Galería</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {artist?.gallery?.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden group"
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <button className="absolute inset-0 bg-destructive/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="w-6 h-6 text-destructive-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button className="aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary flex items-center justify-center transition-colors">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manager Section */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-role-manager" />
                  Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentArtist?.managerId && managerData ? (
                  <div className="space-y-3">
                    <Link
                      to={`/manager/${managerData.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={managerData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${managerData.id}`} />
                        <AvatarFallback>{managerData.name?.charAt(0) || 'M'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{managerData.name}</p>
                        <p className="text-sm text-muted-foreground">{managerData.email}</p>
                        <Badge variant="secondary" className="text-xs mt-1">Manager</Badge>
                      </div>
                    </Link>
                    {isEditing && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de que quieres eliminar esta relación con tu manager? Se enviará una notificación.')) {
                            await removeManagerRelationMutation.mutateAsync(currentArtist.id as number);
                          }
                        }}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Eliminar Manager
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tienes un manager asignado
                    </p>
                    {isEditing && (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder="ID del Manager"
                          value={managerIdToAdd}
                          onChange={(e) => setManagerIdToAdd(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={async () => {
                            if (managerIdToAdd) {
                              await createManagerRequestMutation.mutateAsync({
                                receiverId: Number(managerIdToAdd),
                                message: 'Me gustaría que fueras mi manager',
                              });
                              setManagerIdToAdd('');
                            }
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Enviar Solicitud
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing (private) */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💰 Precios
                  <Badge variant="secondary" className="text-xs">Privado</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground mb-1">Caché base</p>
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={editData?.basePrice ?? 0}
                      onChange={(e) => setEditData({ ...editData, basePrice: e.target.value ? Number(e.target.value) : 0 })}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      €{(currentArtist?.basePrice ?? 0).toLocaleString()}
                    </p>
                  )}
                </div>

                {currentArtist?.priceVariants?.map((variant) => (
                  <div key={variant.id} className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{variant.name}</p>
                      <p className="font-bold text-primary">€{variant.price?.toLocaleString() || '0'}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{variant.description}</p>
                  </div>
                ))}

                {isEditing && (
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir variante
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Social links */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isEditing || currentArtist?.socialLinks?.instagram) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      Instagram
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.socialLinks?.instagram || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData?.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="usuario (sin @)"
                      />
                    ) : currentArtist?.socialLinks?.instagram ? (
                      <a
                        href={`https://instagram.com/${currentArtist.socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:underline"
                      >
                        {currentArtist.socialLinks.instagram.replace('@', '')}
                      </a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.youtube) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-500" />
                      YouTube
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.socialLinks?.youtube || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData?.socialLinks, youtube: e.target.value }
                        })}
                        placeholder="usuario o @canal"
                      />
                    ) : currentArtist?.socialLinks?.youtube ? (
                      <a
                        href={`https://youtube.com/${currentArtist.socialLinks.youtube.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:underline"
                      >
                        {currentArtist.socialLinks.youtube.replace('@', '')}
                      </a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.spotify) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-green-500" />
                      Spotify
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.socialLinks?.spotify || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData?.socialLinks, spotify: e.target.value }
                        })}
                        placeholder="ID de artista o nombre"
                      />
                    ) : currentArtist?.socialLinks?.spotify ? (
                      <a
                        href={`https://open.spotify.com/artist/${currentArtist.socialLinks.spotify}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:underline"
                      >
                        {currentArtist.socialLinks.spotify}
                      </a>
                    ) : null}
                  </div>
                )}
                {(isEditing || currentArtist?.socialLinks?.website) && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      Sitio Web
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData?.socialLinks?.website || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData?.socialLinks, website: e.target.value }
                        })}
                        placeholder="https://tudominio.com"
                      />
                    ) : currentArtist?.socialLinks?.website ? (
                      <a
                        href={currentArtist.socialLinks.website.startsWith('http') ? currentArtist.socialLinks.website : `https://${currentArtist.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {currentArtist.socialLinks.website}
                      </a>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shows totales</span>
                  <span className="font-bold">{confirmedRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valoración</span>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{currentArtist?.rating ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save button */}
        {isEditing && (
          <div className="fixed bottom-6 right-6 lg:right-10">
            <Button size="lg" variant="hero" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>
      </DashboardLayout>
      </HeaderLayout>
   
  );
}
