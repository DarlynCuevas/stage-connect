import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Send,
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
  Edit,
  Save,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';

function ManagerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [manager, setManager] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const isOwner = Number(user?.id) === Number(id);
  const isArtist = user?.role === 'Artista';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    
    console.log('🔍 [ManagerPublicProfile] Fetching manager with id:', id);
    
    apiFetch(`/public/users/${id}`)
      .then((data) => {
        console.log('✅ [ManagerPublicProfile] Manager data received:', data);
        setManager(data);
        setFormData(data); // Initialize form data
      })
      .catch((err: any) => {
        console.error('❌ [ManagerPublicProfile] Error:', err);
        setError(err.message || 'Error fetching manager');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(manager);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(manager);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiFetch('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      
      setManager(response);
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
        <div>Cargando perfil del manager...</div>
      </div>
    );
  }

  if (error || !manager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Manager no encontrado</h1>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const canContact = isAuthenticated && user?.role === 'Artista';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative">
        <div className="h-64 lg:h-80">
          {manager.banner ? (
            <img src={manager.banner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20" />
          )}
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
                  <AvatarImage src={manager.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=manager${manager.id}`} />
                  <AvatarFallback className="text-3xl bg-role-manager text-white">
                    {manager.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isEditing ? (
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-3xl lg:text-4xl font-display font-bold bg-background/80 border-primary/30"
                        placeholder="Nombre completo"
                      />
                    ) : (
                      <h1 className="text-3xl lg:text-4xl font-display font-bold">{manager.name}</h1>
                    )}
                    {manager.verified && <CheckCircle className="w-7 h-7 text-primary" />}
                  </div>
                  {isEditing ? (
                    <Input
                      value={formData.company || ''}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="text-lg bg-background/80 border-primary/30 mt-2"
                      placeholder="Empresa o compañía"
                    />
                  ) : (
                    manager.company && (
                      <p className="text-lg text-muted-foreground">{manager.company}</p>
                    )
                  )}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    {(manager.city || manager.country) && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{manager.city || 'Ciudad'}, {manager.country || 'País'}</span>
                      </div>
                    )}
                    {manager.rating && manager.rating > 0 && (
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-medium">{manager.rating?.toFixed(2)}</span>
                        {manager.totalReviews > 0 && (
                          <span className="text-muted-foreground">({manager.totalReviews} evaluaciones)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {canContact && manager.acceptingArtists && (
                <Button variant="hero" size="lg">
                  <Send className="w-5 h-5 mr-2" />
                  Contactar Manager
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Card */}
        <Card variant="gradient" className="mb-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {manager.currentArtists || 0}
                </div>
                <p className="text-sm text-muted-foreground">Artistas representados</p>
              </div>
              
              <div className="text-center border-l border-border pl-6">
                <div className="text-4xl font-bold text-primary mb-1">
                  {manager.totalShowsManaged || 0}
                </div>
                <p className="text-sm text-muted-foreground">Shows gestionados</p>
              </div>
              
              {manager.yearsOfExperience && (
                <div className="text-center border-l border-border pl-6">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {manager.yearsOfExperience}
                  </div>
                  <p className="text-sm text-muted-foreground">Años de experiencia</p>
                </div>
              )}
              
              {manager.acceptingArtists && (
                <div className="text-center border-l border-border pl-6">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-10 h-10 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">Aceptando nuevos artistas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Sobre {manager.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Describe tu experiencia y servicios como manager..."
                    className="min-h-[100px] bg-background/80 border-primary/30"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{manager.bio || 'Sin información disponible'}</p>
                )}
              </CardContent>
            </Card>

            {/* Professional Info Tabs */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Información Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="experience" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="experience">Experiencia</TabsTrigger>
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="coverage">Cobertura</TabsTrigger>
                  </TabsList>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-4 mt-4">
                    {(manager.yearsOfExperience || isEditing) && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          Años de experiencia
                        </p>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={formData.yearsOfExperience || ''}
                            onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                            placeholder="Años de experiencia"
                            className="bg-background/80 border-primary/30"
                          />
                        ) : (
                          <p className="text-muted-foreground">{manager.yearsOfExperience} años en la industria musical</p>
                        )}
                      </div>
                    )}

                    {manager.specializations && manager.specializations.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold">Especializaciones</p>
                        <div className="flex flex-wrap gap-2">
                          {manager.specializations.map((spec, i) => (
                            <Badge key={i} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {manager.achievements && manager.achievements.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          Logros destacados
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {manager.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!manager.yearsOfExperience && (!manager.specializations || manager.specializations.length === 0) && (!manager.achievements || manager.achievements.length === 0) && (
                      <p className="text-muted-foreground text-center py-4">No hay información de experiencia disponible</p>
                    )}
                  </TabsContent>

                  {/* Services Tab */}
                  <TabsContent value="services" className="space-y-4 mt-4">
                    {manager.services && manager.services.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Servicios ofrecidos
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {manager.services.map((service, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {manager.commissionRate && (
                      <div className="space-y-2">
                        <p className="font-semibold">Tasa de comisión</p>
                        <p className="text-muted-foreground">{manager.commissionRate}</p>
                      </div>
                    )}

                    {manager.responseTime && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Tiempo de respuesta
                        </p>
                        <p className="text-muted-foreground">{manager.responseTime}</p>
                      </div>
                    )}

                    {(!manager.services || manager.services.length === 0) && !manager.commissionRate && !manager.responseTime && (
                      <p className="text-muted-foreground text-center py-4">No hay información de servicios disponible</p>
                    )}
                  </TabsContent>

                  {/* Coverage Tab */}
                  <TabsContent value="coverage" className="space-y-4 mt-4">
                    {manager.languages && manager.languages.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Languages className="w-4 h-4 text-primary" />
                          Idiomas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {manager.languages.map((lang, i) => (
                            <Badge key={i} variant="secondary">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {manager.coverageAreas && manager.coverageAreas.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Áreas de cobertura
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {manager.coverageAreas.map((area, i) => (
                            <Badge key={i} variant="outline">{area}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {manager.internationalBooking && (
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          Booking internacional
                        </p>
                        <p className="text-muted-foreground">Gestiona eventos y shows a nivel internacional</p>
                      </div>
                    )}

                    {(!manager.languages || manager.languages.length === 0) && (!manager.coverageAreas || manager.coverageAreas.length === 0) && !manager.internationalBooking && (
                      <p className="text-muted-foreground text-center py-4">No hay información de cobertura disponible</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {manager.portfolio && manager.portfolio.length > 0 && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {manager.portfolio.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            {canContact && (
              <Card variant="gradient" className="border-primary/30">
                <CardHeader>
                  <CardTitle>Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {manager.phone && (
                    <a href={`tel:${manager.phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Phone className="w-5 h-5 text-primary" />
                      <span>{manager.phone}</span>
                    </a>
                  )}
                  {manager.email && (
                    <a href={`mailto:${manager.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                      <span className="truncate">{manager.email}</span>
                    </a>
                  )}
                  {manager.website && (
                    <a href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Globe className="w-5 h-5 text-primary" />
                      <span>Sitio web</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Availability Status */}
            {(isOwner || manager.acceptingArtists) && (
              <Card variant="gradient" className="border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold mb-1">Estado</h3>
                      <p className="text-sm text-muted-foreground">
                        {manager.acceptingArtists ? 'Aceptando nuevos artistas' : 'No aceptando artistas'}
                      </p>
                    </div>
                    {isOwner && isEditing && (
                      <Switch
                        checked={formData.acceptingArtists || false}
                        onCheckedChange={(checked) => handleInputChange('acceptingArtists', checked)}
                      />
                    )}
                    {!isEditing && (
                      <TrendingUp className={cn(
                        "w-8 h-8",
                        manager.acceptingArtists ? "text-green-500" : "text-gray-400"
                      )} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isAuthenticated && (
              <Card variant="gradient" className="border-primary/30">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-display font-bold mb-2">¿Eres artista?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inicia sesión para contactar con {manager.name} y llevar tu carrera al siguiente nivel
                  </p>
                  <Button variant="gradient" className="w-full" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {(manager.socialLinks?.linkedin || manager.socialLinks?.instagram || manager.socialLinks?.facebook || manager.socialLinks?.twitter) && (
              <Card variant="gradient">
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {manager.socialLinks?.linkedin && (
                    <a href={manager.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {manager.socialLinks?.instagram && (
                    <a href={`https://instagram.com/${manager.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span>@{manager.socialLinks.instagram.replace('@', '')}</span>
                    </a>
                  )}
                  {manager.socialLinks?.facebook && (
                    <a href={manager.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Facebook className="w-5 h-5 text-blue-500" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {manager.socialLinks?.twitter && (
                    <a href={manager.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <Twitter className="w-5 h-5 text-sky-500" />
                      <span>Twitter</span>
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

const ManagerPublicProfileWithLayout = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <>
        <Sidebar />
        <div className="lg:ml-64">
          <ManagerPublicProfile />
        </div>
      </>
    );
  }
  
  return <ManagerPublicProfile />;
};

export default ManagerPublicProfileWithLayout;
