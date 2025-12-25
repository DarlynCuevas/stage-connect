
import React, { useState } from 'react';
import { HeaderLayout } from '@/components/layout/HeaderLayout';

// Mocked conversations data
const mockManagers = [
  {
    id: 'm1',
    name: 'Sofía Martínez',
    lastMessage: 'Gracias por la info, lo reviso.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    unread: 2,
    time: '10:24',
  },
  {
    id: 'm2',
    name: 'Carlos Gómez',
    lastMessage: '¿Confirmamos la fecha?',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    unread: 0,
    time: 'Ayer',
  },
];

const mockArtists = [
  {
    id: 'a1',
    name: 'Luna Rivera',
    lastMessage: '¡Genial, muchas gracias!',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    unread: 1,
    time: '09:10',
  },
  {
    id: 'a2',
    name: 'Diego Torres',
    lastMessage: 'Te paso el rider técnico.',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    unread: 0,
    time: 'Lun',
  },
];

const TABS = [
  { key: 'principal', label: 'Principal' },
  { key: 'general', label: 'General' },
  { key: 'solicitudes', label: 'Solicitudes' },
];
// Mock stories/accesos rápidos
const mockStories = [
  { id: 's1', name: 'Tu nota', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 's2', name: 'NaOmix20', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 's3', name: 'Jungla Linye', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 's4', name: 'Sandy Ortiz', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

// Mock messages for right panel
const mockMessages = [
  { id: 1, fromMe: false, text: '¡Hola! ¿Cómo estás?', time: '10:13 am' },
  { id: 2, fromMe: true, text: '¡Bien! ¿Y tú?', time: '10:14 am' },
  { id: 3, fromMe: false, text: 'Genial, ¿te paso el rider?', time: '10:15 am' },
  { id: 4, fromMe: true, text: 'Sí, por favor.', time: '10:16 am' },
];

function ConversationList({ conversations, selectedId, onSelect }: { conversations: typeof mockManagers, selectedId: string | null, onSelect: (id: string) => void }) {
  if (!conversations.length) {
    return (
      <div className="text-center text-muted-foreground py-16">No hay conversaciones.</div>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {conversations.map((conv) => (
        <li
          key={conv.id}
          className={`flex items-center gap-4 px-5 py-4 bg-background hover:bg-primary/5 transition rounded-xl mb-2 shadow-sm cursor-pointer group ${selectedId === conv.id ? 'ring-2 ring-primary/60 bg-primary/10' : ''}`}
          style={{ marginBottom: 12 }}
          onClick={() => onSelect(conv.id)}
        >
          <img
            src={conv.avatar}
            alt={conv.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary shadow"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <span className="font-display font-semibold text-lg text-primary truncate group-hover:underline">{conv.name}</span>
              <span className="text-xs text-muted-foreground ml-2 font-mono">{conv.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground truncate font-medium">{conv.lastMessage}</span>
              {conv.unread > 0 && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold shadow border-2 border-white animate-pulse">{conv.unread}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}


// Mock data for each tab (replace with real data logic as needed)
const mockPrincipal = [
  ...mockManagers,
];
const mockGeneral = [
  ...mockArtists,
];
const mockSolicitudes = [
  {
    id: 's1',
    name: 'Solicitud de Juan',
    lastMessage: '¿Puedo tocar en tu sala?',
    avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
    unread: 1,
    time: 'Hoy',
  },
];

const Messages: React.FC = () => {
  const [tab, setTab] = useState<'principal' | 'general' | 'solicitudes'>('principal');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Determinar la lista de conversaciones según el tab
  let conversations = mockPrincipal;
  if (tab === 'general') conversations = mockGeneral;
  if (tab === 'solicitudes') conversations = mockSolicitudes;

  // Chat seleccionado
  const selectedConv = conversations.find(c => c.id === selectedChat) || null;

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
                onClick={() => { setTab(t.key as 'principal' | 'general' | 'solicitudes'); setSelectedChat(null); }}
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
            <ConversationList conversations={conversations} selectedId={selectedChat} onSelect={setSelectedChat} />
          </div>
        </div>
        {/* Columna derecha: detalle/conversación */}
        <div className="flex-1 flex flex-col bg-background rounded-r-2xl">
          {selectedConv ? (
            <>
              {/* Header del chat */}
              <div className="flex items-center gap-3 border-b border-border px-6 py-4 bg-card rounded-tr-2xl">
                <img src={selectedConv.avatar} alt={selectedConv.name} className="w-10 h-10 rounded-full border border-primary/30" />
                <div className="flex flex-col">
                  <span className="font-semibold text-lg text-primary">{selectedConv.name}</span>
                  <span className="text-xs text-muted-foreground">@{selectedConv.name.toLowerCase().replace(/ /g, '_')}</span>
                </div>
              </div>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3 bg-background">
                {mockMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm text-sm ${msg.fromMe ? 'bg-primary text-white self-end' : 'bg-muted text-primary self-start'}`}
                  >
                    {msg.text}
                    <div className="text-[10px] text-muted-foreground mt-1 text-right">{msg.time}</div>
                  </div>
                ))}
              </div>
              {/* Caja de texto */}
              <div className="border-t border-border px-6 py-4 bg-card rounded-br-2xl flex items-center gap-3">
                <input
                  className="flex-1 rounded-full bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enviar mensaje..."
                  disabled
                />
                <button className="bg-primary text-white rounded-full p-2 px-4 font-semibold shadow disabled:opacity-60" disabled>Enviar</button>
              </div>
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
