import type { AgentEvent, AgentListener, ConnectionStatus, StatusListener } from '../types/chat';

/** Base común para los transportes: manejo de suscriptores. */
export abstract class Emitter {
  private eventListeners = new Set<AgentListener>();
  private statusListeners = new Set<StatusListener>();

  onEvent(listener: AgentListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  protected emit(event: AgentEvent): void {
    this.eventListeners.forEach((l) => l(event));
  }

  protected setStatus(status: ConnectionStatus): void {
    this.statusListeners.forEach((l) => l(status));
  }
}
