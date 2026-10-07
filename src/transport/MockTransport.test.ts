import { MockTransport } from './MockTransport';
import { buildMockReply } from './mockResponses';
import type { AgentEvent, ConnectionStatus } from '../types/chat';

describe('MockTransport', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('pasa de connecting a online', () => {
    const t = new MockTransport({ connectDelay: 100 });
    const statuses: ConnectionStatus[] = [];
    t.onStatus((s) => statuses.push(s));
    t.connect();
    vi.advanceTimersByTime(100);
    expect(statuses).toEqual(['connecting', 'online']);
  });

  it('emite typing y luego la respuesta', () => {
    const t = new MockTransport({ connectDelay: 0, replyDelay: 50, reply: (i) => `eco: ${i}` });
    const events: AgentEvent[] = [];
    t.onEvent((e) => events.push(e));
    t.connect();
    vi.advanceTimersByTime(0);
    t.send('hola');
    expect(events[0]).toEqual({ type: 'typing' });
    vi.advanceTimersByTime(50);
    expect(events[1]).toEqual({ type: 'message', content: 'eco: hola' });
  });

  it('emite error si se envía sin conexión', () => {
    const t = new MockTransport();
    const events: AgentEvent[] = [];
    t.onEvent((e) => events.push(e));
    t.send('hola');
    expect(events[0].type).toBe('error');
  });

  it('al desconectar cancela respuestas pendientes y queda offline', () => {
    const t = new MockTransport({ connectDelay: 0, replyDelay: 100 });
    const events: AgentEvent[] = [];
    const statuses: ConnectionStatus[] = [];
    t.onEvent((e) => events.push(e));
    t.onStatus((s) => statuses.push(s));
    t.connect();
    vi.advanceTimersByTime(0);
    t.send('hola');
    t.disconnect();
    vi.advanceTimersByTime(200);
    expect(events).toEqual([{ type: 'typing' }]);
    expect(statuses.at(-1)).toBe('offline');
  });

  it('permite dejar de escuchar', () => {
    const t = new MockTransport({ connectDelay: 0 });
    const listener = vi.fn();
    const off = t.onStatus(listener);
    off();
    t.connect();
    vi.advanceTimersByTime(0);
    expect(listener).not.toHaveBeenCalled();
  });

  it('usa valores por defecto', () => {
    const t = new MockTransport();
    const events: AgentEvent[] = [];
    t.onEvent((e) => events.push(e));
    t.connect();
    vi.advanceTimersByTime(300);
    t.send('hola');
    vi.advanceTimersByTime(900);
    expect(events[1].content).toContain('agente de AGIChat');
  });
});

describe('buildMockReply', () => {
  it.each([
    ['hola', 'agente de AGIChat'],
    ['muéstrame un ejemplo de código', '```ts'],
    ['tabla de precios', '| Plan |'],
    ['otra cosa', 'endpoint simulado'],
  ])('para "%s" responde markdown con "%s"', (input, expected) => {
    expect(buildMockReply(input)).toContain(expected);
  });
});
