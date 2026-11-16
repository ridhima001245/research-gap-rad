export type AnalysisMode = 'rad' | 'rag';

export type GapCategory = 
  | 'methodological' 
  | 'empirical' 
  | 'theoretical' 
  | 'application' 
  | 'evaluation' 
  | 'data-scarcity';

export type GapSeverity = 'critical' | 'emerging' | 'niche';

export interface PaperChunk {
  id: string;
  paperId: string;
  section: string;
  text: string;
  page?: number;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  doi?: string;
  abstract: string;
  fullText?: string;
  category: string;
  keywords: string[];
  metadata: {
    coreObjective: string;
    methodology: string;
    datasetOrBenchmark: string;
    primaryFindings: string;
    explicitLimitations: string[];
    suggestedFutureWork: string[];
    hardwareOrCompute?: string;
  };
  chunks?: PaperChunk[];
}

export interface EvidenceQuote {
  paperId: string;
  paperTitle: string;
  section: string;
  quote: string;
  relevanceExplanation: string;
}

export interface ResearchGap {
  id: string;
  title: string;
  category: GapCategory;
  severity: GapSeverity;
  description: string;
  affectedPaperIds: string[];
  evidenceQuotes: EvidenceQuote[];
  
  // RAD & RAG metrics
  noveltyScore: number; // 1-10
  feasibilityScore: number; // 1-10
  urgencyScore: number; // 1-10
  
  // AI-generated suggestions
  suggestedHypothesis: string;
  proposedMethodology: string;
  expectedContribution: string;
  recommendedEvaluation: string;
}

export interface PaperConsensusItem {
  id: string;
  topic: string;
  type: 'consensus' | 'contradiction' | 'orthogonal';
  summary: string;
  paperArguments: {
    paperId: string;
    paperTitle: string;
    stance: string;
    quote: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode: AnalysisMode;
  citations?: {
    paperId: string;
    paperTitle: string;
    section: string;
    quote: string;
  }[];
  reasoningSteps?: string[];
}

export interface LLMConfig {
  provider: 'simulated' | 'gemini' | 'openai' | 'ollama';
  apiKey: string;
  model: string;
  temperature: number;
  customEndpoint?: string;
}

export interface CorpusCollection {
  id: string;
  name: string;
  field: string;
  description: string;
  iconName: string;
  papers: ResearchPaper[];
}
