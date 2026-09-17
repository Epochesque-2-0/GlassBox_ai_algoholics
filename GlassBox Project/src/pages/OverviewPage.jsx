import React from 'react';
import { useRuns } from '../context/RunContext';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function OverviewPage() {
  const { stats, runs, setSelectedRunId, setActiveTab } = useRuns();

  const metrics = [
    { label: 'Total Runs', value: stats.totalRuns },
    { label: 'Success Rate', value: stats.successRate },
    { label: 'Average Latency', value: stats.avgLatency },
    { label: 'Total Tokens', value: stats.totalTokens.toLocaleString() }
  ];

  const recentRuns = runs.slice(0, 5);

  const handleRowClick = (runId) => {
    setSelectedRunId(runId);
    setActiveTab('runs');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 className="page-title">GlassBox</h1>
          <span className="mono-tag" style={{ fontSize: '0.72rem' }}>v0.2.0</span>
        </div>
        <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
          AI execution observability
        </div>
        <p className="page-description">
          See what your AI did, step by step.
        </p>
      </div>

      {/* Clean Metrics Row */}
      <div className="metrics-row">
        {metrics.map((m, idx) => (
          <div key={idx} className="metric-box">
            <div className="metric-box-label">{m.label}</div>
            <div className="metric-box-value">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Runs Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="section-title">Recent Runs</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Latest executions recorded across all connected agents.
            </p>
          </div>
          <button 
            className="btn-clean"
            style={{ fontSize: '0.78rem' }}
            onClick={() => setActiveTab('runs')}
          >
            <span>View all runs</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="table-container">
          <table className="dev-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Tokens</th>
                <th>Latency</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run) => {
                const isSuccess = run.status === 'success';
                return (
                  <tr 
                    key={run.id}
                    className="clickable-row"
                    onClick={() => handleRowClick(run.id)}
                  >
                    <td>
                      <span className="mono-tag primary">{run.id}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#0f172a' }}>
                      {run.agent || 'General Assistant'}
                    </td>
                    <td>
                      <span className={`status-pill ${run.status}`}>
                        {isSuccess ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {isSuccess ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {run.tokens?.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {run.duration}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {run.timestamp}
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
