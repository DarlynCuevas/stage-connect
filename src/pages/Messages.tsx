import { useConversations, useMessages } from '@/hooks/useMessages';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiFetch from '@/lib/api';
import { useUser } from '@/lib/users';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderLayout } from '@/components/layout/HeaderLayout';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useMessagesWebSocket } from '@/hooks/useMessagesWebSocket';
import { sanitizeMessageContent } from '@/lib/sanitize-message';

const TABS = [
  { key: 'principal', label: 'Principal' },
  { key: 'general', label: 'General' },
  { key: 'solicitudes', label: 'Solicitudes' },
];



function ConversationList({ conversations, selectedId, onSelect, tab, onAccept }: { conversations: any[], selectedId: number | null, onSelect: (id: number) => void, tab?: string, onAccept?: (id: number) => void }) {
  const { user } = useAuth();
  if (!conversations.length) {
    return <div className="text-center text-muted-foreground py-16">No hay conversaciones.</div>;
  }
  return (
    <ul className="divide-y divide-border">
      {conversations.map((conv) => {
        // Buscar el otro participante (que no soy yo)
        let other = null;
        const myId = String(user?.id);
        if (conv.participants.length === 2) {
          other = conv.participants.find((p: any) => String(p.id ?? p.user_id) !== myId);
        } else if (conv.participants.length === 1) {
          const only = conv.participants[0];
          if (String(only.id ?? only.user_id) !== myId) {
            other = only;
          } else {
            other = null;
          }
        }
        return (
          <li
            key={conv.id}
            className={`flex items-center gap-4 px-5 py-4 bg-background hover:bg-primary/5 transition rounded-xl mb-2 shadow-sm cursor-pointer group ${selectedId === conv.id ? 'ring-2 ring-primary/60 bg-primary/10' : ''}`}
            style={{ marginBottom: 12 }}
            onClick={() => onSelect(conv.id)}
          >
            <img
              src={other?.avatar || '/default-avatar.png'}
              alt={other?.name || 'Usuario'}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-semibold text-lg text-primary truncate group-hover:underline">{other?.nickName || other?.nick_name || other?.name || 'Usuario'}</span>
                <span className="text-xs text-muted-foreground ml-2 font-mono">{conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString() : ''}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate font-medium">{conv.lastMessage?.content || ''}</span>
                {/* Aquí podrías mostrar badge de no leídos si lo tienes */}
                {tab === 'solicitudes' && onAccept && (
                  <button
                    className="ml-2 px-3 py-1 text-xs rounded-full font-semibold border border-primary text-primary bg-white hover:bg-primary/10 transition"
                    onClick={e => {
                      e.stopPropagation();
                      onAccept(conv.id);
                    }}
                  >
                    Aceptar solicitud
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}


const Messages = () => {
  useMessagesWebSocket();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const { data: conversations = [], isLoading: loadingConvs } = useConversations();
  const { data: messages = [], isLoading: loadingMsgs } = useMessages(selectedChat ?? 0);
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user: authUser } = useAuth();

  // Tabs: principal, general, solicitudes
  const [tab, setTab] = useState<'principal' | 'general' | 'solicitudes'>('principal');

  // Limpiar la conversación seleccionada al cambiar de pestaña
  useEffect(() => {
    setSelectedChat(null);
  }, [tab]);

  // Utilidad para saber si hay follow mutuo entre dos usuarios
  const isMutualFollow = async (userA: number, userB: number) => {
    try {
      const [followersA, followersB] = await Promise.all([
        apiFetch(`/followers/followers-of/${userA}`, { token }),
        apiFetch(`/followers/followers-of/${userB}`, { token })
      ]);
      const aFollowsB = Array.isArray(followersA) && followersA.some((f: any) => f.user_id === userB);
      const bFollowsA = Array.isArray(followersB) && followersB.some((f: any) => f.user_id === userA);
      return aFollowsB && bFollowsA;
    } catch {
      return false;
    }
  };

  // Filtrado de conversaciones por pestaña
  const [filteredConvs, setFilteredConvs] = useState<any[]>([]);
  useEffect(() => {
    const myId = Number(authUser.id);
    const filterConvs = async () => {
      // --- 1. Calcular ids de solicitudes ---
      const solicitudesIds = new Set<number>();
      for (const conv of conversations) {
        if (conv.participants.length === 2) {
          const [a, b] = conv.participants;
          const roles = [a.role, b.role];
          if (((roles.includes('Artista') && roles.includes('Local')) || (roles.includes('Local') && roles.includes('Artista')))) {
            const artista = a.role === 'Artista' ? a : b;
            const local = a.role === 'Local' ? a : b;
            if (artista && local) {
              const artistaId = Number((artista as any).id ?? (artista as any).user_id);
              const localId = Number((local as any).id ?? (local as any).user_id);
              if (Number.isNaN(artistaId) || Number.isNaN(localId)) continue;
              try {
                const followersOfLocal = await apiFetch(`/followers/followers-of/${localId}`, { token });
                const followersOfArtista = await apiFetch(`/followers/followers-of/${artistaId}`, { token });
                const artistaSigueALocal = Array.isArray(followersOfArtista) && followersOfArtista.some((f: any) => f.user_id === localId);
                const localSigueAArtista = Array.isArray(followersOfLocal) && followersOfLocal.some((f: any) => f.user_id === artistaId);
                if (
                  (artistaSigueALocal && !localSigueAArtista) ||
                  (!artistaSigueALocal && !localSigueAArtista && Number(conv.lastMessage?.senderId) === artistaId)
                ) {
                  solicitudesIds.add(conv.id);
                }
              } catch {}
            }
          }
        }
      }

      if (tab === 'general') {
        const filtered = [];
        for (const conv of conversations) {
          if (
            conv.participants.length === 2 &&
            conv.status === 'accepted'
          ) {
            filtered.push(conv);
          }
        }
        setFilteredConvs(filtered);
      } else if (tab === 'solicitudes') {
        setFilteredConvs(conversations.filter(c => c.status === 'pending'));
      } else {
        // Principal: mostrar todas las demás EXCLUYENDO las de solicitudes
        setFilteredConvs(conversations.filter(c => !solicitudesIds.has(c.id)));
      }
    };
    filterConvs();
  }, [conversations, tab, authUser.id, token]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      // Buscar si ya existe conversación con ese usuario
      const conv = conversations.find(c => c.participants.some(p => String(p.id) === String(userId)));
      if (conv) {
        setSelectedChat(conv.id);
      }
      // Si no existe, no hacer nada. La conversación se creará al enviar el primer mensaje.
    }
  }, [location.search, conversations]);

  // Por ahora solo un tab, pero preparado para más
  // const [tab, setTab] = useState<'principal' | 'general' | 'solicitudes'>('principal');

  const { user } = useAuth();
  const selectedConv = conversations.find((c) => c.id === selectedChat) || null;

  // Si no hay conversación seleccionada pero hay userId en la URL, buscar datos del usuario objetivo
  const params = new URLSearchParams(location.search);
  const userIdParam = params.get('userId');
  const { data: targetUser } = useUser(userIdParam, token);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;
    // Si ya hay conversación seleccionada, enviar mensaje normalmente
    if (selectedChat) {
      sendMessage.mutate({ conversationId: selectedChat, content: messageText }, {
        onSuccess: () => {
          setMessageText('');
          // Forzar recarga de conversaciones y seguidores
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          if (authUser?.id) {
            queryClient.invalidateQueries({ queryKey: ['followers-of', authUser.id] });
          }
        },
      });
      return;
    }
    // Si no hay conversación seleccionada, crearla primero
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (!userId) return;
    try {
      // Crear conversación
      const newConv = await apiFetch(`/messages/conversations/with/${userId}`, { method: 'POST', token });
      setSelectedChat(newConv.id);
      // Enviar mensaje
      sendMessage.mutate({ conversationId: newConv.id, content: messageText }, {
        onSuccess: () => {
          setMessageText('');
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          if (authUser?.id) {
            queryClient.invalidateQueries({ queryKey: ['followers-of', authUser.id] });
          }
        },
      });
      // Limpiar el query param de userId
      const path = location.pathname;
      navigate(path, { replace: true });
    } catch (err) {
      console.error('[Messages] Error creando conversación y enviando mensaje:', err);
    }
  };

  return (
    <HeaderLayout>
      <div className="max-w-6xl mx-auto w-full flex bg-background rounded-2xl shadow-xl border border-border mt-10 min-h-[600px]">
        {/* Columna izquierda: bandeja */}
        <div className="w-[370px] border-r border-border flex flex-col bg-card rounded-l-2xl">
          {/* Tabs arriba */}
          <div className="flex border-b border-border bg-background rounded-t-2xl overflow-hidden">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`flex-1 py-4 text-center font-display font-semibold text-lg transition-colors tracking-wide
                  ${tab === t.key ? 'bg-primary/10 text-primary border-b-4 border-primary' : 'text-muted-foreground hover:bg-muted/40'}`}
                onClick={() => setTab(t.key as any)}
                style={{ letterSpacing: 1 }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Buscador */}
          <div className="p-4 border-b border-border bg-background">
            <input
              className="w-full rounded-lg bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Buscar..."
              // value={search}
              // onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Lista de chats */}
          <div className="flex-1 overflow-y-auto px-2 py-4 bg-background rounded-b-2xl">
            {loadingConvs ? (
              <div className="text-center text-muted-foreground py-16">Cargando...</div>
            ) : filteredConvs.length === 0 && userIdParam && targetUser ? (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-4 px-5 py-3 bg-card rounded-xl shadow border border-border w-full max-w-full">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-white">
                    <img src={targetUser.avatar || '/default-avatar.png'} alt={targetUser.name || 'Usuario'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="font-semibold text-lg text-primary truncate">{targetUser.nickName || targetUser.nick_name || targetUser.name || 'Usuario'}</span>
                    <span className="text-xs text-muted-foreground truncate">@{(targetUser.nickName || targetUser.nick_name || targetUser.name || 'usuario').toLowerCase().replace(/ /g, '_')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <ConversationList
                conversations={filteredConvs}
                selectedId={selectedChat}
                onSelect={setSelectedChat}
                tab={tab}
                onAccept={async (convId: number) => {
                  try {
                    await apiFetch(`/messages/conversations/${convId}/accept`, { method: 'POST', token });
                    queryClient.invalidateQueries({ queryKey: ['conversations'] });
                    setTab('general'); // Opcional: cambia automáticamente a la pestaña General
                  } catch (e) {
                    alert('Error al aceptar la solicitud');
                  }
                }}
              />
            )}
          </div>
        </div>
        { }
        <div className="flex-1 flex flex-col bg-background rounded-r-2xl">
          <div className="flex flex-col h-full min-h-[600px]">
            {/* Header del chat o provisional */}
            {selectedConv ? (
              (() => {
                const myId = String(user?.id);
                let other = null;
                if (selectedConv.participants.length === 2) {
                  other = selectedConv.participants.find((p: any) => String(p.id) !== myId);
                } else if (selectedConv.participants.length === 1) {
                  const only = selectedConv.participants[0];
                  if (String(only.id) !== myId) {
                    other = only;
                  } else {
                    other = null;
                  }
                }
                return (
                  <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-card rounded-tr-2xl">
                    <img src={other?.avatar || '/default-avatar.png'} alt={other?.name || 'Usuario'} className="w-10 h-10 rounded-full border border-primary/30" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg text-primary">{other?.nickName || other?.nick_name || other?.name || 'Usuario'}</span>
                      <span className="text-xs text-muted-foreground">@{(other?.nickName || other?.nick_name || other?.name || 'usuario').toLowerCase().replace(/ /g, '_')}</span>
                    </div>
                  </div>
                );
              })()
            ) : userIdParam && targetUser ? (
              <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-card rounded-tr-2xl">
                <img src={targetUser.avatar || '/default-avatar.png'} alt={targetUser.name || 'Usuario'} className="w-10 h-10 rounded-full border border-primary/30" />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-primary">{targetUser.nickName || targetUser.nick_name || targetUser.name || 'Usuario'}</span>
                  <span className="text-xs text-muted-foreground">@{(targetUser.nickName || targetUser.nick_name || targetUser.name || 'usuario').toLowerCase().replace(/ /g, '_')}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <span className="text-2xl font-bold mb-2">Selecciona un chat</span>
                <span className="text-sm">Elige una conversación para ver los mensajes aquí.</span>
              </div>
            )}
            {/* Mensajes (solo si hay conversación) */}
            {selectedConv && (
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3 bg-background">
                {loadingMsgs ? (
                  <div className="text-center text-muted-foreground py-16">Cargando mensajes...</div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${String(msg.senderId) === String(user?.id) ? 'bg-primary text-white self-end' : 'bg-muted text-primary self-start'}`}
                    >
                      {sanitizeMessageContent(msg.content)}
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}
            {/* Input y botón de enviar siempre abajo */}
            <div className="mt-auto">
              {tab === 'solicitudes' && selectedConv?.status === 'pending' ? (
                <div className="border-t border-border px-6 py-4 bg-card rounded-br-2xl flex items-center gap-3 text-muted-foreground">
                  <span className="italic">Debes aceptar la solicitud para poder responder.</span>
                </div>
              ) : !selectedConv ? (
                <div className="border-t border-border px-6 py-4 bg-card rounded-br-2xl flex items-center gap-3 text-muted-foreground">
                  <span className="italic">Selecciona una conversación para enviar mensajes.</span>
                </div>
              ) : (
                <form onSubmit={handleSend} className="border-t border-border px-6 py-4 bg-card rounded-br-2xl flex items-center gap-3">
                  <input
                    className="flex-1 rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enviar mensaje..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    disabled={sendMessage.isPending}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white rounded-full p-2 px-4 font-semibold shadow disabled:opacity-60"
                    disabled={!messageText.trim() || sendMessage.isPending}
                  >
                    {sendMessage.isPending ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Messages;
