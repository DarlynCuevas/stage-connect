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
      const created = await createInterested(venueId!, [artistId!], date, price, managerId);
      // PATCH para cambiar el status a 'accepted' y disparar la notificación
      if (created && created[0] && created[0].id) {
        await import('@/lib/interested').then(({ updateInterestedStatus }) =>
          updateInterestedStatus(created[0].id, 'accepted')
        );
      }
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
          padding: '0.6rem 0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontFamily: 'Inter, Plus Jakarta Sans, sans-serif',
          background: 'transparent',
          maxWidth: 320,
          minWidth: 0,
        }}
      >
        <span style={{ fontWeight: 500, color: 'hsl(var(--foreground))', fontSize: '0.97em', lineHeight: 1.3 }}>
          El local <span style={{ fontWeight: 600 }}>{venueName}</span> en <span style={{ fontWeight: 600 }}>{venueCity}</span> tiene disponible el <span style={{ fontWeight: 600 }}>{date}</span>.
        </span>
        {typeof price === 'number' && (
          <span style={{ fontWeight: 500, color: 'hsl(var(--muted-foreground))', fontSize: '0.95em' }}>
            Oferta: €{price.toLocaleString()}
          </span>
        )}
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: 2 }}>
          <button
            style={{
              padding: '3.5px 10px',
              borderRadius: '5px',
              background: 'hsl(var(--secondary))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              fontWeight: 500,
              fontFamily: 'inherit',
              fontSize: '0.92rem',
              boxShadow: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              minWidth: 0,
            }}
            onClick={onDetails}
          >
            Ver detalles
          </button>
          <button
            style={{
              padding: '3.5px 10px',
              borderRadius: '5px',
              background: 'hsl(var(--secondary))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              fontWeight: 500,
              fontFamily: 'inherit',
              fontSize: '0.92rem',
              boxShadow: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              minWidth: 0,
            }}
            onClick={handleInterest}
          >
            Me interesa
          </button>
        </div>
      </div>
    ),
    duration: 5000,
  });
}
