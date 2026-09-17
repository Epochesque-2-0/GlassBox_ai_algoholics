// GlassBox Execution & Trace Telemetry Service

export const AVAILABLE_AGENTS = [
  { id: 'assistant', name: 'General Assistant', model: 'gpt-4o-mini', desc: 'Standard conversational agent with context reasoning' },
  { id: 'researcher', name: 'Research Agent', model: 'gemini-1.5-pro', desc: 'Deep search & document retrieval agent' },
  { id: 'analyst', name: 'Data & Math Agent', model: 'claude-3-5-sonnet', desc: 'Calculations, data parsing, and logic validation' }
];

const KNOWLEDGE_RESPONSES = {
  rag: {
    match: /rag|retrieval/i,
    toolName: "DocRetriever.query",
    toolInput: "{ query: 'what is rag architecture', top_k: 3 }",
    toolOutput: "{ documents: ['Doc #1: RAG combines vector retrieval with LLM generation...', 'Doc #2: Grounding factual context...'], latency: 120ms }",
    answer: "Retrieval-Augmented Generation (RAG) is an AI architecture that combines information retrieval with text generation. Instead of relying solely on training weights, the system retrieves relevant documents from external storage before generating an answer. This grounds responses in verifiable data and reduces hallucinations."
  },
  glassbox: {
    match: /glass\s*box|transparent|observability|trace/i,
    toolName: "GlassBox.getTelemetry",
    toolInput: "{ session_id: 'sess_live', trace_level: 'verbose' }",
    toolOutput: "{ active_spans: 5, latency_tracking: true, token_metering: true }",
    answer: "GlassBox is a developer observability tool designed to make AI execution transparent. It records the complete lifecycle of every run—tracking user input, agent decisions, tool invocations, token consumption, and errors in a clear vertical trace."
  },
  cost: {
    match: /cost|token|pricing|estimate/i,
    toolName: "TokenMeter.calculate",
    toolInput: "{ model: 'gpt-4o-mini', prompt_tokens: 24, completion_tokens: 110 }",
    toolOutput: "{ estimated_cost: '$0.00021', tier: 'standard' }",
    answer: "GlassBox measures input and output tokens for every step in the pipeline. Estimated costs are computed in real-time based on token counts and model pricing tiers, providing transparent cost visibility per execution."
  }
};

/**
 * Executes a simulated or live AI run with detailed multi-step trace
 */
export async function executeAiRun(prompt, history = [], simulateFailure = false, agentId = 'assistant') {
  const startTime = Date.now();
  const agent = AVAILABLE_AGENTS.find(a => a.id === agentId) || AVAILABLE_AGENTS[0];
  
  const steps = [];
  const startIso = new Date().toISOString();

  // 1. User Input
  await new Promise(r => setTimeout(r, 140));
  steps.push({
    id: 1,
    name: "User Input",
    role: "input",
    status: "completed",
    durationMs: 42,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    summary: "User question received and validated",
    input: prompt,
    output: `Validated prompt payload (${prompt.length} chars, estimated ${Math.ceil(prompt.length / 4)} tokens).`,
    tokens: Math.ceil(prompt.length / 4)
  });

  // 2. Agent Decision / Planning
  await new Promise(r => setTimeout(r, 180));
  steps.push({
    id: 2,
    name: "Agent Decision",
    role: "agent",
    status: "completed",
    durationMs: 180,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    summary: `Agent (${agent.name}) evaluated context and determined execution plan`,
    input: `Context window: ${Math.min(history.length, 4)} previous messages. Prompt: "${prompt}"`,
    output: `Plan generated: 1. Fetch relevant memory/tool. 2. Synthesize with ${agent.model}.`,
    tokens: 48
  });

  // 3. Tool Call & Tool Result
  const matchedData = Object.values(KNOWLEDGE_RESPONSES).find(k => k.match.test(prompt));
  const toolName = matchedData ? matchedData.toolName : "MemoryStore.lookup";
  const toolInput = matchedData ? matchedData.toolInput : `{ query: "${prompt.slice(0, 30)}", max_results: 2 }`;
  const toolOutput = matchedData ? matchedData.toolOutput : "{ status: 'ok', match_count: 1, confidence: 0.94 }";

  if (simulateFailure) {
    await new Promise(r => setTimeout(r, 220));
    steps.push({
      id: 3,
      name: "Tool Call",
      role: "tool",
      status: "failed",
      durationMs: 220,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      summary: `Invoked tool: ${toolName}`,
      input: toolInput,
      output: "Error: Connection timeout (504 Gateway Timeout) while reaching upstream endpoint.",
      error: "Upstream tool execution failed: ConnectionRefusedException / Timeout after 220ms.",
      tokens: 28
    });

    await new Promise(r => setTimeout(r, 160));
    steps.push({
      id: 4,
      name: "Retry Attempted",
      role: "retry",
      status: "completed",
      durationMs: 160,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      summary: "Retry policy triggered (attempt 1/3) — fallback cache engaged",
      input: "{ retry_count: 1, fallback: true }",
      output: "Fallback cache hit: Retrieved cached context successfully.",
      tokens: 15
    });
  } else {
    await new Promise(r => setTimeout(r, 200));
    steps.push({
      id: 3,
      name: "Tool Call",
      role: "tool",
      status: "completed",
      durationMs: 195,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      summary: `Invoked tool: ${toolName}`,
      input: toolInput,
      output: toolOutput,
      tokens: 65
    });

    steps.push({
      id: 4,
      name: "Tool Result",
      role: "tool_result",
      status: "completed",
      durationMs: 35,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      summary: "Result returned to agent working memory",
      input: toolOutput,
      output: "Context injected into prompt construction buffer.",
      tokens: 0
    });
  }

  // 4. LLM Generation
  await new Promise(r => setTimeout(r, 380));
  let answer = "";
  if (matchedData) {
    answer = matchedData.answer;
  } else {
    answer = `Analysis of "${prompt}":\n\nThe GlassBox agent executed this request, verified context consistency, and generated this structured response with full step traceability.`;
  }

  const promptTokens = Math.floor(prompt.length / 3.5) + 60;
  const completionTokens = Math.floor(answer.length / 3.8);
  const stepTokens = promptTokens + completionTokens;

  steps.push({
    id: 5,
    name: "LLM Generation",
    role: "llm",
    status: "completed",
    durationMs: 380,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    summary: `Generated response using ${agent.model}`,
    input: `System prompt + injected tool context (${promptTokens} tokens)`,
    output: answer,
    tokens: stepTokens
  });

  // 5. Final Response
  await new Promise(r => setTimeout(r, 90));
  steps.push({
    id: 6,
    name: "Final Response",
    role: "output",
    status: "completed",
    durationMs: 90,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    summary: "Response formatted and delivered to user",
    input: answer,
    output: "Delivered to client interface with complete trace telemetry.",
    tokens: 0
  });

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalTokens = steps.reduce((sum, s) => sum + (s.tokens || 0), 0);
  const estimatedCost = `$${(totalTokens * 0.000002).toFixed(4)}`;

  return {
    id: null,
    prompt,
    answer,
    agent: agent.name,
    model: agent.model,
    status: simulateFailure ? "failed" : "success",
    steps,
    stepCount: steps.length,
    tokens: totalTokens,
    cost: estimatedCost,
    duration: `${totalDuration}s`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: 'Just now',
    createdAt: startIso
  };
}
