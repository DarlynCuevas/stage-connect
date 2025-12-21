import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import React from "react";
import { createInterested } from "@/lib/interested";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";


interface ShowOpportunityNotificationArgs {
  venueName: string;
  venueCity: string;
  date: string;
  role: "artista" | "manager";
  onDetails: () => void;
  onInterest: () => Promise<void> | void;
  price?: number;
}


export function showOpportunityNotification({
  venueName,
  venueCity,
  date,
  role,
  onDetails,
  onInterest,
  venueId,
  artistId,
  managerId,
  price
}: ShowOpportunityNotificationArgs & { venueId?: number, artistId?: number, managerId?: number, price?: number }) {
  const handleInterest = async () => {
    try {
      await createInterested(venueId!, [artistId!], date, price, managerId);
      toast({
        title: '¡Interés registrado!',
        description: 'Tu interés ha sido enviado al local. Si eres seleccionado, te contactarán.',
        duration: 4000,
      });
      if (onInterest) onInterest();
    } catch (err: any) {
      toast({
        title: 'Error al registrar interés',
        description: err?.message || 'No se pudo registrar tu interés.',
        variant: 'destructive',
        duration: 4000,
      });
    }
  };
  toast({
    title: '¡Oportunidad de actuación!',
    description: (
      <div
        style={{
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-card)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontFamily: 'Inter, Plus Jakarta Sans, sans-serif',
        }}
      >
        <span style={{ fontWeight: 500 }}>
          El local <span style={{ color: 'hsl(var(--primary))', fontWeight: 700 }}>{venueName}</span> en <span style={{ color: 'hsl(var(--accent))', fontWeight: 700 }}>{venueCity}</span> tiene disponible el <span style={{ color: 'hsl(var(--success))', fontWeight: 700 }}>{date}</span>.
        </span>
        {typeof price === 'number' && (
          <span style={{ fontWeight: 600, color: 'hsl(var(--primary))', fontSize: '1.1em' }}>
            Oferta: €{price.toLocaleString()}
          </span>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 4 }}>
          <button
            style={{
              padding: '6px 18px',
              borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'filter 0.2s',
            }}
            onClick={onDetails}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
            onMouseOut={e => (e.currentTarget.style.filter = 'none')}
          >
            Ver detalles
          </button>
          <button
            style={{
              padding: '6px 18px',
              borderRadius: 'var(--radius)',
              background: 'hsl(var(--success))',
              color: 'hsl(var(--success-foreground))',
              border: 'none',
              fontWeight: 600,
              fontFamily: 'inherit',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'filter 0.2s',
            }}
            onClick={handleInterest}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
            onMouseOut={e => (e.currentTarget.style.filter = 'none')}
          >
            Me interesa
          </button>
        </div>
      </div>
    ),
    duration: 5000,
  });
}
