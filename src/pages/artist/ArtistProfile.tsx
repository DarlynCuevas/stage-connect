import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { mockArtists } from '@/data/mockData';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ArtistProfile() {
  const [artist, setArtist] = useState(mockArtists[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(artist);
  const { toast } = useToast();

  const handleSave = () => {
    setArtist(editData);
    setIsEditing(false);
    toast({
      title: 'Perfil actualizado',
      description: 'Los cambios se han guardado correctamente.',
    });
  };

  const handleCancel = () => {
    setEditData(artist);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with banner */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="h-48 lg:h-64">
            {artist.banner ? (
              <img
                src={artist.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={artist.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {artist.stageName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-display font-bold">{artist.stageName}</h1>
                    {artist.verified && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <p className="text-muted-foreground">{artist.name}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{artist.city}, {artist.country}</span>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{artist.rating}</span>
                    </div>
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
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground">{artist.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Genres */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Géneros Musicales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.genre.map((genre) => (
                    <Badge key={genre} variant="secondary" className="text-sm">
                      <Music className="w-3 h-3 mr-1" />
                      {genre}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Añadir
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card variant="gradient">
              <CardHeader>
                <CardTitle>Galería</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {artist.gallery.map((image, index) => (
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
                      value={editData.basePrice}
                      onChange={(e) => setEditData({ ...editData, basePrice: Number(e.target.value) })}
                    />
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      €{artist.basePrice.toLocaleString()}
                    </p>
                  )}
                </div>

                {artist.priceVariants?.map((variant) => (
                  <div key={variant.id} className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{variant.name}</p>
                      <p className="font-bold text-primary">€{variant.price.toLocaleString()}</p>
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
                {artist.socialLinks.instagram && (
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    {isEditing ? (
                      <Input
                        value={editData.socialLinks.instagram}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="Instagram username"
                      />
                    ) : (
                      <span>@{artist.socialLinks.instagram}</span>
                    )}
                  </div>
                )}
                {artist.socialLinks.youtube && (
                  <div className="flex items-center gap-3">
                    <Youtube className="w-5 h-5 text-red-500" />
                    {isEditing ? (
                      <Input
                        value={editData.socialLinks.youtube}
                        onChange={(e) => setEditData({
                          ...editData,
                          socialLinks: { ...editData.socialLinks, youtube: e.target.value }
                        })}
                        placeholder="YouTube channel"
                      />
                    ) : (
                      <span>{artist.socialLinks.youtube}</span>
                    )}
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
                  <span className="font-bold">{artist.totalShows}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valoración</span>
                  <div className="flex items-center gap-1 text-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{artist.rating}</span>
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
  );
}
