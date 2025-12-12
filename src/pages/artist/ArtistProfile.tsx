import { useState } from 'react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { mockArtists } from '@/data/mockData';
import { Edit, Save, X, MapPin, Star, Music, Plus, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ArtistProfile() {
  const [artist, setArtist] = useState(mockArtists[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(artist);
  const { toast } = useToast();

  const handleSave = () => {
    setArtist(editData);
    setIsEditing(false);
    toast({ title: 'Perfil actualizado', description: 'Los cambios se han guardado.' });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar showSearch={false} />
      
      <main className="container-tight py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={artist.avatar} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">{artist.stageName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-display font-bold text-foreground">{artist.stageName}</h1>
              {artist.verified && <CheckCircle className="w-5 h-5 text-success" />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{artist.city}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-accent" />{artist.rating}</span>
            </div>
          </div>
          <Button variant={isEditing ? "outline" : "default"} onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}>
            {isEditing ? <><X className="w-4 h-4 mr-2" />Cancelar</> : <><Edit className="w-4 h-4 mr-2" />Editar</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="outline">
              <CardHeader><CardTitle className="text-base">Biografía</CardTitle></CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} rows={4} />
                ) : (
                  <p className="text-muted-foreground">{artist.bio}</p>
                )}
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader><CardTitle className="text-base">Géneros</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artist.genre.map((genre) => (
                    <Badge key={genre} variant="secondary"><Music className="w-3 h-3 mr-1" />{genre}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="outline">
              <CardHeader><CardTitle className="text-base">Precios</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Caché base</p>
                  <p className="text-xl font-bold text-primary">€{artist.basePrice.toLocaleString()}</p>
                </div>
                {artist.priceVariants?.map((v) => (
                  <div key={v.id} className="flex justify-between text-sm">
                    <span>{v.name}</span>
                    <span className="font-medium">€{v.price.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <Button size="lg" onClick={handleSave}><Save className="w-4 h-4 mr-2" />Guardar</Button>
          </div>
        )}
      </main>
    </div>
  );
}
