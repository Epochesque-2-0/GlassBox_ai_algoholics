import React from 'react';
import { useRuns } from '../context/RunContext';
import { Play, RotateCcw } from 'lucide-react';

export default function TopBar() {
  const { activeTab, selectedRunId, setSelectedRunId, setActiveTab, resetData } = useRuns();

  const getBreadcrumb = () => {
    if (selectedRunId) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem' }}>
          <span 
            style={{ color: '#64748b', cursor: 'pointer' }}
            onClick={() => setSelectedRunId(null)}
          >
            Runs
          </span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span className="mono-tag primary">{selectedRunId}</span>
        </div>
      );
    }

    const titles = {
      overview: 'Overview',
      runs: 'Runs',
      agents: 'Agents',
      analytics: 'Analytics',
      settings: 'Settings'
    };

    return <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>{titles[activeTab] || 'Dashboard'}</span>;
  };

  return (
    <header className="top-bar">
      <div>{getBreadcrumb()}</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          className="btn-clean"
          style={{ fontSize: '0.78rem', padding: '4px 8px' }}
          onClick={resetData}
          title="Reset sample telemetry"
        >
          <RotateCcw size={13} />
          <span>Reset Data</span>
        </button>

        <button 
          className="btn-clean primary"
          style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          onClick={() => {
            setSelectedRunId(null);
            setActiveTab('agents');
          }}
        >
          <Play size={13} />
          <span>New Run</span>
        </button>
      </div>
    </header>
  );
}
