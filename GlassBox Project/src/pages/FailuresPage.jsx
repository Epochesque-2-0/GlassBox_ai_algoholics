import React from 'react';
import { useRuns } from '../context/RunContext';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  Eye, 
  ShieldAlert, 
  Play, 
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function FailuresPage() {
  const { runs, setSelectedTrace, setActiveTab } = useRuns();

  const failedRuns = runs.filter(r => r.status === 'failure');

  // Default fallback Run #3 mock failure if none present
  const primaryFailure = failedRuns[0] || {
    id: "RUN-003",
    runNumber: 3,
    prompt: "Generate an exhaustive real-time financial report with external API lookup",
    status: "failure",
    duration: "0.9s",
    tokens: 340,
    cost: "₹0.05",
    problem: "AI processing failed due to upstream inference engine timeout.",
    steps: [
      { id: 1, name: "User question received", status: "completed", durationMs: 180, details: "Prompt received and validated." },
      { id: 2, name: "AI processing started", status: "completed", durationMs: 270, details: "Context assembled and payload dispatched to LLM." },
      { id: 3, name: "AI processing failed", status: "failed", durationMs: 450, details: "Upstream Model Engine timed out after 450ms. (HTTP 504 Gateway Timeout)" }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            5. Failure Detection & Diagnostic Records
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '2px' }}>
            Demonstrating how Glass Box AI identifies and pinpoints exact lifecycle failure steps.
          </p>
        </div>

        <button 
          className="btn btn-danger"
          onClick={() => setActiveTab('chat')}
        >
          <AlertTriangle size={14} />
          <span>Test Live Failure in Chat</span>
        </button>
      </div>

      {/* Featured Failure Card (Run #3 Demonstration) */}
      <div className="glass-card" style={{ border: '1px solid rgba(244, 63, 94, 0.35)', background: 'rgba(15, 23, 42, 0.9)' }}>
        <div className="card-header" style={{ background: 'rgba(244, 63, 94, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="run-id-tag" style={{ color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'rgba(244, 63, 94, 0.1)' }}>
              RUN #{primaryFailure.runNumber || primaryFailure.id}
            </span>
            <span className="status-badge failure">
              <XCircle size={12} />
              Status: Failed
            </span>
          </div>

          <button 
            className="btn btn-outline"
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
            onClick={() => setSelectedTrace(primaryFailure)}
          >
            <Eye size={12} />
            Full Inspector
          </button>
        </div>

        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Problem Statement Box */}
          <div style={{
            padding: '16px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fb7185', marginBottom: '4px' }}>
              Problem Description
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              AI processing failed.
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
              {primaryFailure.errorDetails || primaryFailure.problem || "Upstream Model Engine timed out during token synthesis."}
            </div>
          </div>

          {/* User Prompt */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              User Question
            </div>
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '0.9rem'
            }}>
              "{primaryFailure.prompt}"
            </div>
          </div>

          {/* Trace Timeline Demonstrating Failure Point */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '14px', letterSpacing: '0.05em' }}>
              Execution Trace with Identified Failure Point
            </div>

            <div className="trace-timeline">
              {primaryFailure.steps && primaryFailure.steps.map((step, idx) => {
                const isFailed = step.status === 'failed';
                return (
                  <div key={step.id || idx} className={`timeline-step ${isFailed ? 'failed' : 'completed'}`}>
                    <div className={`timeline-step-icon ${isFailed ? 'failed' : 'completed'}`}>
                      {isFailed ? '✕' : '✓'}
                    </div>
                    <div className="timeline-step-header">
                      <div className="timeline-step-title" style={{ color: isFailed ? '#fb7185' : '#f8fafc' }}>
                        {step.id || idx + 1}. {step.name}
                      </div>
                      <div className="timeline-step-time">
                        {step.durationMs ? `${step.durationMs}ms` : ''}
                      </div>
                    </div>
                    <div className="timeline-step-desc">
                      {step.details}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Confirmation Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '12px'
          }}>
            <ShieldAlert size={24} style={{ color: '#fb7185', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
                Failure detected and recorded in trace.
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '2px' }}>
                The Glass Box engine isolated the failure at Step 3, preventing silent errors and saving partial execution state.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical List of All Recorded Failures */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title">
            <AlertTriangle size={18} style={{ color: '#fb7185' }} />
            <span>All Recorded Failures ({failedRuns.length})</span>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Prompt</th>
                <th>Error Reason</th>
                <th>Failed Step</th>
                <th>Time Taken</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {failedRuns.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    No failed runs currently logged. Click "Test Live Failure in Chat" to simulate one!
                  </td>
                </tr>
              ) : (
                failedRuns.map((r) => (
                  <tr key={r.id} className="clickable" onClick={() => setSelectedTrace(r)}>
                    <td>
                      <span className="run-id-tag" style={{ color: '#fb7185' }}>Run #{r.runNumber || r.id}</span>
                    </td>
                    <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#f8fafc' }}>
                      {r.prompt}
                    </td>
                    <td style={{ color: '#fb7185', fontSize: '0.82rem' }}>
                      {r.errorDetails || "AI Processing Timeout"}
                    </td>
                    <td style={{ color: '#f8fafc', fontWeight: 600 }}>
                      Step 3 (AI Inference)
                    </td>
                    <td>{r.duration}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.76rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrace(r);
                        }}
                      >
                        <Eye size={12} />
                        View Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
