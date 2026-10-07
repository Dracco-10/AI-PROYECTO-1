import type { AgentListener, StatusListener } from '../types/chat';

/**
 * Puerto (interfaz) que separa la interfaz gráfica del origen de las respuestas.
 * Hoy lo implementa un mock; en la fase 2 se implementa con el agente real
 * sin tocar ningún componente de la UI.
 */
export interface ChatTransport {
  connect(): void;
  disconnect(): void;
  send(text: string): void;
  onEvent(listener: AgentListener): () => void;
  onStatus(listener: StatusListener): () => void;
}
