import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArtists } from '@/lib/users';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateManagerRequest, useRemoveManagerRelation, useManagerRequestsRealtime, useReceivedManagerRequests, useSentManagerRequests, useUpdateManagerRequestStatus, useDeleteSentManagerRequest, useDeleteAllSentManagerRequests } from '@/lib/manager-requests';
import {
  Users,
  Search,
  Music,
  MapPin,
  Euro,
  UserPlus,
  UserMinus,
  ExternalLink,
  AlertCircle,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Trash,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ManagerArtists() {
  useManagerRequestsRealtime();
  const { user } = useAuth();
  const { data: allArtists = [] } = useArtists();
  const createRequestMutation = useCreateManagerRequest();
  const removeRelationMutation = useRemoveManagerRelation();
  const { data: receivedRequests = [], isLoading: loadingReceived } = useReceivedManagerRequests();
  const { data: sentRequests = [], isLoading: loadingSent } = useSentManagerRequests();
  const updateStatusMutation = useUpdateManagerRequestStatus();
  const deleteSentRequestMutation = useDeleteSentManagerRequest();
  const deleteAllSentRequestsMutation = useDeleteAllSentManagerRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);

  // Filter managed artists
  const managedArtists = (allArtists || []).filter((artist: any) => 
    artist.managerId && String(artist.managerId) === String(user?.id)
  );

  // Filter available artists (those without a manager)
  const availableArtists = (allArtists || []).filter((artist: any) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          artist.email.toLowerCase().includes(searchTerm.toLowerCase());
    const hasNoManager = !artist.managerId;
    return matchesSearch && hasNoManager;
  });

  const handleAcceptManagerReq = async (requestId: number) => {
    await updateStatusMutation.mutateAsync({ requestId, status: 'Accepted' });
  };

  const handleRejectManagerReq = async (requestId: number) => {
    await updateStatusMutation.mutateAsync({ requestId, status: 'Rejected' });
  };

  const handleDeleteSentRequest = async (requestId: number) => {
    await deleteSentRequestMutation.mutateAsync(requestId);
  };

  const handleDeleteAllSentRequests = async () => {
    await deleteAllSentRequestsMutation.mutateAsync();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'Accepted':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
      case 'Rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSendRequest = (artistId: number) => {
    createRequestMutation.mutate({
      receiverId: artistId,
      message: `Hola, me gustaría representarte como tu manager en Stage Connect.`,
    });
  };

  const handleRemoveArtist = (artistId: number) => {
    removeRelationMutation.mutate(artistId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Mis Artistas
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu roster de artistas
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            <Users className="w-3 h-3 mr-1" />
            {managedArtists.length} {managedArtists.length === 1 ? 'Artista' : 'Artistas'}
          </Badge>
        </div>

        {/* Managed Artists */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Music className="w-5 h-5 text-role-artist" />
              Artistas Representados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {managedArtists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aún no gestionas ningún artista</p>
                <p className="text-sm mt-1">Busca artistas disponibles abajo para enviar solicitudes</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {managedArtists.map((artist: any) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors"
                  >
                    <Avatar className="h-12 w-12 border-2 border-role-artist/20">
                      <AvatarImage src={artist.profilePicture} />
                      <AvatarFallback className="bg-role-artist/10 text-role-artist">
                        {getInitials(artist.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold truncate">{artist.name}</h3>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <User className="w-3 h-3" /> {artist.gender || 'No especificado'}
                          </Badge>
                        </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{artist.email}</span>
                        {artist.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {artist.location}
                          </span>
                        )}
                        {artist.basePrice && (
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {artist.basePrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/artist/profile/${artist.id}`}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Remover artista?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Dejarás de representar a <strong>{artist.name}</strong>. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveArtist(artist.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solicitudes Artistas (manager-artista) */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Solicitudes Artistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">Recibidas ({receivedRequests.length})</TabsTrigger>
                <TabsTrigger value="sent">Enviadas ({sentRequests.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4 mt-4">
                {loadingReceived ? (
                  <Card variant="gradient">
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Cargando...</p>
                    </CardContent>
                  </Card>
                ) : receivedRequests.length === 0 ? (
                  <Card variant="gradient">
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        <UserPlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>No tienes solicitudes recibidas</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  receivedRequests.map((request: any) => (
                    <Card key={request.id} variant="gradient">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.sender?.avatar} />
                            <AvatarFallback>{request.sender?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{request.sender?.name}</h3>
                                <p className="text-xs text-muted-foreground">{request.sender?.email}</p>
                                <Badge variant="secondary" className="text-2xs mt-1">{request.sender?.role}</Badge>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>
                            {request.message && (
                              <p className="text-sm text-muted-foreground mb-2 p-2 rounded bg-secondary/30">“{request.message}”</p>
                            )}
                            {request.status === 'Pending' && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <Button size="sm" variant="default" onClick={() => handleAcceptManagerReq(request.id)} disabled={updateStatusMutation.isPending}>
                                  Aceptar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectManagerReq(request.id)} disabled={updateStatusMutation.isPending}>
                                  Rechazar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4 mt-4">
                {sentRequests.length > 0 && !loadingSent && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={handleDeleteAllSentRequests}
                      disabled={deleteAllSentRequestsMutation.isPending}
                    >
                      <Trash className="w-4 h-4" />
                      Eliminar todas
                    </Button>
                  </div>
                )}

                {loadingSent ? (
                  <Card variant="gradient">
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Cargando...</p>
                    </CardContent>
                  </Card>
                ) : sentRequests.length === 0 ? (
                  <Card variant="gradient">
                    <CardContent className="p-6">
                      <div className="text-center text-muted-foreground">
                        <UserPlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p>No has enviado solicitudes</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  sentRequests.map((request: any) => (
                    <Card key={request.id} variant="gradient">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.receiver?.avatar} />
                            <AvatarFallback>{request.receiver?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{request.receiver?.name}</h3>
                                <p className="text-xs text-muted-foreground">{request.receiver?.email}</p>
                                <Badge variant="secondary" className="text-2xs mt-1">{request.receiver?.role}</Badge>
                              </div>
                              {getStatusBadge(request.status)}
                            </div>
                            {request.message && (
                              <p className="text-sm text-muted-foreground mb-2 p-2 rounded bg-secondary/30">“{request.message}”</p>
                            )}
                            {request.status === 'Pending' && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteSentRequest(request.id)}
                                  disabled={deleteSentRequestMutation.isPending}
                                >
                                  <Trash className="w-4 h-4" />
                                  Eliminar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Search and Add Artists */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Buscar Artistas Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {searchTerm && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {availableArtists.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No se encontraron artistas disponibles</p>
                    <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
                  </div>
                ) : (
                  availableArtists.map((artist: any) => (
                    <div
                      key={artist.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors"
                    >
                      <Avatar className="h-12 w-12 border-2 border-role-artist/20">
                        <AvatarImage src={artist.profilePicture} />
                        <AvatarFallback className="bg-role-artist/10 text-role-artist">
                          {getInitials(artist.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold truncate">{artist.name}</h3>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <User className="w-3 h-3" /> {artist.gender || 'No especificado'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>{artist.email}</span>
                          {artist.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {artist.location}
                            </span>
                          )}
                          {artist.basePrice && (
                            <span className="flex items-center gap-1">
                              <Euro className="w-3 h-3" />
                              {artist.basePrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link to={`/artist/profile/${artist.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSendRequest(artist.id)}
                          disabled={createRequestMutation.isPending}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Enviar Solicitud
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Usa el buscador para encontrar artistas</p>
                <p className="text-sm mt-1">Solo verás artistas que no tienen manager</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
