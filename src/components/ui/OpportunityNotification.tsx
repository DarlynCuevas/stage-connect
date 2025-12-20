import React from "react";

interface OpportunityNotificationProps {
  venueName: string;
  venueCity: string;
  date: string;
  role: "artista" | "manager";
  onDetails: () => void;
  onInterest: () => void;
}

export const OpportunityNotification: React.FC<OpportunityNotificationProps> = ({
  venueName,
  venueCity,
  date,
  role,
  onDetails,
  onInterest,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-2 border border-gray-200 w-80">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎤</span>
        <span className="font-bold text-lg">¡Oportunidad de actuación!</span>
      </div>
      <div className="text-gray-700 text-sm">
        El local <b>{venueName}</b> en <b>{venueCity}</b> tiene disponible el <b>{date}</b>.
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          onClick={onDetails}
        >
          Ver detalles
        </button>
        <button
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          onClick={onInterest}
        >
          Me interesa
        </button>
      </div>
    </div>
  );
};
