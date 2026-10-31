import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { IconButton } from './Buttons';
import { PaintedDivider } from './Ornaments';

interface ModalProps {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, title, eyebrow, onClose, children, className = '' }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`modal ${className}`.trim()}>
      <div className="modal__scrim" onClick={onClose} aria-hidden="true" />
      <div
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal__tassel" aria-hidden="true" />
        <header className="modal__head">
          <div>
            {eyebrow ? <span className="modal__eyebrow">{eyebrow}</span> : null}
            <h2 className="modal__title">{title}</h2>
          </div>
          <IconButton ref={closeRef} icon="close" label={`Close ${title}`} variant="cream" size="sm" onClick={onClose} />
        </header>
        <PaintedDivider className="modal__divider" />
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
