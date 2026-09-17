import React from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { useRuns } from '../context/RunContext';

export default function TraceModal() {
  const { selectedTrace, setSelectedRunId } = useRuns();

  if (!selectedTrace) return null;

  const isSuccess = selectedTrace.status === 'success';

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px'
      }}
      onClick={() => setSelectedRunId(null)}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="mono-tag primary">{selectedTrace.id}</span>
            <span className={`status-pill ${selectedTrace.status}`}>
              {isSuccess ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
              {isSuccess ? 'Success' : 'Failed'}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {selectedTrace.timestamp}
            </span>
          </div>

          <button 
            onClick={() => setSelectedRunId(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Metadata Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            background: 'var(--bg-subtle)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Agent</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{selectedTrace.agent || 'General Assistant'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Latency</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{selectedTrace.duration}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Tokens</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{selectedTrace.tokens?.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Cost</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>{selectedTrace.cost}</div>
            </div>
          </div>

          {/* User Prompt */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Prompt</div>
            <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 500 }}>"{selectedTrace.prompt}"</div>
          </div>

          {/* Trace Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
              Execution Steps ({selectedTrace.steps?.length || 0})
            </div>

            <div className="timeline-list">
              {selectedTrace.steps && selectedTrace.steps.map((step, idx) => {
                const isStepFailed = step.status === 'failed';
                return (
                  <div key={step.id || idx} className="timeline-step-row">
                    <div className="timeline-connector" />
                    <div className={`timeline-node ${isStepFailed ? 'failed' : 'completed'}`}>
                      <div className="timeline-node-inner" />
                    </div>
                    <div className={`timeline-card ${isStepFailed ? 'is-failed' : ''}`} style={{ cursor: 'default' }}>
                      <div className="timeline-card-header">
                        <div className="timeline-card-title-group">
                          <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{idx + 1}.</span>
                          <span className="timeline-card-title">{step.name}</span>
                          {isStepFailed && <span className="status-pill failed" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>Failed</span>}
                        </div>
                        <div className="timeline-card-meta">
                          {step.durationMs && <span>{step.durationMs}ms</span>}
                        </div>
                      </div>
                      <div className="timeline-card-summary">
                        {step.summary || step.details}
                      </div>
                      {step.error && (
                        <div className="error-box" style={{ marginTop: '8px' }}>
                          {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          background: 'var(--bg-subtle)'
        }}>
          <button 
            className="btn-clean"
            onClick={() => setSelectedRunId(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
