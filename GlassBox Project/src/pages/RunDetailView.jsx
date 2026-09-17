import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Check, 
  ChevronsUpDown 
} from 'lucide-react';

export default function RunDetailView({ run, onBack }) {
  // Start with failed steps and primary steps expanded
  const [expandedSteps, setExpandedSteps] = useState(() => {
    if (!run || !run.steps) return {};
    const init = {};
    run.steps.forEach(s => {
      if (s.status === 'failed' || s.id === 1 || s.id === 3 || s.id === 5) {
        init[s.id] = true;
      }
    });
    return init;
  });

  const [copied, setCopied] = useState(false);

  if (!run) return null;

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const expandAll = () => {
    const all = {};
    if (run.steps) {
      run.steps.forEach(s => { all[s.id] = true; });
    }
    setExpandedSteps(all);
  };

  const collapseAll = () => {
    setExpandedSteps({});
  };

  const isSuccess = run.status === 'success';

  const copyPrompt = () => {
    navigator.clipboard.writeText(run.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const allExpanded = run.steps && run.steps.every(s => expandedSteps[s.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Back Nav & Quick Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          className="btn-clean"
          style={{ fontSize: '0.8rem' }}
          onClick={onBack}
        >
          <ArrowLeft size={13} />
          <span>Back to Runs</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`status-pill ${run.status}`}>
            {isSuccess ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
            {isSuccess ? 'Success' : 'Failed'}
          </span>
          <span className="mono-tag primary">{run.id}</span>
        </div>
      </div>

      {/* Trace Metadata Overview Card */}
      <div className="trace-header-card">
        <div className="trace-meta-item">
          <span className="trace-meta-label">Agent</span>
          <span className="trace-meta-value">{run.agent || 'General Assistant'}</span>
        </div>

        <div className="trace-meta-item">
          <span className="trace-meta-label">Model</span>
          <span className="trace-meta-value mono-tag" style={{ marginTop: '2px', alignSelf: 'flex-start' }}>{run.model || 'gpt-4o-mini'}</span>
        </div>

        <div className="trace-meta-item">
          <span className="trace-meta-label">Duration</span>
          <span className="trace-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{run.duration}</span>
        </div>

        <div className="trace-meta-item">
          <span className="trace-meta-label">Tokens</span>
          <span className="trace-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{run.tokens?.toLocaleString()}</span>
        </div>

        <div className="trace-meta-item">
          <span className="trace-meta-label">Cost</span>
          <span className="trace-meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{run.cost}</span>
        </div>

        <div className="trace-meta-item">
          <span className="trace-meta-label">Timestamp</span>
          <span className="trace-meta-value" style={{ fontSize: '0.8rem', color: '#64748b' }}>{run.timestamp}</span>
        </div>
      </div>

      {/* User Input Prompt Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em' }}>
            User Input
          </span>
          <button 
            onClick={copyPrompt}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem'
            }}
          >
            {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#0f172a' }}>
          "{run.prompt}"
        </div>
      </div>

      {/* Execution Trace Timeline (The Visual Centerpiece) */}
      <div className="trace-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 className="section-title">Execution Trace</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1px' }}>
              Step-by-step lifecycle recorded by GlassBox runtime. Click any step to inspect payload.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              {run.steps ? run.steps.length : run.stepCount} Steps Total
            </span>
            <button 
              className="btn-clean"
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              onClick={allExpanded ? collapseAll : expandAll}
            >
              <ChevronsUpDown size={12} />
              <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        </div>

        <div className="timeline-list">
          {run.steps && run.steps.map((step, idx) => {
            const isExpanded = !!expandedSteps[step.id];
            const isStepFailed = step.status === 'failed';
            const isRetry = step.role === 'retry';

            return (
              <div key={step.id || idx} className="timeline-step-row">
                <div className="timeline-connector" />
                
                {/* Step Node Indicator */}
                <div className={`timeline-node ${isStepFailed ? 'failed' : 'completed'}`}>
                  <div className="timeline-node-inner" />
                </div>

                {/* Step Card */}
                <div 
                  className={`timeline-card ${isExpanded ? 'selected' : ''} ${isStepFailed ? 'is-failed' : ''}`}
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="timeline-card-header">
                    <div className="timeline-card-title-group">
                      <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                        {idx + 1}.
                      </span>
                      <span className="timeline-card-title">{step.name}</span>
                      
                      {isStepFailed && (
                        <span className="status-pill failed" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>
                          Failed
                        </span>
                      )}

                      {isRetry && (
                        <span className="status-pill running" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>
                          Retry
                        </span>
                      )}
                    </div>

                    <div className="timeline-card-meta">
                      {step.durationMs && <span>{step.durationMs}ms</span>}
                      {step.tokens > 0 && <span>{step.tokens} tok</span>}
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </div>
                  </div>

                  <div className="timeline-card-summary">
                    {step.summary || step.details}
                  </div>

                  {/* Expandable Step Payloads */}
                  {isExpanded && (
                    <div className="timeline-details" onClick={(e) => e.stopPropagation()}>
                      {step.error && (
                        <div>
                          <div className="detail-block-label" style={{ color: '#b91c1c' }}>Error Diagnostic</div>
                          <div className="error-box">
                            {step.error}
                          </div>
                        </div>
                      )}

                      {step.input && (
                        <div>
                          <div className="detail-block-label">Input / Payload</div>
                          <div className="code-box">
                            {typeof step.input === 'object' ? JSON.stringify(step.input, null, 2) : step.input}
                          </div>
                        </div>
                      )}

                      {step.output && (
                        <div>
                          <div className="detail-block-label">Output / Result</div>
                          <div className="code-box">
                            {typeof step.output === 'object' ? JSON.stringify(step.output, null, 2) : step.output}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        <span>Timestamp: <strong style={{ color: '#0f172a' }}>{step.timestamp}</strong></span>
                        <span>Duration: <strong style={{ color: '#0f172a' }}>{step.durationMs ? `${step.durationMs}ms` : 'N/A'}</strong></span>
                        <span>Tokens: <strong style={{ color: '#0f172a' }}>{step.tokens || 0}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivered Answer / Output Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ fontSize: '0.74rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.04em', marginBottom: '6px' }}>
          Delivered Response
        </div>
        <div style={{ fontSize: '0.88rem', color: '#0f172a', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {run.answer}
        </div>
      </div>
    </div>
  );
}
