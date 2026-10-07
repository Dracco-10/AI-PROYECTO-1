/**
 * Punto de entrada del SDK de AGIChat.
 * Todo lo que se exporta aquí es la API pública del widget.
 */
import { createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ChatWidget, type ChatWidgetProps } from './components/ChatWidget';

export { ChatWidget } from './components/ChatWidget';
export type { ChatWidgetProps } from './components/ChatWidget';
export type { ChatTransport } from './transport/ChatTransport';
export { MockTransport } from './transport/MockTransport';
export { WebSocketTransport } from './transport/WebSocketTransport';
export type { ChatMessage, ConnectionStatus, AgentEvent } from './types/chat';

/** Monta el widget en cualquier página, aunque no use React. */
export function mountAgiChat(container: HTMLElement, props: ChatWidgetProps = {}): Root {
  const root = createRoot(container);
  root.render(createElement(ChatWidget, props));
  return root;
}
