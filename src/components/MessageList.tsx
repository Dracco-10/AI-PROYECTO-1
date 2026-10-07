import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat';
import { MessageBubble } from './MessageBubble';

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
  emptyText: string;
}

export function MessageList({ messages, isTyping, emptyText }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="agc-scroll" role="log" aria-live="polite" aria-label="Conversación">
      {messages.length === 0 && !isTyping ? (
        <p className="agc-empty">{emptyText}</p>
      ) : (
        <ul className="agc-list">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {isTyping && (
            <li className="agc-msg agc-msg--agent" aria-label="El agente está escribiendo">
              <div className="agc-bubble agc-typing" data-testid="typing">
                <span />
                <span />
                <span />
              </div>
            </li>
          )}
        </ul>
      )}
      <div ref={endRef} />
    </div>
  );
}
