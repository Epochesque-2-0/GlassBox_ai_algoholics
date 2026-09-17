import React from 'react';
import { useRuns } from '../context/RunContext';

export default function AnalyticsPage() {
  const { stats } = useRuns();

  const totalInputTokens = Math.round(stats.totalTokens * 0.35);
  const totalOutputTokens = Math.round(stats.totalTokens * 0.65);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 className="page-title">Analytics & Telemetry</h1>
        <p className="page-description">
          Aggregated performance, latency distribution, and token consumption metrics.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="metrics-row" style={{ margin: 0 }}>
        <div className="metric-box">
          <div className="metric-box-label">Success Rate</div>
          <div className="metric-box-value" style={{ color: '#047857' }}>{stats.successRate}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            {stats.successfulRuns} success / {stats.failedRuns} failed
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-label">Average Latency</div>
          <div className="metric-box-value">{stats.avgLatency}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            p50: 1.12s | p95: 1.84s
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-label">Total Tokens</div>
          <div className="metric-box-value">{stats.totalTokens.toLocaleString()}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            {totalInputTokens.toLocaleString()} in / {totalOutputTokens.toLocaleString()} out
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-box-label">Estimated Spend</div>
          <div className="metric-box-value">{stats.totalCost}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
            Avg ${(parseFloat(stats.totalCost.replace('$', '')) / Math.max(1, stats.totalRuns)).toFixed(4)} / run
          </div>
        </div>
      </div>

      {/* Latency & Breakdown Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {/* Token Distribution */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <h3 className="section-title" style={{ marginBottom: '14px' }}>Token Usage Distribution</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Prompt / Input Tokens</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{totalInputTokens.toLocaleString()} (35%)</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: '#2563eb' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Completion / Output Tokens</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{totalOutputTokens.toLocaleString()} (65%)</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: '#10b981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Latency Percentiles */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <h3 className="section-title" style={{ marginBottom: '14px' }}>Latency Percentiles</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>p50 (Median)</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>1.12s</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>p95</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>1.84s</div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>p99</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>2.10s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
