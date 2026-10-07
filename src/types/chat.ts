/** Quién escribió el mensaje. */
export type Role = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  role: Role;
  /** Contenido en markdown (los mensajes del agente se renderizan como markdown). */
  content: string;
  createdAt: number;
}

/** Estado de la conexión con el agente. */
export type ConnectionStatus = 'connecting' | 'online' | 'offline';

/** Mensaje que llega desde el agente a través de un transporte. */
export interface AgentEvent {
  type: 'message' | 'typing' | 'error';
  content?: string;
}

export type AgentListener = (event: AgentEvent) => void;
export type StatusListener = (status: ConnectionStatus) => void;
