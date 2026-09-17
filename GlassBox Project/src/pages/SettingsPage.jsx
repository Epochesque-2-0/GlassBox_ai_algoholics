import React, { useState } from 'react';
import { useRuns } from '../context/RunContext';
import { RotateCcw, Check } from 'lucide-react';

export default function SettingsPage() {
  const { resetData } = useRuns();
  const [tracingLevel, setTracingLevel] = useState('verbose');
  const [defaultModel, setDefaultModel] = useState('gpt-4o-mini');
  const [contextWindow, setContextWindow] = useState('6');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Settings & Configuration</h1>
        <p className="page-description">
          Configure runtime instrumentation, trace capture depth, and model routing.
        </p>
      </div>

      {/* Tracing Configuration */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
            Trace Telemetry Depth
          </label>
          <select 
            className="clean-select" 
            style={{ width: '100%' }}
            value={tracingLevel}
            onChange={(e) => setTracingLevel(e.target.value)}
          >
            <option value="verbose">Verbose — Capture full prompt, tool payloads, model outputs, and step latencies</option>
            <option value="standard">Standard — Capture steps, tool names, token counts, and error payloads</option>
            <option value="minimal">Minimal — Record only final latency and run status</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
            Default Model Engine
          </label>
          <select 
            className="clean-select" 
            style={{ width: '100%' }}
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
          >
            <option value="gpt-4o-mini">gpt-4o-mini (Default Fast)</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro (Research)</option>
            <option value="claude-3-5-sonnet">claude-3-5-sonnet (Analysis)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
            Context Window Memory Retention
          </label>
          <select 
            className="clean-select" 
            style={{ width: '100%' }}
            value={contextWindow}
            onChange={(e) => setContextWindow(e.target.value)}
          >
            <option value="4">4 recent messages (Optimized for token cost)</option>
            <option value="6">6 recent messages (Balanced)</option>
            <option value="10">10 recent messages (Extended memory)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-clean primary" onClick={handleSave}>
            {saved ? <Check size={14} /> : null}
            <span>{saved ? 'Saved Preferences' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Danger / Reset Zone */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>Reset Telemetry Data</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
            Reset all runs and metrics back to initial demo seeds.
          </div>
        </div>

        <button 
          className="btn-clean"
          style={{ color: '#b91c1c', borderColor: '#fecaca' }}
          onClick={resetData}
        >
          <RotateCcw size={13} />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
}
