import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContractAcceptModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ContractAcceptModal({ open, onConfirm, onCancel }: ContractAcceptModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmación de Contrato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            Al pulsar “Confirmar y aceptar contrato”, ambas partes reconocen y aceptan que este acuerdo constituye un contrato vinculante, celebrado de forma electrónica conforme a la legislación aplicable. La aceptación digital equivale a la firma manuscrita y tiene plena validez legal. El contrato, sus términos y condiciones, y los datos de aceptación quedarán registrados y disponibles para ambas partes.
          </p>
          <p>
            Ambas partes declaran haber leído, comprendido y aceptado el contenido del contrato, y reconocen que la aceptación digital implica el compromiso de cumplir con las obligaciones pactadas.
          </p>
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button variant="gradient" onClick={onConfirm}>Confirmar y aceptar contrato</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
