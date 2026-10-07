import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';
import './styles/demo.css';

function DemoPage() {
  return (
    <main className="demo">
      <h1>AGIChat</h1>
      <p>
        Esta página es un sitio cualquiera de un cliente. El widget vive en la esquina inferior y se
        integra con una sola línea de código.
      </p>
      <pre>
        <code>{`mountAgiChat(document.getElementById('chat'), { title: 'Soporte' });`}</code>
      </pre>
      <p>Prueba escribir «hola», «muéstrame código» o «tabla de precios».</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoPage />
    <ChatWidget defaultOpen />
  </StrictMode>,
);
