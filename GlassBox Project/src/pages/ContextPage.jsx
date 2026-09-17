import React, { useState } from 'react';
import { useRuns } from '../context/RunContext';
import { 
  Layers, 
  ArrowDown, 
  Bot, 
  MessageSquare, 
  Filter, 
  Sparkles, 
  Database, 
  Check, 
  X,
  Sliders,
  Cpu
} from 'lucide-react';

export default function ContextPage() {
  const { chatMessages } = useRuns();
  const [contextWindowSize, setContextWindowSize] = useState(6);

  // Sample conversation history messages for demonstration
  const sampleMessages = [
    { id: 1, sender: 'User', text: 'Hi, I need help understanding LLMs.' },
    { id: 2, sender: 'AI', text: 'Hello! I can explain large language models.' },
    { id: 3, sender: 'User', text: 'What is deep learning?' },
    { id: 4, sender: 'AI', text: 'Deep learning is a subset of machine learning using neural networks.' },
    { id: 5, sender: 'User', text: 'Can you show me Python code for that?' },
    { id: 6, sender: 'AI', text: 'Sure! Here is a simple PyTorch neural network example.' },
    { id: 7, sender: 'User', text: 'How does attention mechanism work?' },
    { id: 8, sender: 'AI', text: 'Attention allows models to dynamically weight important input tokens.' },
    { id: 9, sender: 'User', text: 'Explain what RAG is.' },
    { id: 10, sender: 'AI', text: 'RAG stands for Retrieval-Augmented Generation...' }
  ];

  const totalCount = sampleMessages.length; // 10
  const relevantCount = Math.min(contextWindowSize, totalCount); // 6
  const removedCount = totalCount - relevantCount; // 4
  const contextSent = `${relevantCount} messages`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          4. Context Window & History Management
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '2px' }}>
          Demonstrates how Glass Box AI manages conversation history to prevent token overflow and reduce inference costs.
        </p>
      </div>

      {/* Required 4 Metrics Display */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Conversation Messages</span>
            <div className="metric-icon-wrap" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)' }}>
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="metric-value">{totalCount}</div>
          <div className="metric-subtext">Total history depth</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Relevant Messages</span>
            <div className="metric-icon-wrap" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
              <Check size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#34d399' }}>{relevantCount}</div>
          <div className="metric-subtext">Retained within window</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Messages Removed</span>
            <div className="metric-icon-wrap" style={{ color: '#fb7185', background: 'rgba(251, 113, 133, 0.1)' }}>
              <X size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ color: '#fb7185' }}>{removedCount}</div>
          <div className="metric-subtext">Pruned to save tokens</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Context Sent to AI</span>
            <div className="metric-icon-wrap" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.45rem', color: '#c084fc' }}>{contextSent}</div>
          <div className="metric-subtext">Active payload window</div>
        </div>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Layers size={18} style={{ color: '#38bdf8' }} />
            <span>Context Pipeline Architecture</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Transparent Token Flow
          </div>
        </div>

        <div className="card-body">
          <div className="pipeline-flow">
            {/* Step 1 */}
            <div className="pipeline-node active">
              <div className="pipeline-node-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)' }}>
                <Database size={20} />
              </div>
              <div className="pipeline-node-title">Conversation History</div>
              <div className="pipeline-node-subtitle">10 Total Messages</div>
            </div>

            <ArrowDown className="pipeline-arrow" style={{ transform: 'rotate(-90deg)' }} />

            {/* Step 2 */}
            <div className="pipeline-node active">
              <div className="pipeline-node-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)' }}>
                <Filter size={20} />
              </div>
              <div className="pipeline-node-title">Context Manager</div>
              <div className="pipeline-node-subtitle">Sliding Window Pruning</div>
            </div>

            <ArrowDown className="pipeline-arrow" style={{ transform: 'rotate(-90deg)' }} />

            {/* Step 3 */}
            <div className="pipeline-node active">
              <div className="pipeline-node-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.15)' }}>
                <Layers size={20} />
              </div>
              <div className="pipeline-node-title">Relevant Context</div>
              <div className="pipeline-node-subtitle">6 Retained Messages</div>
            </div>

            <ArrowDown className="pipeline-arrow" style={{ transform: 'rotate(-90deg)' }} />

            {/* Step 4 */}
            <div className="pipeline-node active">
              <div className="pipeline-node-icon" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)' }}>
                <Bot size={20} />
              </div>
              <div className="pipeline-node-title">AI Model Prompt</div>
              <div className="pipeline-node-subtitle">Optimized Token Payload</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '0.86rem',
            color: '#94a3b8',
            lineHeight: 1.6
          }}>
            <strong style={{ color: '#f8fafc' }}>How this works:</strong> Glass Box AI tracks raw chat history (10 messages), passes it through the transparent Context Manager which preserves the most recent 6 messages and prunes 4 older messages. This keeps inference fast and costs low while maintaining immediate conversational context.
          </div>
        </div>
      </div>

      {/* Live Breakdown Table of Messages */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <Sliders size={18} style={{ color: '#f59e0b' }} />
            <span>Message Breakdown (Recent vs Pruned)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Context Window Size:</span>
            <select 
              value={contextWindowSize} 
              onChange={(e) => setContextWindowSize(Number(e.target.value))}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            >
              <option value={4}>4 Messages</option>
              <option value={6}>6 Messages (Default)</option>
              <option value={8}>8 Messages</option>
              <option value={10}>10 Messages</option>
            </select>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sender</th>
                <th>Message Snippet</th>
                <th>Context Status</th>
                <th>Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {sampleMessages.map((m, idx) => {
                const isIncluded = idx >= totalCount - relevantCount;
                return (
                  <tr key={m.id} style={{ opacity: isIncluded ? 1 : 0.45 }}>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>#{m.id}</td>
                    <td style={{ fontWeight: 600, color: m.sender === 'User' ? '#60a5fa' : '#34d399' }}>
                      {m.sender}
                    </td>
                    <td style={{ color: '#e2e8f0' }}>{m.text}</td>
                    <td>
                      {isIncluded ? (
                        <span className="status-badge success">
                          <Check size={11} />
                          Included in Context
                        </span>
                      ) : (
                        <span className="status-badge failure" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)' }}>
                          <X size={11} />
                          Pruned / Removed
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: isIncluded ? '#38bdf8' : '#64748b' }}>
                      {isIncluded ? 'Dispatched to AI model' : 'Excluded to minimize tokens'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
