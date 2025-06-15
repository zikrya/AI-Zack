'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ userInput: input }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const botMessage = { role: 'assistant', content: data.message };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Talk to AI Zikrya</h1>

      <div className="border rounded p-4 h-[400px] overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-black'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Zikrya'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div>Zikrya is typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </main>
  );
}
