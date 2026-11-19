import { useState, useEffect, useRef } from 'react';

const METRIKA_ID = 114360014;

function trackEvent(action, params = {}) {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(METRIKA_ID, 'reachGoal', action, params);
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

  useEffect(() => {
    try {
      localStorage.setItem('chatbot_history', JSON.stringify(messages.slice(-50)));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen]);

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

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    trackEvent('CHAT_MESSAGE_SENT');

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
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

  const clearHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem('chatbot_history');
    } catch {}
    trackEvent('CHAT_CLEAR_HISTORY');
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
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
        }}
      >
        💬
      </button>

      {isOpen && (
        <div
          style={{
            width: 320,
            height: 420,
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
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ваш вопрос..."
              style={{
                flex: 1,
                padding: 8,
                border: '1px solid var(--border)',
                borderRadius: 8,
                marginRight: 8,
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
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
