import type { ChatTransport } from '../transport/ChatTransport';
import { Emitter } from '../transport/Emitter';
import type { AgentEvent, ConnectionStatus } from '../types/chat';

/** Transporte controlable a mano para las pruebas de UI. */
export class FakeTransport extends Emitter implements ChatTransport {
  sent: string[] = [];
  connected = false;
  private readonly autoOnline: boolean;
  constructor(autoOnline = true) {
    super();
    this.autoOnline = autoOnline;
  }
  connect() {
    this.connected = true;
    if (this.autoOnline) this.setStatus('online');
  }
  disconnect() {
    this.connected = false;
  }
  send(text: string) {
    this.sent.push(text);
  }
  push(event: AgentEvent) {
    this.emit(event);
  }
  status(s: ConnectionStatus) {
    this.setStatus(s);
  }
}
