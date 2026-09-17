import React, { useState } from 'react';
import { useRuns } from '../context/RunContext';
import { 
  GitCommit, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Coins,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function TracesPage() {
  const { runs, setSelectedTrace } = useRuns();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(run.runNumber).includes(searchTerm) ||
                          run.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            All Execution Traces
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '2px' }}>
            Historical log of all prompts, step executions, latency telemetry, and token metrics.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '6px 12px'
          }}>
            <Search size={14} style={{ color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search runs or questions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          {/* Status Filter Pill Buttons */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '3px' }}>
            {['all', 'success', 'failure'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  background: statusFilter === st ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: statusFilter === st ? '#ffffff' : '#94a3b8'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Runs Table */}
      <div className="glass-card">
        <div className="card-body" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Run ID</th>
                <th>User Question</th>
                <th>Status</th>
                <th>Steps</th>
                <th>Tokens</th>
                <th>Cost</th>
                <th>Time Taken</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No runs found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const isSuccess = run.status === 'success';
                  const isExpanded = expandedRowId === run.id;

                  return (
                    <React.Fragment key={run.id}>
                      <tr 
                        className="clickable"
                        onClick={() => setSelectedTrace(run)}
                      >
                        <td onClick={(e) => toggleExpand(run.id, e)}>
                          {isExpanded ? (
                            <ChevronDown size={16} style={{ color: '#38bdf8' }} />
                          ) : (
                            <ChevronRight size={16} style={{ color: '#64748b' }} />
                          )}
                        </td>
                        <td>
                          <span className="run-id-tag">Run #{run.runNumber || run.id}</span>
                        </td>
                        <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500, color: '#f8fafc' }}>
                          {run.prompt}
                        </td>
                        <td>
                          <span className={`status-badge ${run.status}`}>
                            {isSuccess ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                            {isSuccess ? 'Success' : 'Failure'}
                          </span>
                        </td>
                        <td>{run.steps ? run.steps.length : run.stepCount} Steps</td>
                        <td>
                          <span style={{ color: '#c084fc' }}>{run.tokens?.toLocaleString()}</span>
                        </td>
                        <td style={{ color: '#f59e0b', fontWeight: 600 }}>{run.cost}</td>
                        <td style={{ color: '#38bdf8' }}>{run.duration}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTrace(run);
                            }}
                          >
                            <Eye size={12} />
                            View Trace
                          </button>
                        </td>
                      </tr>

                      {/* Inline Expandable Trace Breakdown */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="9" style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '20px 28px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                                  Step-by-Step Trace Summary (Run #{run.runNumber || run.id})
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                                  Logged at {run.timestamp}
                                </div>
                              </div>

                              <div className="trace-timeline">
                                {run.steps && run.steps.map((step, sIdx) => (
                                  <div key={sIdx} className={`timeline-step ${step.status}`}>
                                    <div className={`timeline-step-icon ${step.status}`}>
                                      {step.status === 'completed' ? '✓' : '✕'}
                                    </div>
                                    <div className="timeline-step-header">
                                      <div className="timeline-step-title">
                                        {step.id || sIdx + 1}. {step.name}
                                      </div>
                                      <div className="timeline-step-time">
                                        {step.durationMs ? `${step.durationMs}ms` : step.timestamp}
                                      </div>
                                    </div>
                                    <div className="timeline-step-desc">
                                      {step.details}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button 
                                  className="btn btn-outline"
                                  style={{ padding: '4px 12px', fontSize: '0.78rem' }}
                                  onClick={() => setSelectedTrace(run)}
                                >
                                  Open Full Modal View
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
