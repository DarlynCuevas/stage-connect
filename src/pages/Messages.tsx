import React, { useState } from 'react';

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
  { key: 'managers', label: 'Managers' },
  { key: 'artists', label: 'Artistas' },
];

function ConversationList({ conversations }: { conversations: typeof mockManagers }) {
  if (!conversations.length) {
    return (
      <div className="text-center text-gray-400 py-12">No hay conversaciones.</div>
    );
  }
  return (
    <ul className="divide-y divide-gray-100">
      {conversations.map((conv) => (
        <li key={conv.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
          <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 truncate">{conv.name}</span>
              <span className="text-xs text-gray-400 ml-2">{conv.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 truncate">{conv.lastMessage}</span>
              {conv.unread > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">{conv.unread}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

const Messages: React.FC = () => {
  const [tab, setTab] = useState<'managers' | 'artists'>('managers');

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow mt-8">
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`flex-1 py-3 text-center font-semibold transition-colors ${tab === t.key ? 'border-b-2 border-blue-500 text-blue-600 bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab(t.key as 'managers' | 'artists')}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="h-[420px] overflow-y-auto">
        {tab === 'managers' ? (
          <ConversationList conversations={mockManagers} />
        ) : (
          <ConversationList conversations={mockArtists} />
        )}
      </div>
    </div>
  );
};

export default Messages;
