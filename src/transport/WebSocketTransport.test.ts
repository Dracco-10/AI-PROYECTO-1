import { WebSocketTransport } from './WebSocketTransport';
import type { AgentEvent, ConnectionStatus } from '../types/chat';

class FakeSocket {
  readyState = 0;
  sent: string[] = [];
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((m: { data: unknown }) => void) | null = null;
  send(data: string) {
    this.sent.push(data);
  }
  close() {
    this.readyState = 3;
    this.onclose?.();
  }
  open() {
    this.readyState = WebSocket.OPEN;
    this.onopen?.();
  }
}

function setup() {
  const socket = new FakeSocket();
  const t = new WebSocketTransport('ws://test', () => socket as unknown as WebSocket);
  const events: AgentEvent[] = [];
  const statuses: ConnectionStatus[] = [];
  t.onEvent((e) => events.push(e));
  t.onStatus((s) => statuses.push(s));
  return { socket, t, events, statuses };
}

describe('WebSocketTransport', () => {
  it('reporta los estados de conexión', () => {
    const { socket, t, statuses } = setup();
    t.connect();
    socket.open();
    t.disconnect();
    expect(statuses).toEqual(['connecting', 'online', 'offline']);
  });

  it('envía mensajes como JSON cuando está abierto', () => {
    const { socket, t } = setup();
    t.connect();
    socket.open();
    t.send('hola');
    expect(JSON.parse(socket.sent[0])).toEqual({ type: 'message', content: 'hola' });
  });

  it('emite error si el socket no está abierto', () => {
    const { t, events } = setup();
    t.send('hola');
    expect(events[0].type).toBe('error');
  });

  it('parsea eventos JSON y acepta texto plano', () => {
    const { socket, t, events } = setup();
    t.connect();
    socket.onmessage?.({ data: JSON.stringify({ type: 'message', content: '**hola**' }) });
    socket.onmessage?.({ data: 'texto plano' });
    expect(events).toEqual([
      { type: 'message', content: '**hola**' },
      { type: 'message', content: 'texto plano' },
    ]);
  });

  it('emite error cuando el socket falla', () => {
    const { socket, t, events } = setup();
    t.connect();
    socket.onerror?.();
    expect(events[0].type).toBe('error');
  });

  it('usa WebSocket nativo por defecto', () => {
    const ctor = vi.fn(function () {
      return new FakeSocket();
    });
    vi.stubGlobal('WebSocket', Object.assign(ctor, { OPEN: 1 }));
    const t = new WebSocketTransport('ws://default');
    t.connect();
    expect(ctor).toHaveBeenCalledWith('ws://default');
    vi.unstubAllGlobals();
  });
});
