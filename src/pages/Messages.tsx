import { useConversations, useMessages } from '@/hooks/useMessages';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiFetch from '@/lib/api';
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

function ConversationList({ conversations, selectedId, onSelect }: { conversations: any[], selectedId: number | null, onSelect: (id: number) => void }) {
  const { user } = useAuth();
  if (!conversations.length) {
    return <div className="text-center text-muted-foreground py-16">No hay conversaciones.</div>;
  }
  return (
    <ul className="divide-y divide-border">
      {conversations.map((conv) => {
        // Buscar el otro participante (que no soy yo)
        let other = null;
        const myId = String(user?.id ?? user?.user_id);
        if (conv.participants.length === 2) {
          other = conv.participants.find((p: any) => String(p.id ?? p.user_id) !== myId);
        } else if (conv.participants.length === 1) {
          // Si solo hay uno, y es el propio usuario, no mostrar como "otro"
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
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Detectar userId en la query string y seleccionar/crear conversación
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      // Buscar si ya existe conversación con ese usuario
      const conv = conversations.find(c => c.participants.some(p => String(p.id) === String(userId)));
      if (conv) {
        setSelectedChat(conv.id);
      } else {
        // Crear conversación vía API y luego refrescar
        (async () => {
          try {
            console.log('[Messages] Intentando crear conversación con userId:', userId);
            const newConv = await apiFetch(`/messages/conversations/with/${userId}`, { method: 'POST', token });
            console.log('[Messages] Conversación creada:', newConv);
            setSelectedChat(newConv.id);
            // Limpiar solo el query param, manteniendo la ruta actual
            const path = location.pathname;
            navigate(path, { replace: true });
          } catch (e) {
            console.error('[Messages] Error creando conversación:', e);
          }
        })();
      }
    }
  }, [location.search, conversations, navigate]);

  // Por ahora solo un tab, pero preparado para más
  // const [tab, setTab] = useState<'principal' | 'general' | 'solicitudes'>('principal');

  const { user } = useAuth();
  const selectedConv = conversations.find((c) => c.id === selectedChat) || null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChat || !messageText.trim()) return;
    sendMessage.mutate({ conversationId: selectedChat, content: messageText }, {
      onSuccess: () => setMessageText(''),
    });
  };

  return (
    <HeaderLayout>
      <div className="max-w-6xl mx-auto w-full flex bg-background rounded-2xl shadow-xl border border-border mt-10 min-h-[600px]">
        {/* Columna izquierda: bandeja */}
        <div className="w-[370px] border-r border-border flex flex-col bg-card rounded-l-2xl">
          {/* Tabs arriba (por ahora oculto) */}
          {/* <div className="flex border-b border-border bg-background rounded-t-2xl overflow-hidden">
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
          </div> */}
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
            ) : (
              <ConversationList conversations={conversations} selectedId={selectedChat} onSelect={setSelectedChat} />
            )}
          </div>
        </div>
        {/* Columna derecha: detalle/conversación */}
        <div className="flex-1 flex flex-col bg-background rounded-r-2xl">
          {selectedConv ? (
            <>
              {/* Header del chat */}
              {(() => {
                // Lógica robusta: busca el primer participante que NO sea el usuario autenticado
                const myId = String(user?.id ?? user?.user_id);
                let other = null;
                if (selectedConv.participants.length === 2) {
                  other = selectedConv.participants.find((p: any) => String(p.id ?? p.user_id) !== myId);
                } else if (selectedConv.participants.length === 1) {
                  const only = selectedConv.participants[0];
                  if (String(only.id ?? only.user_id) !== myId) {
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
              })()}
              {/* Mensajes */}
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
              {/* Caja de texto con envío */}
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <span className="text-2xl font-bold mb-2">Selecciona un chat</span>
              <span className="text-sm">Elige una conversación para ver los mensajes aquí.</span>
            </div>
          )}
        </div>
      </div>
    </HeaderLayout>
  );
};

export default Messages;
