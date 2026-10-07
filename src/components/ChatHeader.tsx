import type { ConnectionStatus } from '../types/chat';

interface Props {
  title: string;
  status: ConnectionStatus;
  onClose: () => void;
  onClear: () => void;
}

const statusLabel: Record<ConnectionStatus, string> = {
  connecting: 'Conectando…',
  online: 'En línea',
  offline: 'Sin conexión',
};

export function ChatHeader({ title, status, onClose, onClear }: Props) {
  return (
    <header className="agc-header">
      <div className="agc-avatar" aria-hidden="true">
        AG
      </div>
      <div className="agc-heading">
        <h2>{title}</h2>
        <span className={`agc-status agc-status--${status}`} data-testid="status">
          {statusLabel[status]}
        </span>
      </div>
      <button type="button" className="agc-icon-btn" onClick={onClear} aria-label="Limpiar conversación">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 7h12M9 7V5h6v2m-8 0 1 12h8l1-12" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
      <button type="button" className="agc-icon-btn" onClick={onClose} aria-label="Cerrar chat">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </button>
    </header>
  );
}
