import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Bot, 
  User,
  Zap,
  Clock,
  Coins
} from 'lucide-react';
import { useRuns } from '../context/RunContext';
import { executeAiRun } from '../services/aiService';

export default function ChatPage() {
  const { chatMessages, setChatMessages, addRun, setSelectedTrace } = useRuns();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentExecutingStep, setCurrentExecutingStep] = useState(null);
  const [simulateFail, setSimulateFail] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSend = async (customPrompt = null, forceFail = false) => {
    const promptToSend = (typeof customPrompt === 'string' ? customPrompt : inputText).trim();
    if (!promptToSend || loading) return;

    setInputText('');
    const shouldFail = forceFail || simulateFail;

    // 1. Add user message
    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Live execution animation
    setCurrentExecutingStep('1. Receiving user question...');
    setTimeout(() => {
      setCurrentExecutingStep('2. Searching context memory...');
    }, 200);
    setTimeout(() => {
      setCurrentExecutingStep(shouldFail ? '3. Upstream AI inference (Failing)...' : '3. Synthesizing transparent response...');
    }, 450);

    try {
      // 2. Execute AI run & trace
      const runResult = await executeAiRun(promptToSend, chatMessages, shouldFail);
      
      // 3. Save run into central RunContext store
      const savedRun = addRun(runResult);

      // 4. Add assistant message
      const assistantMsg = {
        id: `msg-${Date.now()}-a`,
        sender: 'assistant',
        text: savedRun.answer,
        timestamp: savedRun.timestamp,
        runId: savedRun.id,
        runNumber: savedRun.runNumber,
        status: savedRun.status,
        tokens: savedRun.tokens,
        cost: savedRun.cost,
        duration: savedRun.duration,
        fullRun: savedRun
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setCurrentExecutingStep(null);
    }
  };

  const quickPrompts = [
    { text: "Explain what RAG is.", label: "RAG Explained" },
    { text: "How does Glass Box AI make systems transparent?", label: "Glass Box AI" },
    { text: "How are tokens and estimated costs computed?", label: "Token & Cost Pricing" },
    { text: "Simulate a model timeout error", label: "Simulate Error ⚠️", isFail: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner with Quick Test Prompts */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
              Quick Test Questions:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                className={q.isFail ? "btn btn-danger" : "btn btn-secondary"}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => handleSend(q.text, q.isFail)}
                disabled={loading}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="chat-avatar assistant" style={{ width: '32px', height: '32px' }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                Glass Box Transparent Assistant
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="status-dot" style={{ width: '6px', height: '6px' }} />
                Every question automatically logs a Run & Trace
              </div>
            </div>
          </div>

          {/* Simulate Failure Toggle */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: simulateFail ? '#fb7185' : '#94a3b8',
            cursor: 'pointer',
            padding: '4px 10px',
            background: simulateFail ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: simulateFail ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)',
            borderRadius: '8px'
          }}>
            <input 
              type="checkbox" 
              checked={simulateFail} 
              onChange={(e) => setSimulateFail(e.target.checked)}
              style={{ accentColor: '#f43f5e' }}
            />
            <AlertTriangle size={14} />
            <span>Simulate Failure on Next Send</span>
          </label>
        </div>

        {/* Messages Scroll Area */}
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Bot size={48} style={{ color: '#334155' }} />
              <p style={{ fontSize: '0.95rem' }}>Ask any question to generate a response and see its Glass Box trace.</p>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                  <div className={`chat-avatar ${msg.sender}`}>
                    {isUser ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div className={`chat-bubble ${msg.sender}`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

                    {/* If assistant, display the Glass Box Run Details Bar */}
                    {!isUser && msg.runId && (
                      <div className="chat-trace-pill">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="run-id-tag">Run #{msg.runNumber || msg.runId}</span>
                          {msg.tokens && (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Zap size={11} style={{ color: '#a855f7' }} />
                              {msg.tokens} tokens
                            </span>
                          )}
                          {msg.cost && (
                            <span style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Coins size={11} />
                              {msg.cost}
                            </span>
                          )}
                          {msg.duration && (
                            <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Clock size={11} />
                              {msg.duration}
                            </span>
                          )}
                        </div>

                        <button 
                          className="btn btn-outline"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          onClick={() => {
                            if (msg.fullRun) {
                              setSelectedTrace(msg.fullRun);
                            }
                          }}
                        >
                          <Eye size={12} />
                          Inspect Trace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Loading / Live Step Visualizer */}
          {loading && (
            <div className="chat-message-row assistant">
              <div className="chat-avatar assistant">
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <div className="chat-bubble assistant" style={{ border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '0.88rem' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>{currentExecutingStep || 'Processing query transparently...'}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                  Recording telemetry & creating step trace in real time...
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-area">
          <form 
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Enter a question (e.g., 'Explain what RAG is')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !inputText.trim()}
              style={{ padding: '12px 20px' }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Send size={16} />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
