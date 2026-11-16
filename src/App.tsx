import React, { useState, useMemo } from 'react';
import { 
  AnalysisMode, 
  CorpusCollection, 
  ResearchPaper, 
  ResearchGap, 
  PaperConsensusItem, 
  LLMConfig,
  GapCategory
} from './types';
import { SAMPLE_CORPORA, INITIAL_GAPS, INITIAL_CONSENSUS } from './data/samplePapers';
import { LocalRagEngine } from './services/ragEngine';
import { RadEngine } from './services/radEngine';
import { Header } from './components/Header';
import { RadarChart } from './components/RadarChart';
import { GapCard } from './components/GapCard';
import { LiteratureMatrix } from './components/LiteratureMatrix';
import { ConsensusContradiction } from './components/ConsensusContradiction';
import { RagChat } from './components/RagChat';
import { PaperLibrary } from './components/PaperLibrary';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { NewHypothesisModal } from './components/NewHypothesisModal';
import { 
  Compass, 
  Radar, 
  Table, 
  Scale, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  Brain,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

export function App() {
  // Mode state: 'rad' (Rapid Analysis & Discovery) or 'rag' (Retrieval-Augmented Generation)
  const [mode, setMode] = useState<AnalysisMode>('rad');

  // Corpora & Papers state
  const [activeCorpus, setActiveCorpus] = useState<CorpusCollection>(SAMPLE_CORPORA[0]);
  const [papers, setPapers] = useState<ResearchPaper[]>(SAMPLE_CORPORA[0].papers);
  const [gaps, setGaps] = useState<ResearchGap[]>(INITIAL_GAPS);
  const [consensusItems, setConsensusItems] = useState<PaperConsensusItem[]>(INITIAL_CONSENSUS);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'gaps' | 'radar' | 'matrix' | 'debates' | 'chat' | 'papers'>('gaps');

  // Filter states for gaps
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Modals & Inspectors
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [activeGapForPitch, setActiveGapForPitch] = useState<ResearchGap | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // LLM Config
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'simulated',
    apiKey: '',
    model: 'scholar-rad-neural-v2',
    temperature: 0.35
  });

  // Engines
  const ragEngine = useMemo(() => new LocalRagEngine(papers), [papers]);
  const radarMetrics = useMemo(() => RadEngine.computeCorpusRadar(papers), [papers]);

  // Handle switching corpus
  const handleSelectCorpus = (corpus: CorpusCollection) => {
    setActiveCorpus(corpus);
    setPapers(corpus.papers);
    // If switching to Reasoning corpus, adjust initial gaps
    if (corpus.id === 'reasoning-cot') {
      const reasoningGaps = INITIAL_GAPS.filter(g => 
        g.affectedPaperIds.some(pid => pid.includes('cot'))
      );
      setGaps(reasoningGaps.length > 0 ? reasoningGaps : RadEngine.extractGapsRapidly(corpus.papers));
    } else {
      setGaps(INITIAL_GAPS);
    }
  };

  // Add custom paper
  const handleAddPaper = (newPaper: ResearchPaper) => {
    const updated = [newPaper, ...papers];
    setPapers(updated);
    // RAD Mode automatically extracts new gaps rapidly
    const newRadGaps = RadEngine.extractGapsRapidly(updated);
    setGaps(prev => [...newRadGaps, ...prev]);
  };

  // Remove paper
  const handleRemovePaper = (paperId: string) => {
    setPapers(prev => prev.filter(p => p.id !== paperId));
  };

  // Filtered Gaps
  const filteredGaps = gaps.filter(g => {
    const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchSev = selectedSeverity === 'all' || g.severity === selectedSeverity;
    return matchCat && matchSev;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        mode={mode}
        setMode={setMode}
        activeCorpus={activeCorpus}
        corpora={SAMPLE_CORPORA}
        onSelectCorpus={handleSelectCorpus}
        llmConfig={llmConfig}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenExport={() => setShowExportModal(true)}
      />

      {/* Mode Callout Banner */}
      <div className={`border-b px-4 py-2 text-xs flex items-center justify-between transition-colors ${
        mode === 'rad'
          ? 'bg-gradient-to-r from-amber-950/40 via-rad-950/30 to-slate-900 border-rad-500/30 text-amber-200'
          : 'bg-gradient-to-r from-brand-950/40 via-indigo-950/30 to-slate-900 border-brand-500/30 text-brand-200'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'rad' ? (
              <Zap className="h-4 w-4 text-rad-400 fill-rad-400 animate-pulse" />
            ) : (
              <Brain className="h-4 w-4 text-brand-400 animate-pulse" />
            )}
            <span className="font-semibold">
              {mode === 'rad'
                ? 'RAD Mode Active: Instant heuristic triage & 5-axis vulnerability radar enabled.'
                : 'Deep RAG Mode Active: Multi-hop vector chunk indexing & grounded citation verification enabled.'}
            </span>
          </div>

          <button
            onClick={() => setMode(mode === 'rad' ? 'rag' : 'rad')}
            className="underline hover:text-white font-medium flex items-center gap-1 text-[11px]"
          >
            <span>Switch to {mode === 'rad' ? 'Deep RAG' : 'RAD Mode'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('gaps')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'gaps'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Research Gaps & Hypotheses</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px] font-mono">
                {gaps.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'radar'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Radar className="h-4 w-4 text-sky-400" />
              <span>RAD Vulnerability Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'matrix'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Table className="h-4 w-4 text-emerald-400" />
              <span>Literature Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('debates')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'debates'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Scale className="h-4 w-4 text-purple-400" />
              <span>Consensus & Contradictions</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'chat'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>RAG AI Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('papers')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'papers'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="h-4 w-4 text-teal-400" />
              <span>Paper Library</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px] font-mono">
                {papers.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Research Gaps & Novel Hypotheses */}
        {activeTab === 'gaps' && (
          <div className="space-y-5">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-bold text-slate-200">Filter Gaps:</span>
                
                {/* Category Selector */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="all">All Categories</option>
                  <option value="methodological">Methodological</option>
                  <option value="empirical">Empirical</option>
                  <option value="theoretical">Theoretical</option>
                  <option value="application">Application & Scale</option>
                  <option value="evaluation">Evaluation</option>
                </select>

                {/* Severity Selector */}
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="emerging">Emerging</option>
                  <option value="niche">Niche</option>
                </select>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Showing <strong>{filteredGaps.length}</strong> of {gaps.length} identified gaps</span>
                <button
                  onClick={() => setActiveTab('radar')}
                  className="text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  View Radar Diagram →
                </button>
              </div>
            </div>

            {/* Gap Cards List */}
            <div className="space-y-4">
              {filteredGaps.map(gap => (
                <GapCard
                  key={gap.id}
                  gap={gap}
                  papers={papers}
                  onOpenPitchModal={(g) => setActiveGapForPitch(g)}
                  onSelectPaper={(pid) => {
                    setSelectedPaperId(pid);
                    setActiveTab('papers');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: RAD Vulnerability Radar */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <RadarChart metrics={radarMetrics} corpusName={activeCorpus.name} />

            {/* Analytical Commentary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm mb-1.5">
                  <Flame className="h-4 w-4" /> Most Pressing Blindspot
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Scalability & Latency Wall:</strong> Multi-scale and recursive reasoning architectures incur an unsustainable 40× to 100× token multiplier, making real-time interactive deployment impossible without speculative pruning.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-sky-400 flex items-center gap-1.5 text-sm mb-1.5">
                  <Brain className="h-4 w-4" /> Epistemological Risk
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Parametric Stubbornness:</strong> LLMs consistently hallucinate on long-tail facts, overriding verified retrieved context in 42% of queries due to uncalibrated feed-forward priors.
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm mb-1.5">
                  <Sparkles className="h-4 w-4" /> Low-Hanging Research Fruit
                </span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Attention-Aware Reranking:</strong> Modulating retrieved document ordering to avoid the "Lost in the Middle" attention dead-zone can yield an immediate 28% gain with zero parameter updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Literature Matrix */}
        {activeTab === 'matrix' && (
          <LiteratureMatrix
            papers={papers}
            onSelectPaper={(pid) => {
              setSelectedPaperId(pid);
              setActiveTab('papers');
            }}
          />
        )}

        {/* Tab 4: Consensus & Contradictions */}
        {activeTab === 'debates' && (
          <ConsensusContradiction
            items={consensusItems}
            papers={papers}
            onSelectPaper={(pid) => {
              setSelectedPaperId(pid);
              setActiveTab('papers');
            }}
          />
        )}

        {/* Tab 5: RAG AI Assistant */}
        {activeTab === 'chat' && (
          <RagChat
            mode={mode}
            papers={papers}
            ragEngine={ragEngine}
            llmConfig={llmConfig}
            onSelectPaper={(pid) => {
              setSelectedPaperId(pid);
              setActiveTab('papers');
            }}
          />
        )}

        {/* Tab 6: Paper Library */}
        {activeTab === 'papers' && (
          <PaperLibrary
            papers={papers}
            onAddPaper={handleAddPaper}
            onRemovePaper={handleRemovePaper}
            corpora={SAMPLE_CORPORA}
            activeCorpus={activeCorpus}
            onSelectCorpus={handleSelectCorpus}
            selectedPaperId={selectedPaperId}
            onSelectPaper={setSelectedPaperId}
          />
        )}
      </main>

      {/* Pitch Modal */}
      {activeGapForPitch && (
        <NewHypothesisModal
          gap={activeGapForPitch}
          papers={papers}
          onClose={() => setActiveGapForPitch(null)}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          papers={papers}
          gaps={gaps}
          consensusItems={consensusItems}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          config={llmConfig}
          onSave={setLlmConfig}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
export default App;
