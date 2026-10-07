/**
 * Respuestas simuladas del agente. Todas vienen en markdown para demostrar
 * que la interfaz las renderiza correctamente.
 */
export function buildMockReply(input: string): string {
  const text = input.toLowerCase();

  if (/(hola|buenas|hey)/.test(text)) {
    return '¡Hola! Soy el **agente de AGIChat**. Puedo ayudarte con:\n\n- Dudas sobre el producto\n- Ejemplos de código\n- Tablas y listas en *markdown*\n\n¿Qué necesitas?';
  }
  if (/(código|codigo|code|ejemplo)/.test(text)) {
    return 'Así se monta el widget en cualquier página:\n\n```ts\nimport { mountAgiChat } from "agichat-widget";\n\nmountAgiChat(document.getElementById("chat")!, {\n  title: "Soporte",\n});\n```\n\nEl transporte se puede cambiar sin tocar la UI.';
  }
  if (/(tabla|precio|plan)/.test(text)) {
    return '| Plan | Mensajes al mes | Precio |\n| --- | --- | --- |\n| Starter | 1,000 | $0 |\n| Growth | 50,000 | $49 |\n| Scale | Ilimitados | A medida |';
  }
  return `Recibí tu mensaje: _"${input}"_.\n\nPor ahora respondo desde un **endpoint simulado**; en la fase 2 aquí contestará el agente real.`;
}
