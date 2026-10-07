import { useCallback, useEffect, useState } from 'react';
import type { ChatTransport } from '../transport/ChatTransport';
import type { ChatMessage, ConnectionStatus, Role } from '../types/chat';

let counter = 0;
export const createMessage = (role: Role, content: string): ChatMessage => ({
  id: `msg-${Date.now()}-${++counter}`,
  role,
  content,
  createdAt: Date.now(),
});

export interface UseChatResult {
  messages: ChatMessage[];
  status: ConnectionStatus;
  isTyping: boolean;
  sendMessage: (text: string) => void;
  clear: () => void;
}

/** Conecta la UI con cualquier transporte y mantiene el estado del chat. */
export function useChat(transport: ChatTransport, greeting?: string): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    greeting ? [createMessage('agent', greeting)] : [],
  );
  const [status, setStatus] = useState<ConnectionStatus>('offline');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const offStatus = transport.onStatus(setStatus);
    const offEvent = transport.onEvent((event) => {
      if (event.type === 'typing') {
        setIsTyping(true);
        return;
      }
      setIsTyping(false);
      const role: Role = event.type === 'error' ? 'system' : 'agent';
      setMessages((prev) => [...prev, createMessage(role, event.content ?? '')]);
    });
    transport.connect();
    return () => {
      offStatus();
      offEvent();
      transport.disconnect();
    };
  }, [transport]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setMessages((prev) => [...prev, createMessage('user', trimmed)]);
      transport.send(trimmed);
    },
    [transport],
  );

  const clear = useCallback(() => setMessages([]), []);

  return { messages, status, isTyping, sendMessage, clear };
}
