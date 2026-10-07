import type { ChatTransport } from './ChatTransport';
import { Emitter } from './Emitter';
import { buildMockReply } from './mockResponses';

export interface MockTransportOptions {
  /** Milisegundos que tarda en "conectarse". */
  connectDelay?: number;
  /** Milisegundos que tarda el agente simulado en contestar. */
  replyDelay?: number;
  /** Permite inyectar otra lógica de respuesta (útil en pruebas). */
  reply?: (input: string) => string;
}

/**
 * Simula un endpoint de websockets: se conecta, avisa que el agente está
 * escribiendo y luego envía la respuesta en markdown.
 */
export class MockTransport extends Emitter implements ChatTransport {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private connected = false;
  private readonly connectDelay: number;
  private readonly replyDelay: number;
  private readonly reply: (input: string) => string;

  constructor(options: MockTransportOptions = {}) {
    super();
    this.connectDelay = options.connectDelay ?? 300;
    this.replyDelay = options.replyDelay ?? 900;
    this.reply = options.reply ?? buildMockReply;
  }

  connect(): void {
    this.setStatus('connecting');
    this.schedule(() => {
      this.connected = true;
      this.setStatus('online');
    }, this.connectDelay);
  }

  disconnect(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.connected = false;
    this.setStatus('offline');
  }

  send(text: string): void {
    if (!this.connected) {
      this.emit({ type: 'error', content: 'No hay conexión con el agente. Intenta de nuevo en unos segundos.' });
      return;
    }
    this.emit({ type: 'typing' });
    this.schedule(() => this.emit({ type: 'message', content: this.reply(text) }), this.replyDelay);
  }

  private schedule(fn: () => void, delay: number): void {
    this.timers.push(setTimeout(fn, delay));
  }
}
