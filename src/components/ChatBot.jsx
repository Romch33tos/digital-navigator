import { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Ошибка соединения с сервером. Проверьте, запущен ли server.js' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ borderRadius: '50%', width: 60, height: 60, background: '#1b61c9', color: 'white', border: 'none', cursor: 'pointer', fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        💬
      </button>
      
      {isOpen && (
        <div style={{ width: 320, height: 400, background: 'white', border: '1px solid #ccc', borderRadius: 8, display: 'flex', flexDirection: 'column', position: 'absolute', bottom: 70, right: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <div style={{ padding: 12, background: '#1b61c9', color: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontWeight: 'bold' }}>
            Помощник студента
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ color: '#888', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
                Задайте вопрос, например: "Как закрыть долг?" или "Где найти дирекцию?"
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? '#e3f2fd' : '#f1f1f1', padding: '8px 12px', borderRadius: 12, maxWidth: '80%', fontSize: 14 }}>
                {m.text}
              </div>
            ))}
            {loading && <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>Печатает...</div>}
          </div>

          <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #eee' }}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ваш вопрос..." 
              style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 4, marginRight: 8, fontSize: 14, outline: 'none' }}
            />
            <button onClick={sendMessage} style={{ padding: '8px 16px', background: '#1b61c9', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}