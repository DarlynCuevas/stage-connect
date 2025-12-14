import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ModalSolicitudContratacionProps {
  open: boolean;
  onClose: () => void;
  fecha: Date | null;
  cacheBase: number;
  onSubmit: (data: {
    fecha: Date;
    oferta: number;
    tipoEvento: string;
    ubicacion: string;
    nombreLocal: string;
    ciudadLocal: string;
    mensaje?: string;
  }) => void;
}

export default function ModalSolicitudContratacion({ open, onClose, fecha, cacheBase, onSubmit }: ModalSolicitudContratacionProps) {
  const [oferta, setOferta] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [ciudadLocal, setCiudadLocal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaEditable, setFechaEditable] = useState(fecha ? fecha.toISOString().slice(0, 10) : '');

  React.useEffect(() => {
    setFechaEditable(fecha ? fecha.toISOString().slice(0, 10) : '');
  }, [fecha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaEditable || !tipoEvento || !ubicacion) return;
    onSubmit({
      fecha: new Date(fechaEditable),
      oferta: Number(oferta),
      tipoEvento,
      ubicacion,
      nombreLocal,
      ciudadLocal,
      mensaje,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitud de Contratación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Fecha seleccionada</label>
            <Input type="date" value={fechaEditable} onChange={e => setFechaEditable(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Caché base del artista</label>
            <Input value={`€${cacheBase}`} readOnly tabIndex={-1} />
          </div>
          <div>
            <label className="block mb-1">Oferta (€)</label>
            <Input type="number" value={oferta} onChange={e => setOferta(e.target.value)} required min={0} />
          </div>
          <div>
            <label className="block mb-1">Tipo de evento</label>
            <Input value={tipoEvento} onChange={e => setTipoEvento(e.target.value)} required placeholder="Ej: Concierto, Fiesta, Festival..." />
          </div>
          <div>
            <label className="block mb-1">Ubicación del evento</label>
            <Input value={ubicacion} onChange={e => setUbicacion(e.target.value)} required placeholder="Dirección o lugar del evento" />
          </div>
          <div>
            <label className="block mb-1">Nombre del local</label>
            <Input value={nombreLocal} onChange={e => setNombreLocal(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Ciudad del local</label>
            <Input value={ciudadLocal} onChange={e => setCiudadLocal(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">Mensaje para el artista</label>
            <textarea
              className="w-full border rounded p-2 min-h-[60px]"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              placeholder="Mensaje opcional para el artista"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Enviar solicitud</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
