import React from 'react';
import { useRuns } from '../context/RunContext';
import { Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { activeTab, stats, setActiveTab } = useRuns();

  const titles = {
    overview: '1. Overview Dashboard',
    chat: '2. AI Chat (Glass Box Mode)',
    traces: '3. Execution Traces',
    context: '4. Context Window Manager',
    failures: '5. Failure Detection & Records'
  };

  return (
    <header className="top-navbar">
      <div className="nav-page-title">
        <Activity size={18} style={{ color: '#38bdf8' }} />
        <span>{titles[activeTab] || 'Dashboard'}</span>
      </div>

      <div className="nav-actions">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <ShieldCheck size={14} style={{ color: '#34d399' }} />
          <span>Total Runs: <strong style={{ color: '#fff' }}>{stats.totalRuns}</strong></span>
        </div>

        {activeTab !== 'chat' && (
          <button 
            className="btn btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={() => setActiveTab('chat')}
          >
            <Sparkles size={14} />
            <span>Open AI Chat</span>
          </button>
        )}
      </div>
    </header>
  );
}
