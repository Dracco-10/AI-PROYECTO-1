# AGENTS.md

Guía para herramientas de codeo agéntico (Claude Code, Copilot, Cursor, Codex, etc.) que trabajen en este repositorio. Léela completa antes de generar código.

## Contexto del proyecto

AGIChat Widget es un SDK de React + TypeScript que se embebe en sitios de terceros. Hoy responde un endpoint simulado (`MockTransport`); en la fase 2 se conectará un agente real a través de `WebSocketTransport` u otro adaptador.

## Comandos

- Instalar: `npm install`
- Demo local: `npm run dev`
- Lint: `npm run lint`
- Tipos: `npm run typecheck`
- Pruebas con coverage: `npm run coverage`
- Build: `npm run build`

Antes de dar una tarea por terminada, `npm run lint`, `npm run typecheck` y `npm run coverage` deben pasar sin errores.

## Reglas de arquitectura

1. La UI (`src/components`) nunca hace `fetch` ni abre sockets. Toda comunicación pasa por la interfaz `ChatTransport` en `src/transport/ChatTransport.ts`.
2. Un nuevo origen de respuestas se agrega como adaptador nuevo en `src/transport/`, extendiendo `Emitter` e implementando `ChatTransport`.
3. El estado del chat vive en `src/hooks/useChat.ts`. Los componentes reciben datos por props.
4. Los tipos compartidos van en `src/types/`.
5. Todo lo que deban usar los clientes se exporta desde `src/index.ts`; si no está ahí, es interno.
6. Los mensajes del agente siempre se renderizan como markdown con `MarkdownContent`. No usar `dangerouslySetInnerHTML` ni `rehype-raw`.

## Estilo de código

- TypeScript estricto, sin `any`. El proyecto usa `erasableSyntaxOnly`, así que no se permiten `enum` ni propiedades declaradas en el constructor (`constructor(private x: string)`); se declaran como campos de la clase.
- Importar tipos con `import type` (`verbatimModuleSyntax` está activo).
- Componentes funcionales con exportación nombrada, un componente por archivo, en PascalCase.
- Clases CSS con prefijo `agc-` en `src/styles/widget.css` para no chocar con el sitio anfitrión. Los colores se definen como variables `--agc-*`.
- Textos visibles al usuario en español.
- Accesibilidad: todo botón con ícono lleva `aria-label`.

## Pruebas

- Vitest + Testing Library, archivo `*.test.ts(x)` junto al archivo que prueba.
- Para probar componentes usar `FakeTransport` de `src/test/FakeTransport.ts` en lugar de timers reales.
- El coverage mínimo es 80% en líneas, funciones, ramas y sentencias; el CI falla si baja.
- Buscar elementos por rol o label (`getByRole`, `getByLabelText`), no por clases CSS.

## Flujo de trabajo (GitHub Flow)

- Nunca hacer commit directo a `main`.
- Rama por cambio: `feature/<descripcion>`, `fix/<descripcion>`, `docs/<descripcion>`.
- Mensajes de commit con Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `ci:`.
- Abrir Pull Request hacia `main` llenando la plantilla; requiere aprobación de otro integrante y CI en verde.

## Ejemplo: agregar un transporte nuevo

```ts
import type { ChatTransport } from './ChatTransport';
import { Emitter } from './Emitter';

export class HttpTransport extends Emitter implements ChatTransport {
  private readonly endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }
  connect() {
    this.setStatus('online');
  }
  disconnect() {
    this.setStatus('offline');
  }
  async send(text: string) {
    this.emit({ type: 'typing' });
    const res = await fetch(this.endpoint, { method: 'POST', body: JSON.stringify({ text }) });
    const data = await res.json();
    this.emit({ type: 'message', content: data.reply });
  }
}
```

Acompañarlo siempre de su archivo `HttpTransport.test.ts` y exportarlo desde `src/index.ts`.
