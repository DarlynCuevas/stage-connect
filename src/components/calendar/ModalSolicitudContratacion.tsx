import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ModalSolicitudContratacionProps {
  open: boolean;
  onClose: () => void;
  fecha: Date | null;
  cacheBase: number;
  allowNegotiation?: boolean;
  nombreLocalDefault?: string;
  ciudadLocalDefault?: string;
  ubicacionDefault?: string;
  fixedPrice?: number; // Si se pasa, el precio es cerrado y no editable
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


export default function ModalSolicitudContratacion({ open, onClose, fecha, cacheBase, allowNegotiation = true, nombreLocalDefault = '', ciudadLocalDefault = '', ubicacionDefault = '', fixedPrice, onSubmit }: ModalSolicitudContratacionProps) {
  // Log para confirmar que la prop llega correctamente
  React.useEffect(() => {
    console.log('[ModalSolicitudContratacion] ubicacionDefault prop:', ubicacionDefault);
  }, [ubicacionDefault]);
  const [oferta, setOferta] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [tipoEventoOtro, setTipoEventoOtro] = useState('');
  const [isOtro, setIsOtro] = useState(false);

  const tiposEvento = [
    'Concierto',
    'Sesión de DJ',
    'Fiesta privada',
    'Evento corporativo',
    'Festival',
    'Open mic',
    'Showcase',
    'Obra de teatro',
    'Afterwork',
    'Otro',
  ];
  const [ubicacion, setUbicacion] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [ciudadLocal, setCiudadLocal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaEditable, setFechaEditable] = useState('');

  React.useEffect(() => {
    if (open) {
      setNombreLocal(nombreLocalDefault || '');
      setCiudadLocal(ciudadLocalDefault || '');
      setUbicacion(ubicacionDefault || '');
      if (fixedPrice !== undefined && fixedPrice !== null) {
        setOferta(String(fixedPrice));
      } else {
        setOferta('');
      }
      setTipoEvento('');
      setMensaje('');
      setFechaEditable(fecha ? fecha.toISOString().slice(0, 10) : '');
      // Log para confirmar que el estado se inicializa correctamente
      console.log('[ModalSolicitudContratacion] setUbicacion inicial:', ubicacionDefault || '');
    }
  }, [open, nombreLocalDefault, ciudadLocalDefault, ubicacionDefault, fecha, fixedPrice]);

  React.useEffect(() => {
    setFechaEditable(fecha ? fecha.toISOString().slice(0, 10) : '');
  }, [fecha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tipoFinal = isOtro ? tipoEventoOtro : tipoEvento;
    if (!fechaEditable || !tipoFinal || !ubicacion) return;
    onSubmit({
      fecha: new Date(fechaEditable),
      oferta: Number(oferta),
      tipoEvento: tipoFinal,
      ubicacion,
      nombreLocal,
      ciudadLocal,
      mensaje,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-0">
        <DialogHeader className="px-8 pt-8 pb-2">
          <DialogTitle className="text-2xl font-semibold text-gray-900 mb-2">Solicitud de Contratación</DialogTitle>
          <p className="text-sm text-gray-500">Completa los datos para enviar tu propuesta al artista.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-8 pt-2 pb-8">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha seleccionada</label>
              <Input type="date" value={fechaEditable} onChange={e => setFechaEditable(e.target.value)} required className="rounded-lg border-gray-200" />
            </div>
            {fixedPrice === undefined || fixedPrice === null ? (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Caché base del artista</label>
                <Input value={`${Number(cacheBase).toLocaleString('es-ES', { minimumFractionDigits: 0 })} €`} readOnly tabIndex={-1} className="rounded-lg border-gray-200 bg-gray-50 text-gray-700" />
              </div>
            ) : null}
            {fixedPrice !== undefined && fixedPrice !== null ? (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Precio cerrado</label>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1 text-base font-normal text-muted-foreground">
                  {Number(fixedPrice).toLocaleString('es-ES', { minimumFractionDigits: 0 })} €
                </div>
                <p className="text-xs text-gray-400 mt-1">Este es el precio cerrado acordado por el local. No es editable.</p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Oferta (€)</label>
                <Input
                  type="number"
                  value={oferta}
                  onChange={e => setOferta(e.target.value)}
                  min={0}
                  required={!!allowNegotiation}
                  className="rounded-lg border-gray-200 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-gray-50 text-gray-700"
                  style={{ MozAppearance: 'textfield' }}
                />
                {!allowNegotiation && (
                  <p className="text-xs text-gray-400 mt-1">Este artista no permite negociar el caché base. El precio es fijo.</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de evento</label>
              <Select
                value={tipoEvento}
                onValueChange={value => {
                  setTipoEvento(value);
                  setIsOtro(value === 'Otro');
                  if (value !== 'Otro') setTipoEventoOtro('');
                }}
              >
                <SelectTrigger className="w-full rounded-lg border-gray-200">
                  <SelectValue placeholder="Selecciona tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposEvento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isOtro && (
                <Input
                  className="mt-2 rounded-lg border-gray-200"
                  value={tipoEventoOtro}
                  onChange={e => setTipoEventoOtro(e.target.value)}
                  required
                  placeholder="Describe el tipo de evento"
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Ubicación del evento</label>
              <Input value={ubicacion} onChange={e => setUbicacion(e.target.value)} required placeholder="Dirección o lugar del evento" className="rounded-lg border-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nombre del local</label>
                <Input value={nombreLocal} onChange={e => setNombreLocal(e.target.value)} required className="rounded-lg border-gray-200" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ciudad del local</label>
                <Input value={ciudadLocal} onChange={e => setCiudadLocal(e.target.value)} required className="rounded-lg border-gray-200" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Mensaje para el artista</label>
              <textarea
                className="w-full border rounded-lg p-2 min-h-[60px] border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Mensaje opcional para el artista"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-lg px-6 text-gray-700 border-gray-200">Cancelar</Button>
            <Button type="submit" className="rounded-lg px-6">Enviar solicitud</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
