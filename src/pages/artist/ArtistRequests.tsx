import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { ContractAcceptModal } from '@/components/booking/ContractAcceptModal';
import { useState } from 'react';
import { useArtistRequests, useUpdateRequestStatus } from '@/lib/requests';
import { useInterestedByArtist, updateInterestedStatus } from '@/lib/interested';
import { useReceivedManagerRequests } from '@/lib/manager-requests';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CardItemRequest from '@/components/booking/CardItemRequest';
import { Send } from 'lucide-react';

const TABS = [
  'Contratación',
  'Ofertas',
  'Representación',
];

export default function ArtistRequests() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  if (id && authUser && String(authUser.id) !== String(id)) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-destructive text-lg font-semibold">Acceso denegado</p></div>;
  }
  const { data: requests = [], isLoading } = useArtistRequests();
  const { data: interested = [], isLoading: loadingInterested } = useInterestedByArtist(Number(authUser?.id));
  const { data: managerRequests = [], isLoading: loadingManagers } = useReceivedManagerRequests();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('Pendientes');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const { mutateAsync: acceptRequest } = useUpdateRequestStatus();

  // Filtrado por nombre y fecha
  const filterRequests = (arr) => arr.filter(r => {
    const name = r.artist?.name?.toLowerCase() || r.name?.toLowerCase() || r.manager?.name?.toLowerCase() || '';
    const matchesName = name.includes(search.toLowerCase());
    const matchesDate = date ? (r.date && r.date.startsWith(date)) : true;
    return matchesName && matchesDate;
  });

  const filteredRequests = filterRequests((requests || []).filter(req => {
    if (activeTab !== 'Contratación') return false;
    if (filter === 'Todas') return true;
    if (filter === 'Nuevas') return req.status === 'Pending';
    if (filter === 'Pendientes') return req.status === 'Pending';
    if (filter === 'Completadas') return req.status === 'Accepted';
    if (filter === 'Canceladas') return req.status === 'Rejected';
    return true;
  }));

  const filteredManagerRequests = filterRequests((managerRequests || []).filter(req => {
    if (activeTab !== 'Representación') return false;
    if (filter === 'Todas') return true;
    if (filter === 'Nuevas') return req.status === 'Pending';
    if (filter === 'Pendientes') return req.status === 'Pending';
    if (filter === 'Completadas') return req.status === 'Accepted';
    if (filter === 'Canceladas') return req.status === 'Rejected';
    return true;
  }));

  return (
    <HeaderLayout>
      <div className="max-w-3xl mx-auto w-full bg-card rounded-xl shadow-md border border-border mt-8 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-border bg-background rounded-t-xl">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`flex-1 py-3 text-center font-display font-semibold transition
                ${activeTab === tab ? 'border-b-2 border-primary text-primary bg-background' : 'text-muted-foreground'}`}
              onClick={() => { setActiveTab(tab); setSelected(null); }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Buscador */}
        <div className="p-4 border-b border-border bg-background">
          <input
            className="w-full rounded-lg bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Filtros debajo del buscador */}
          <div className="flex gap-2 mt-3">
            {(
              activeTab === 'Contratación'
                ? ['Pendientes', 'Completadas', 'Canceladas']
                : ['Todas', 'Pendientes', 'Aceptadas']
            ).map(filtro => (
              <button
                key={filtro}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition
                  ${filter === filtro ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground border-border hover:border-primary'}`}
                onClick={() => setFilter(filtro)}
              >
                {filtro}
              </button>
            ))}
          </div>
        </div>
        {/* Lista de tarjetas */}
        {activeTab === 'Contratación' ? (
          <div className="overflow-y-auto flex flex-col gap-6 py-4 px-2" style={{ maxHeight: 400, minHeight: 240 }}>
            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Cargando solicitudes...</div>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map(request => (
                <CardItemRequest
                  key={request.id}
                  item={request}
                  onClick={() => setSelected(request)}
                  selected={selected?.id === request.id}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">No hay solicitudes de contratación en esta sección.</div>
            )}
          </div>
        ) : activeTab === 'Ofertas' ? (
          <div className="overflow-y-auto bg-card" style={{ maxHeight: 400, minHeight: 240 }}>
            {filter === 'Todas' && (
              interested.length > 0 ? (
                interested.map(item => (
                  <CardItemRequest
                    key={item.id}
                    item={{
                      ...item,
                      artist: undefined,
                      name: item.venue?.name,
                      avatar: item.venue?.avatar,
                      city: item.venue?.city,
                      country: item.venue?.country,
                      price: item.price,
                      date: item.date,
                    }}
                    onClick={() => setSelected(item)}
                    selected={selected?.id === item.id}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">No hay ofertas en esta sección.</div>
              )
            )}
            {filter === 'Pendientes' && (
              interested.filter(item => item.status === 'pending').length > 0 ? (
                interested.filter(item => item.status === 'pending').map(item => (
                  <CardItemRequest
                    key={item.id}
                    item={{
                      ...item,
                      artist: undefined,
                      name: item.venue?.name,
                      avatar: item.venue?.avatar,
                      city: item.venue?.city,
                      country: item.venue?.country,
                      price: item.price,
                      date: item.date,
                    }}
                    onClick={() => setSelected(item)}
                    selected={selected?.id === item.id}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">No hay ofertas pendientes.</div>
              )
            )}
            {filter === 'Aceptadas' && (
              interested.filter(item => item.status === 'accepted').length > 0 ? (
                interested.filter(item => item.status === 'accepted').map(item => (
                  <CardItemRequest
                    key={item.id}
                    item={{
                      ...item,
                      artist: undefined,
                      name: item.venue?.name,
                      avatar: item.venue?.avatar,
                      city: item.venue?.city,
                      country: item.venue?.country,
                      price: item.price,
                      date: item.date,
                    }}
                    onClick={() => setSelected(item)}
                    selected={selected?.id === item.id}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">No hay ofertas aceptadas.</div>
              )
            )}
          </div>
        ) : activeTab === 'Representación' ? (
          <div className="overflow-y-auto bg-card" style={{ maxHeight: 400, minHeight: 240 }}>
            {loadingManagers ? (
              <div className="text-center text-muted-foreground py-10">Cargando solicitudes de representación...</div>
            ) : filteredManagerRequests.length > 0 ? (
              filteredManagerRequests.map(item => (
                <CardItemRequest key={item.id} item={item} onClick={() => setSelected(item)} selected={selected?.id === item.id} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">No hay solicitudes de representación en esta sección.</div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-10">No hay elementos en esta sección.</div>
        )}
        {/* Panel de mensajes/detalle */}
        <div className="border-t border-border bg-background">
          {selected ? (
            <div className="max-w-xl mx-auto p-8 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-xl mb-2">{selected.venue?.name || selected.name}</h2>
                <div className="text-sm text-muted-foreground mb-2">
                  {selected.venue?.city && selected.venue?.country ? `${selected.venue.city}, ${selected.venue.country}` : selected.venue?.city || selected.venue?.country || ''}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Día solicitado: <span className="font-semibold">{selected.date}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Oferta: <span className="font-semibold">{selected.price ? `${selected.price} €` : 'Sin oferta'}</span>
                </div>
              </div>
              {activeTab === 'Ofertas' && selected.status !== 'accepted' && (
                <div className="flex gap-2 items-center">
                  <button className="px-2 py-1 rounded-md border border-destructive text-destructive text-xs font-medium bg-transparent hover:bg-destructive/10 transition-colors shadow-sm">No me interesa</button>
                  <button
                    className="px-2 py-1 rounded-md border border-primary text-primary text-xs font-medium bg-transparent hover:bg-primary/10 transition-colors shadow-sm"
                    onClick={async () => {
                      if (selected) {
                        await updateInterestedStatus(selected.id, 'accepted');
                      }
                    }}
                  >
                    Me interesa
                  </button>
                </div>
              )}
              {activeTab === 'Contratación' && selected.status !== 'Accepted' && (

                <div className="flex gap-2 items-center">
                  <button
                    className="px-2 py-1 rounded-md border border-destructive text-destructive text-xs font-medium bg-transparent hover:bg-destructive/10 transition-colors shadow-sm"
                    onClick={async () => {
                      // Aquí deberías llamar a la función para rechazar la solicitud
                      // await acceptRequest({ id: selected.id, status: 'Rejected' });
                    }}
                  >
                    Rechazar
                  </button>
                  <button
                    className="px-2 py-1 rounded-md border border-success text-success text-xs font-medium bg-transparent hover:bg-success/10 transition-colors shadow-sm"
                    onClick={() => setShowContractModal(true)}
                  >
                    Aceptar
                  </button>
                </div>
              )}
              {activeTab === 'Contratación' && selected.status === 'Accepted' && (
                <div className="flex flex-col items-end text-success text-xs font-semibold">
                  Solicitud aceptada
                </div>
              )}
              {/* Modal de confirmación de contrato */}
              {selected && showContractModal && (
                <ContractAcceptModal
                  open={showContractModal}
                  onCancel={() => setShowContractModal(false)}
                  onConfirm={async () => {
                    await acceptRequest({ id: selected.id, status: 'Accepted' });
                    setShowContractModal(false);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Send className="mx-auto w-16 h-16 mb-4 opacity-30" />
              <h2 className="font-display font-bold text-lg mb-2">Tus mensajes</h2>
              <p>Selecciona una solicitud o mensaje para ver los detalles aquí.</p>
            </div>
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}
