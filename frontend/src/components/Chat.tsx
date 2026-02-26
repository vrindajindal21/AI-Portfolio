import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = { role: 'user' | 'assistant'; text: string; timestamp: Date };

const SUGGESTED_QUESTIONS = [
  { label: "🎓 Education", query: "Tell me about her education history", hint: "BCA AI (8.82 CGPA)" },
  { label: "🤖 AI Projects", query: "Show me all her build projects", hint: "10+ (YOLO, NLP, ML)" },
  { label: "💼 Internships", query: "Seeking internships", hint: "Open for AI/ML roles 2026" },
  { label: "🎭 Hobbies", query: "What does she do for fun?", hint: "Reading & AI Research" },
];

// Minimal markdown renderer (bold, bullet points, numbered lists)
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+\*\*(.*?)\*\*[:–-]?\s*(.*)/);
    if (numMatch) {
      return (
        <div key={i} style={{ marginBottom: '8px', paddingLeft: '4px' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{numMatch[1]}.</span>{' '}
          <strong style={{ color: 'var(--text-main)' }}>{numMatch[2]}</strong>
          {numMatch[3] && <span style={{ color: 'var(--text-muted)' }}>: {numMatch[3]}</span>}
        </div>
      );
    }
    // Bullet list
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.replace(/^[-•]\s+/, '');
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px', paddingLeft: '4px' }}>
          <span style={{ color: 'var(--secondary)', flexShrink: 0 }}>▸</span>
          <span>{renderInlineBold(content)}</span>
        </div>
      );
    }
    // Empty line = spacer
    if (line.trim() === '') return <div key={i} style={{ height: '6px' }} />;
    // Normal line
    return <div key={i} style={{ marginBottom: '2px' }}>{renderInlineBold(line)}</div>;
  });
}

function renderInlineBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: 'var(--accent-light, #a78bfa)' }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hi! I'm Vrinda's AI Portfolio Assistant 🤖\nAsk me about her **AI projects**, **technical skills**, or **internship readiness**.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState('.');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  // Animated loading dots
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: 'user', text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Backend error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply, timestamp: new Date() }]);
    } catch (err) {
      console.error("Chat Connection Error:", err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: "I'm having a bit of trouble connecting to my AI brain right now. Please try again in a moment! (Double-check that the Backend Service is live on Render)",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleReset() {
    setMessages([{
      role: 'assistant',
      text: "Chat reset! Ask me anything about **Vrinda Jindal** — her projects, skills, or career goals.",
      timestamp: new Date()
    }]);
    setInput('');
  }

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      <div className="chat-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`msg ${msg.role}`}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: msg.role === 'user' ? 'var(--accent)' : 'rgba(6,182,212,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {msg.role === 'user'
                    ? <User size={12} color="white" />
                    : <Bot size={12} color="var(--secondary)" />
                  }
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                  {msg.role === 'user' ? 'You' : 'Vrinda AI'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bubble" style={{ lineHeight: '1.6' }}>
                {renderMarkdown(msg.text)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {loading && (
          <motion.div className="msg assistant" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px'
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={12} color="var(--secondary)" />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Vrinda AI</span>
            </div>
            <div className="bubble" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--secondary)', opacity: 0.6 }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thinking{dots}</span>
            </div>
          </motion.div>
        )}

        {/* Suggested Questions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              style={{ padding: '4px 0 8px 0' }}
            >
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="var(--accent)" /> Try asking:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUGGESTED_QUESTIONS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => handleSend(s.query)}
                    disabled={loading}
                    style={{
                      background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)',
                      color: 'var(--text-main)', borderRadius: '16px', padding: '6px 14px',
                      fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', lineHeight: '1.4',
                      textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2px'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget).style.background = 'rgba(139,92,246,0.2)';
                      (e.currentTarget).style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget).style.background = 'rgba(139,92,246,0.08)';
                      (e.currentTarget).style.borderColor = 'rgba(139,92,246,0.25)';
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{s.label}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-light, #a78bfa)', opacity: 0.9 }}>{s.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="composer">
        <button
          onClick={handleReset}
          title="Reset chat"
          style={{
            width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--glass-border)',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
          }}
          onMouseEnter={e => { (e.currentTarget).style.color = 'var(--accent)'; (e.currentTarget).style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { (e.currentTarget).style.color = 'var(--text-muted)'; (e.currentTarget).style.borderColor = 'var(--glass-border)'; }}
        >
          <RotateCcw size={15} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about Vrinda..."
          disabled={loading}
        />
        <motion.button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          whileHover={!loading && input.trim() ? { scale: 1.08 } : {}}
          whileTap={!loading && input.trim() ? { scale: 0.93 } : {}}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </motion.button>
      </div>
    </>
  );
}
