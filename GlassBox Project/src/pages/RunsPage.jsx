import React, { useState } from 'react';
import { useRuns } from '../context/RunContext';
import { Search, CheckCircle2, XCircle, ChevronRight, Eye } from 'lucide-react';
import RunDetailView from './RunDetailView';

export default function RunsPage() {
  const { runs, selectedRunId, setSelectedRunId, selectedTrace } = useRuns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // If a run is selected, render the dedicated Trace / Run Detail view
  if (selectedRunId && selectedTrace) {
    return <RunDetailView run={selectedTrace} onBack={() => setSelectedRunId(null)} />;
  }

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          run.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (run.agent && run.agent.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Runs</h1>
          <p className="page-description">
            All AI executions, tool calls, and latency telemetry. Click any run to inspect the execution trace.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px'
          }}>
            <Search size={14} style={{ color: '#94a3b8' }} />
            <input 
              type="text"
              placeholder="Filter by prompt or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '0.82rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          <div style={{ display: 'flex', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
            {['all', 'success', 'failed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: statusFilter === st ? '#0f172a' : 'transparent',
                  color: statusFilter === st ? '#ffffff' : '#64748b'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Runs Table */}
      <div className="table-container">
        <table className="dev-table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Agent</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>Timestamp</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRuns.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No runs found matching your filter.
                </td>
              </tr>
            ) : (
              filteredRuns.map((run) => {
                const isSuccess = run.status === 'success';
                return (
                  <tr 
                    key={run.id}
                    className="clickable-row"
                    onClick={() => setSelectedRunId(run.id)}
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
                      {run.duration}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {run.tokens?.toLocaleString()}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#475569' }}>
                      {run.cost}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {run.timestamp}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn-clean"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRunId(run.id);
                        }}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
