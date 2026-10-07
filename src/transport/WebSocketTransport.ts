import type { AgentEvent } from '../types/chat';
import type { ChatTransport } from './ChatTransport';
import { Emitter } from './Emitter';

type SocketFactory = (url: string) => WebSocket;

/**
 * Transporte real por websockets, listo para la fase 2.
 * El servidor debe enviar JSON con la forma de `AgentEvent`
 * ({ "type": "message", "content": "**hola**" }).
 */
export class WebSocketTransport extends Emitter implements ChatTransport {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private readonly createSocket: SocketFactory;

  constructor(url: string, createSocket: SocketFactory = (u) => new WebSocket(u)) {
    super();
    this.url = url;
    this.createSocket = createSocket;
  }

  connect(): void {
    this.setStatus('connecting');
    const socket = this.createSocket(this.url);
    socket.onopen = () => this.setStatus('online');
    socket.onclose = () => this.setStatus('offline');
    socket.onerror = () => this.emit({ type: 'error', content: 'Se perdió la conexión con el agente.' });
    socket.onmessage = (msg: MessageEvent) => this.handle(msg.data);
    this.socket = socket;
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  send(text: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.emit({ type: 'error', content: 'No hay conexión con el agente. Intenta de nuevo en unos segundos.' });
      return;
    }
    this.socket.send(JSON.stringify({ type: 'message', content: text }));
  }

  private handle(raw: unknown): void {
    try {
      const event = JSON.parse(String(raw)) as AgentEvent;
      this.emit(event);
    } catch {
      // Si el servidor manda texto plano, se trata como markdown directo.
      this.emit({ type: 'message', content: String(raw) });
    }
  }
}
