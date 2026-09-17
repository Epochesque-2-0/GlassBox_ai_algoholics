import React, { createContext, useContext, useState, useEffect } from 'react';

const RunContext = createContext();

const INITIAL_RUNS = [
  {
    id: "RUN-105",
    runNumber: 105,
    prompt: "Explain what RAG is and why it reduces hallucinations.",
    answer: "Retrieval-Augmented Generation (RAG) combines external document retrieval with LLM text generation. Rather than relying solely on static training weights, the system retrieves relevant chunks from a vector store or database and injects them into the prompt, grounding the response in verifiable source data.",
    agent: "Research Agent",
    model: "gemini-1.5-pro",
    status: "success",
    stepCount: 6,
    tokens: 1250,
    cost: "$0.0025",
    duration: "1.42s",
    timestamp: "2m ago",
    date: "Today",
    steps: [
      {
        id: 1,
        name: "User Input",
        role: "input",
        status: "completed",
        durationMs: 38,
        timestamp: "10:45:01 AM",
        summary: "User question received and validated",
        input: "Explain what RAG is and why it reduces hallucinations.",
        output: "Prompt validated (55 chars, 14 tokens).",
        tokens: 14
      },
      {
        id: 2,
        name: "Agent Decision",
        role: "agent",
        status: "completed",
        durationMs: 140,
        timestamp: "10:45:01 AM",
        summary: "Agent evaluated query & selected retrieval strategy",
        input: "Task classification: Concept Explanation -> Retrieval required.",
        output: "Selected tool: VectorStore.similaritySearch",
        tokens: 42
      },
      {
        id: 3,
        name: "Tool Call",
        role: "tool",
        status: "completed",
        durationMs: 210,
        timestamp: "10:45:01 AM",
        summary: "Invoked VectorStore.similaritySearch",
        input: "{ query: 'what is rag architecture hallucinations', top_k: 3 }",
        output: "{ hits: 3, top_score: 0.92, source: 'ai_architecture_docs' }",
        tokens: 180
      },
      {
        id: 4,
        name: "Tool Result",
        role: "tool_result",
        status: "completed",
        durationMs: 25,
        timestamp: "10:45:02 AM",
        summary: "Relevant chunks extracted into working memory",
        input: "Retrieved 3 document chunks totaling 480 tokens.",
        output: "Grounding context injected into LLM prompt buffer.",
        tokens: 0
      },
      {
        id: 5,
        name: "LLM Generation",
        role: "llm",
        status: "completed",
        durationMs: 920,
        timestamp: "10:45:02 AM",
        summary: "Synthesized grounded explanation using gemini-1.5-pro",
        input: "System instruction + retrieved context chunks + user prompt.",
        output: "Generated 340-word technical response.",
        tokens: 1014
      },
      {
        id: 6,
        name: "Final Response",
        role: "output",
        status: "completed",
        durationMs: 87,
        timestamp: "10:45:03 AM",
        summary: "Response formatted and delivered to user",
        input: "Completed generation payload.",
        output: "Delivered to client interface with full trace telemetry.",
        tokens: 0
      }
    ]
  },
  {
    id: "RUN-104",
    runNumber: 104,
    prompt: "Calculate revenue retention across Q1-Q3 customer cohorts.",
    answer: "Based on cohort analysis of the provided dataset:\n- Q1 Cohort: 92.4% net retention\n- Q2 Cohort: 88.1% net retention\n- Q3 Cohort: 94.6% net retention\nAverage weighted retention rate stands at 91.7%.",
    agent: "Data & Math Agent",
    model: "claude-3-5-sonnet",
    status: "success",
    stepCount: 6,
    tokens: 1842,
    cost: "$0.0036",
    duration: "1.84s",
    timestamp: "14m ago",
    date: "Today",
    steps: [
      { id: 1, name: "User Input", role: "input", status: "completed", durationMs: 40, timestamp: "10:31:00 AM", summary: "Query received", input: "Calculate revenue retention...", output: "Validated query.", tokens: 18 },
      { id: 2, name: "Agent Decision", role: "agent", status: "completed", durationMs: 160, timestamp: "10:31:00 AM", summary: "Agent routed calculation to Python runtime", input: "Financial computation task.", output: "Tool: CodeInterpreter.run", tokens: 55 },
      { id: 3, name: "Tool Call", role: "tool", status: "completed", durationMs: 380, timestamp: "10:31:01 AM", summary: "Executed cohort math script", input: "def cohort_retention(data): ...", output: "{ q1: 0.924, q2: 0.881, q3: 0.946 }", tokens: 240 },
      { id: 4, name: "Tool Result", role: "tool_result", status: "completed", durationMs: 30, timestamp: "10:31:01 AM", summary: "Parsed calculation matrix", input: "Script output returned 0 errors.", output: "Output payload formatted.", tokens: 0 },
      { id: 5, name: "LLM Generation", role: "llm", status: "completed", durationMs: 1150, timestamp: "10:31:02 AM", summary: "Synthesized executive financial breakdown", input: "Calculated numbers + executive summary template.", output: "Formatted markdown report.", tokens: 1529 },
      { id: 6, name: "Final Response", role: "output", status: "completed", durationMs: 80, timestamp: "10:31:03 AM", summary: "Delivered report to user", input: "Final text.", output: "Done.", tokens: 0 }
    ]
  },
  {
    id: "RUN-103",
    runNumber: 103,
    prompt: "Execute real-time price arbitrage query across exchange orderbooks.",
    answer: "Analysis completed via fallback cache. Live orderbook feed encountered a temporary upstream timeout; secondary endpoint resolved with 14ms latency difference.",
    agent: "Data & Math Agent",
    model: "claude-3-5-sonnet",
    status: "failed",
    stepCount: 5,
    tokens: 380,
    cost: "$0.0008",
    duration: "0.92s",
    timestamp: "32m ago",
    date: "Today",
    steps: [
      { id: 1, name: "User Input", role: "input", status: "completed", durationMs: 35, timestamp: "10:12:00 AM", summary: "Received arbitrage prompt", input: "Execute real-time price arbitrage...", output: "Validated.", tokens: 22 },
      { id: 2, name: "Agent Decision", role: "agent", status: "completed", durationMs: 120, timestamp: "10:12:00 AM", summary: "Selected ExchangeAPI.getOrderBook", input: "Trading query.", output: "Tool selected.", tokens: 40 },
      { id: 3, name: "Tool Call", role: "tool", status: "failed", durationMs: 220, timestamp: "10:12:00 AM", summary: "ExchangeAPI.getOrderBook failed", input: "{ exchange: 'primary_feed', pair: 'ETH-USDC' }", output: "HTTP 504: Gateway Timeout after 220ms.", error: "ConnectionRefusedException: Upstream exchange socket closed unexpectedly.", tokens: 35 },
      { id: 4, name: "Retry Attempted", role: "retry", status: "completed", durationMs: 160, timestamp: "10:12:01 AM", summary: "Retry policy triggered (attempt 1/3) — secondary fallback engaged", input: "{ fallback_exchange: 'secondary_cache' }", output: "Fallback cache response received.", tokens: 28 },
      { id: 5, name: "Final Response", role: "output", status: "completed", durationMs: 90, timestamp: "10:12:01 AM", summary: "Delivered warning & fallback data to user", input: "Fallback data payload.", output: "Response marked with warning flag.", tokens: 255 }
    ]
  },
  {
    id: "RUN-102",
    runNumber: 102,
    prompt: "How does GlassBox trace AI execution steps?",
    answer: "GlassBox instruments agent runtimes by intercepting prompts, tool calls, model inferences, and return values. Each step is logged as an atomic span with millisecond timestamps, token metrics, and payload inputs/outputs.",
    agent: "General Assistant",
    model: "gpt-4o-mini",
    status: "success",
    stepCount: 4,
    tokens: 890,
    cost: "$0.0017",
    duration: "1.15s",
    timestamp: "1h ago",
    date: "Today",
    steps: [
      { id: 1, name: "User Input", role: "input", status: "completed", durationMs: 30, timestamp: "09:40:00 AM", summary: "Question received", input: "How does GlassBox trace...", output: "Validated.", tokens: 16 },
      { id: 2, name: "Agent Decision", role: "agent", status: "completed", durationMs: 110, timestamp: "09:40:00 AM", summary: "Zero-shot explanation plan", input: "Observability topic.", output: "Direct generation.", tokens: 35 },
      { id: 3, name: "LLM Generation", role: "llm", status: "completed", durationMs: 940, timestamp: "09:40:01 AM", summary: "Generated overview using gpt-4o-mini", input: "Observability prompt.", output: "Answer synthesized.", tokens: 839 },
      { id: 4, name: "Final Response", role: "output", status: "completed", durationMs: 70, timestamp: "09:40:01 AM", summary: "Delivered to user", input: "Done.", output: "Delivered.", tokens: 0 }
    ]
  },
  {
    id: "RUN-101",
    runNumber: 101,
    prompt: "Summarize customer feedback ticket #402",
    answer: "Customer reported latency spikes during peak load. Recommendation: Increase connection pooling and review cache invalidation rules.",
    agent: "General Assistant",
    model: "gpt-4o-mini",
    status: "success",
    stepCount: 4,
    tokens: 520,
    cost: "$0.0010",
    duration: "0.78s",
    timestamp: "2h ago",
    date: "Today",
    steps: [
      { id: 1, name: "User Input", role: "input", status: "completed", durationMs: 25, timestamp: "08:15:00 AM", summary: "Ticket summarize prompt", input: "Summarize customer ticket #402", output: "Validated.", tokens: 14 },
      { id: 2, name: "Agent Decision", role: "agent", status: "completed", durationMs: 95, timestamp: "08:15:00 AM", summary: "Loaded ticket context", input: "Ticket #402 context.", output: "Summarize strategy.", tokens: 40 },
      { id: 3, name: "LLM Generation", role: "llm", status: "completed", durationMs: 610, timestamp: "08:15:01 AM", summary: "Generated concise summary", input: "Ticket body.", output: "Summary text.", tokens: 466 },
      { id: 4, name: "Final Response", role: "output", status: "completed", durationMs: 50, timestamp: "08:15:01 AM", summary: "Delivered to user", input: "Summary.", output: "Delivered.", tokens: 0 }
    ]
  }
];

export function RunProvider({ children }) {
  const [runs, setRuns] = useState(() => {
    try {
      const saved = localStorage.getItem('glassbox_runs_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RUNS;
  });

  const [activeTab, setActiveTab] = useState('overview'); // overview | runs | agents | analytics | settings
  const [selectedRunId, setSelectedRunId] = useState(null); // when viewing trace in dedicated run detail view

  useEffect(() => {
    try {
      localStorage.setItem('glassbox_runs_v2', JSON.stringify(runs));
    } catch (e) {
      console.error(e);
    }
  }, [runs]);

  const addRun = (newRunData) => {
    const nextNum = runs.length > 0 ? Math.max(...runs.map(r => r.runNumber || 0)) + 1 : 101;
    const formattedId = `RUN-${nextNum}`;
    
    const fullRun = {
      ...newRunData,
      id: formattedId,
      runNumber: nextNum
    };

    setRuns(prev => [fullRun, ...prev]);
    return fullRun;
  };

  const resetData = () => {
    setRuns(INITIAL_RUNS);
    setSelectedRunId(null);
  };

  const selectedTrace = runs.find(r => r.id === selectedRunId) || null;

  // Realistic telemetry metrics computation
  const totalRuns = runs.length;
  const successfulRuns = runs.filter(r => r.status === 'success').length;
  const failedRuns = runs.filter(r => r.status === 'failed' || r.status === 'failure').length;
  const successRate = totalRuns > 0 ? `${((successfulRuns / totalRuns) * 100).toFixed(1)}%` : '100%';
  
  const totalTokens = runs.reduce((sum, r) => sum + (r.tokens || 0), 0);
  
  const avgLatencySec = totalRuns > 0 
    ? (runs.reduce((sum, r) => sum + parseFloat(String(r.duration).replace('s', '') || 1.0), 0) / totalRuns).toFixed(2)
    : '1.24';

  const totalCost = runs.reduce((sum, r) => {
    const val = parseFloat(String(r.cost || '0').replace('$', '').replace('₹', ''));
    return sum + (isNaN(val) ? 0 : val);
  }, 0).toFixed(4);

  return (
    <RunContext.Provider value={{
      runs,
      addRun,
      resetData,
      activeTab,
      setActiveTab,
      selectedRunId,
      setSelectedRunId,
      selectedTrace,
      stats: {
        totalRuns,
        successfulRuns,
        failedRuns,
        successRate,
        avgLatency: `${avgLatencySec}s`,
        totalTokens,
        totalCost: `$${totalCost}`
      }
    }}>
      {children}
    </RunContext.Provider>
  );
}

export function useRuns() {
  const context = useContext(RunContext);
  if (!context) throw new Error('useRuns must be used within RunProvider');
  return context;
}
