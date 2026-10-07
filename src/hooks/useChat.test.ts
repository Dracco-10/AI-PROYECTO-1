import { act, renderHook } from '@testing-library/react';
import { useChat } from './useChat';
import { FakeTransport } from '../test/FakeTransport';

describe('useChat', () => {
  it('arranca con el saludo y se conecta', () => {
    const t = new FakeTransport();
    const { result } = renderHook(() => useChat(t, 'Hola'));
    expect(result.current.messages[0]).toMatchObject({ role: 'agent', content: 'Hola' });
    expect(result.current.status).toBe('online');
  });

  it('arranca vacío si no hay saludo', () => {
    const { result } = renderHook(() => useChat(new FakeTransport()));
    expect(result.current.messages).toHaveLength(0);
  });

  it('agrega el mensaje del usuario y lo envía', () => {
    const t = new FakeTransport();
    const { result } = renderHook(() => useChat(t));
    act(() => result.current.sendMessage('  hola  '));
    expect(result.current.messages[0]).toMatchObject({ role: 'user', content: 'hola' });
    expect(t.sent).toEqual(['hola']);
  });

  it('ignora mensajes vacíos', () => {
    const t = new FakeTransport();
    const { result } = renderHook(() => useChat(t));
    act(() => result.current.sendMessage('   '));
    expect(t.sent).toHaveLength(0);
  });

  it('maneja typing, respuestas y errores', () => {
    const t = new FakeTransport();
    const { result } = renderHook(() => useChat(t));
    act(() => t.push({ type: 'typing' }));
    expect(result.current.isTyping).toBe(true);
    act(() => t.push({ type: 'message', content: '**ok**' }));
    expect(result.current.isTyping).toBe(false);
    act(() => t.push({ type: 'error', content: 'falló' }));
    act(() => t.push({ type: 'message' }));
    expect(result.current.messages.map((m) => m.role)).toEqual(['agent', 'system', 'agent']);
    expect(result.current.messages[2].content).toBe('');
  });

  it('limpia la conversación y desconecta al desmontar', () => {
    const t = new FakeTransport();
    const { result, unmount } = renderHook(() => useChat(t, 'Hola'));
    act(() => result.current.clear());
    expect(result.current.messages).toHaveLength(0);
    unmount();
    expect(t.connected).toBe(false);
  });
});
