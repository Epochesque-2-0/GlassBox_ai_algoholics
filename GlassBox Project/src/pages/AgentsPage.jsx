import React, { useState } from 'react';
import { useRuns } from '../context/RunContext';
import { executeAiRun, AVAILABLE_AGENTS } from '../services/aiService';
import { Bot, Play, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AgentsPage() {
  const { addRun, setSelectedRunId, setActiveTab } = useRuns();
  const [selectedAgentId, setSelectedAgentId] = useState('assistant');
  const [prompt, setPrompt] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveCompletedRun, setLiveCompletedRun] = useState(null);

  const handleExecute = async (customText = null, forceFail = false) => {
    const textToRun = (typeof customText === 'string' ? customText : prompt).trim();
    if (!textToRun || loading) return;

    setLoading(true);
    setLiveCompletedRun(null);

    try {
      const result = await executeAiRun(textToRun, [], forceFail || simulateFailure, selectedAgentId);
      const saved = addRun(result);
      setLiveCompletedRun(saved);
      setPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    { text: "Explain what RAG is and why it reduces hallucinations.", agent: 'researcher', label: "RAG Explanation" },
    { text: "Calculate revenue retention across Q1-Q3 customer cohorts.", agent: 'analyst', label: "Data Calculation" },
    { text: "How does GlassBox trace AI execution steps?", agent: 'assistant', label: "GlassBox Telemetry" },
    { text: "Query external payment gateway with expired token", agent: 'analyst', label: "Test Step Failure ⚠️", fail: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Agents & Playground</h1>
        <p className="page-description">
          Execute prompt runs against instrumented agents. Every execution automatically generates a live GlassBox trace.
        </p>
      </div>

      {/* Available Agents Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {AVAILABLE_AGENTS.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bot size={16} style={{ color: isSelected ? 'var(--accent-primary)' : '#64748b' }} />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{agent.name}</span>
                </div>
                <span className="mono-tag" style={{ fontSize: '0.72rem' }}>{agent.model}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                {agent.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Execution Prompt Box */}
      <div className="runner-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
            Enter Prompt for Selected Agent:
          </span>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: simulateFailure ? '#b91c1c' : '#64748b',
            cursor: 'pointer'
          }}>
            <input 
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              style={{ accentColor: '#2563eb' }}
            />
            <span>Simulate Tool Failure & Retry</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: '#94a3b8', alignSelf: 'center' }}>Quick test:</span>
          {samplePrompts.map((q, idx) => (
            <button
              key={idx}
              className="btn-clean"
              style={{ fontSize: '0.74rem', padding: '3px 8px' }}
              onClick={() => {
                setSelectedAgentId(q.agent);
                handleExecute(q.text, q.fail);
              }}
              disabled={loading}
            >
              {q.label}
            </button>
          ))}
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input 
            type="text"
            className="clean-input"
            placeholder="Type your prompt here (e.g., 'Explain what RAG is')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            className="btn-clean accent"
            disabled={loading || !prompt.trim()}
            style={{ padding: '8px 18px' }}
          >
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Tracing...</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Run Agent</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Live Generated Result (if just executed) */}
      {liveCompletedRun && (
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                  Execution Complete:
                </span>
                <span className="mono-tag primary" style={{ marginLeft: '8px' }}>{liveCompletedRun.id}</span>
              </div>
            </div>

            <button 
              className="btn-clean primary"
              style={{ fontSize: '0.78rem' }}
              onClick={() => {
                setSelectedRunId(liveCompletedRun.id);
                setActiveTab('runs');
              }}
            >
              <span>View Full GlassBox Trace</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#334155', background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            {liveCompletedRun.answer}
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            <span>Steps: <strong>{liveCompletedRun.steps.length}</strong></span>
            <span>Duration: <strong>{liveCompletedRun.duration}</strong></span>
            <span>Tokens: <strong>{liveCompletedRun.tokens}</strong></span>
            <span>Cost: <strong>{liveCompletedRun.cost}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
