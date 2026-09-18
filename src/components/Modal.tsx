import type { ReactNode } from 'react';
import './Modal.css';

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose}>
      <div className="modal-sheet anim-slide-up" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose}>
      <div className="bottom-sheet anim-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </div>
  );
}
