import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder: string;
}

export function ChatInput({ onSend, disabled = false, placeholder }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  // Enter envía, Shift+Enter hace salto de línea.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className="agc-input" onSubmit={handleSubmit}>
      <label htmlFor="agc-textarea" className="agc-sr-only">
        Escribe tu mensaje
      </label>
      <textarea
        id="agc-textarea"
        rows={1}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" disabled={disabled || !value.trim()} aria-label="Enviar mensaje">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5Z" fill="currentColor" />
        </svg>
      </button>
    </form>
  );
}
