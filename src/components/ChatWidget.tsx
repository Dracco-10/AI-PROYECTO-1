import { useMemo, useState, type CSSProperties } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatTransport } from '../transport/ChatTransport';
import { MockTransport } from '../transport/MockTransport';
import { ChatHeader } from './ChatHeader';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import '../styles/widget.css';

export interface ChatWidgetProps {
  /** Transporte a usar; si no se pasa, se usa el endpoint simulado. */
  transport?: ChatTransport;
  title?: string;
  greeting?: string;
  placeholder?: string;
  /** Abre el panel desde el inicio. */
  defaultOpen?: boolean;
  /** Color principal del widget (cualquier color CSS). */
  accentColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function ChatWidget({
  transport,
  title = 'Asistente AGIChat',
  greeting = '¡Hola! ¿En qué te puedo ayudar hoy?',
  placeholder = 'Escribe un mensaje…',
  defaultOpen = false,
  accentColor,
  position = 'bottom-right',
}: ChatWidgetProps) {
  const activeTransport = useMemo(() => transport ?? new MockTransport(), [transport]);
  const { messages, status, isTyping, sendMessage, clear } = useChat(activeTransport, greeting);
  const [open, setOpen] = useState(defaultOpen);

  const style = accentColor ? ({ '--agc-accent': accentColor } as CSSProperties) : undefined;

  return (
    <div className={`agc-root agc-root--${position}`} style={style}>
      {open && (
        <section className="agc-panel" role="dialog" aria-label={title}>
          <ChatHeader title={title} status={status} onClose={() => setOpen(false)} onClear={clear} />
          <MessageList
            messages={messages}
            isTyping={isTyping}
            emptyText="La conversación está vacía. Escribe abajo para empezar."
          />
          <ChatInput onSend={sendMessage} disabled={status !== 'online'} placeholder={placeholder} />
        </section>
      )}
      <button
        type="button"
        className="agc-launcher"
        aria-expanded={open}
        aria-label={open ? 'Ocultar chat' : 'Abrir chat'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="M4 5h16v11H9l-5 4V5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
