import type { ChatMessage } from '../types/chat';
import { MarkdownContent } from './MarkdownContent';

interface Props {
  message: ChatMessage;
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

export function MessageBubble({ message }: Props) {
  return (
    <li className={`agc-msg agc-msg--${message.role}`} data-testid={`msg-${message.role}`}>
      <div className="agc-bubble">
        {message.role === 'user' ? (
          <p className="agc-plain">{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} />
        )}
      </div>
      <time className="agc-time" dateTime={new Date(message.createdAt).toISOString()}>
        {formatTime(message.createdAt)}
      </time>
    </li>
  );
}
