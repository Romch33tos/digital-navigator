import { useState, useEffect, useRef } from 'react';

const METRIKA_ID = 114360014;

function trackEvent(action, params = {}) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Metrika] Отправка цели: ${action}`, params);
  }
  
  if (typeof window !== 'undefined' && typeof window.ym === 'function') {
    try {
      window.ym(METRIKA_ID, 'reachGoal', action, params);
    } catch (e) {
      console.warn('[Metrika] Ошибка при отправке:', e);
    }
  } else {
   
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Metrika] window.ym не найден. Возможно, скрипт Яндекс.Метрики не загружен.');
    }
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chatbot_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('chatbot_history', JSON.stringify(messages.slice(-50)));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading, isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    const handler = () => {
      setIsOpen(true);
      trackEvent('CHAT_OPEN_FROM_FAQ');
    };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  const handleToggle = () => {
    if (!isOpen) trackEvent('CHAT_OPEN');
    setIsOpen((v) => !v);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    trackEvent('CHAT_MESSAGE_SENT');

    const userMsg = { role: 'user', text: input };
    const currentHistory = [...messages, userMsg];
    
    setMessages(currentHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input,
          history: currentHistory.slice(-6) 
        }),
      });
      const data = await res.json();
      const answer = data.answer || 'Не удалось получить ответ.';
      
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
      
      if (/не нашёл|не нашел|не знаю|нет информации/i.test(answer)) {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: 'Можете также посмотреть раздел FAQ — там собраны частые вопросы.', isHint: true },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Ошибка соединения с сервером. Проверьте, запущен ли server.js' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem('chatbot_history');
    } catch {}
    trackEvent('CHAT_CLEAR_HISTORY');
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      <button
        onClick={handleToggle}
        aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
        style={{
          borderRadius: '50%',
          width: 60,
          height: 60,
          background: 'var(--accent)',
          color: 'var(--surface)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(45,127,249,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div
          style={{
            width: 340,
            height: 480,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            bottom: 70,
            right: 0,
            boxShadow: '0 4px 12px rgba(45,127,249,0.15)',
            overflow: 'hidden',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--accent)',
              color: 'var(--surface)',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Помощник студента</span>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                title="Очистить историю"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--surface)',
                  cursor: 'pointer',
                  fontSize: 14,
                  opacity: 0.85,
                }}
              >
                Очистить
              </button>
            )}
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'var(--bg)',
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: 'var(--text-weak)', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                Задайте вопрос, например: «Как закрыть долг?» или «Где найти дирекцию?»
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background:
                    m.role === 'user'
                      ? 'var(--accent)'
                      : m.isHint
                      ? 'rgba(14,165,164,0.12)'
                      : 'var(--surface)',
                  color: m.role === 'user' ? 'var(--surface)' : 'var(--text)',
                  border: m.role === 'bot' && !m.isHint ? '1px solid var(--border)' : 'none',
                  padding: '8px 12px',
                  borderRadius: 12,
                  maxWidth: '80%',
                  fontSize: 14,
                  lineHeight: 1.4,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.isHint ? (
                  <>
                    {m.text}{' '}
                    <a href="/faq" style={{ color: 'var(--teal)', fontWeight: 600 }}>
                      Перейти в FAQ
                    </a>
                  </>
                ) : (
                  m.text
                )}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: 13, color: 'var(--text-weak)', fontStyle: 'italic' }}>Печатает...</div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              padding: 10,
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              alignItems: 'flex-end',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ваш вопрос..."
              rows={1}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--border)',
                borderRadius: 8,
                marginRight: 8,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'none',
                minHeight: 38,
                maxHeight: 120,
                overflowY: 'auto',
                lineHeight: 1.4,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: loading ? 'var(--text-weak)' : 'var(--accent)',
                color: 'var(--surface)',
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'default' : 'pointer',
                fontWeight: 700,
                height: 38,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
