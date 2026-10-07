import { act, screen } from '@testing-library/react';
import { mountAgiChat, ChatWidget, MockTransport, WebSocketTransport } from './index';

describe('API pública del SDK', () => {
  it('exporta los componentes y transportes', () => {
    expect(ChatWidget).toBeTypeOf('function');
    expect(MockTransport).toBeTypeOf('function');
    expect(WebSocketTransport).toBeTypeOf('function');
  });

  it('mountAgiChat monta el widget en un contenedor', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let root!: ReturnType<typeof mountAgiChat>;
    act(() => {
      root = mountAgiChat(el, { title: 'Montado', defaultOpen: true });
    });
    expect(screen.getByRole('heading', { name: 'Montado' })).toBeInTheDocument();
    act(() => root.unmount());
  });

  it('mountAgiChat funciona sin opciones', () => {
    const el = document.createElement('div');
    let root!: ReturnType<typeof mountAgiChat>;
    act(() => {
      root = mountAgiChat(el);
    });
    expect(el.querySelector('.agc-launcher')).not.toBeNull();
    act(() => root.unmount());
  });
});
