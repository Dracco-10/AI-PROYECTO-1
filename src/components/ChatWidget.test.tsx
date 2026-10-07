import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWidget } from './ChatWidget';
import { FakeTransport } from '../test/FakeTransport';

describe('ChatWidget', () => {
  it('abre y cierra el panel con el launcher', async () => {
    const user = userEvent.setup();
    render(<ChatWidget transport={new FakeTransport()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Abrir chat' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ocultar chat' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('se cierra con el botón del encabezado', async () => {
    const user = userEvent.setup();
    render(<ChatWidget transport={new FakeTransport()} defaultOpen />);
    await user.click(screen.getByRole('button', { name: 'Cerrar chat' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('envía con Enter y renderiza la respuesta en markdown', async () => {
    const user = userEvent.setup();
    const t = new FakeTransport();
    render(<ChatWidget transport={t} defaultOpen title="Soporte" />);
    expect(screen.getByRole('heading', { name: 'Soporte' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Escribe tu mensaje'), 'hola{Enter}');
    expect(t.sent).toEqual(['hola']);
    expect(screen.getByText('hola')).toBeInTheDocument();

    act(() => t.push({ type: 'typing' }));
    expect(screen.getByTestId('typing')).toBeInTheDocument();

    act(() =>
      t.push({
        type: 'message',
        content: '**negrita**\n\n- uno\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n`code` [link](https://x.com)',
      }),
    );
    expect(screen.queryByTestId('typing')).not.toBeInTheDocument();
    expect(screen.getByText('negrita').tagName).toBe('STRONG');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('code').tagName).toBe('CODE');
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('target', '_blank');
  });

  it('Shift+Enter no envía y el botón envía', async () => {
    const user = userEvent.setup();
    const t = new FakeTransport();
    render(<ChatWidget transport={t} defaultOpen />);
    const box = screen.getByLabelText('Escribe tu mensaje');
    await user.type(box, 'linea{Shift>}{Enter}{/Shift}');
    expect(t.sent).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }));
    expect(t.sent).toEqual(['linea']);
  });

  it('el botón de enviar está deshabilitado sin texto', () => {
    render(<ChatWidget transport={new FakeTransport()} defaultOpen />);
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled();
  });

  it('deshabilita la entrada cuando no hay conexión y muestra el estado', () => {
    const t = new FakeTransport(false);
    render(<ChatWidget transport={t} defaultOpen />);
    expect(screen.getByLabelText('Escribe tu mensaje')).toBeDisabled();
    expect(screen.getByTestId('status')).toHaveTextContent('Sin conexión');
    act(() => t.status('connecting'));
    expect(screen.getByTestId('status')).toHaveTextContent('Conectando');
  });

  it('muestra errores como mensajes del sistema', () => {
    const t = new FakeTransport();
    render(<ChatWidget transport={t} defaultOpen />);
    act(() => t.push({ type: 'error', content: 'Sin conexión con el agente' }));
    expect(screen.getByTestId('msg-system')).toHaveTextContent('Sin conexión con el agente');
  });

  it('limpia la conversación y muestra el estado vacío', async () => {
    const user = userEvent.setup();
    render(<ChatWidget transport={new FakeTransport()} defaultOpen greeting="Hola" />);
    await user.click(screen.getByRole('button', { name: 'Limpiar conversación' }));
    expect(screen.getByText(/La conversación está vacía/)).toBeInTheDocument();
  });

  it('acepta color y posición personalizados', () => {
    const { container } = render(
      <ChatWidget transport={new FakeTransport()} accentColor="#ff0000" position="bottom-left" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('agc-root--bottom-left');
    expect(root.style.getPropertyValue('--agc-accent')).toBe('#ff0000');
  });

  it('usa el MockTransport si no se pasa transporte', async () => {
    vi.useFakeTimers();
    render(<ChatWidget defaultOpen />);
    expect(screen.getByTestId('status')).toHaveTextContent('Conectando');
    await act(async () => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.getByTestId('status')).toHaveTextContent('En línea');
    vi.useRealTimers();
  });
});
