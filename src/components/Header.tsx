import React from 'react';
import { AnalysisMode, CorpusCollection, LLMConfig } from '../types';
import { 
  Zap, 
  Brain, 
  Sliders, 
  Download, 
  BookOpen, 
  Layers, 
  Sparkles,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
  activeCorpus: CorpusCollection;
  corpora: CorpusCollection[];
  onSelectCorpus: (corpus: CorpusCollection) => void;
  llmConfig: LLMConfig;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  activeCorpus,
  corpora,
  onSelectCorpus,
  llmConfig,
  onOpenSettings,
  onOpenExport
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Scholar<span className="text-brand-400">RAD</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30">
                v2.4 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Literature Review & Research Gap Synthesis
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (RAD vs RAG) */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            onClick={() => setMode('rad')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === 'rad'
                ? 'bg-gradient-to-r from-rad-500 to-amber-500 text-white shadow-md shadow-rad-500/25 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Rapid Analysis & Discovery: sub-second heuristic extraction and visual gap radar"
          >
            <Zap className={`h-3.5 w-3.5 ${mode === 'rad' ? 'text-white fill-white' : 'text-amber-400'}`} />
            <span>RAD Mode</span>
            <span className="text-[10px] opacity-80 font-mono hidden md:inline">⚡ Fast</span>
          </button>

          <button
            onClick={() => setMode('rag')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              mode === 'rag'
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Retrieval-Augmented Deep Synthesis: multi-chunk semantic search and token-grounded citations"
          >
            <Brain className={`h-3.5 w-3.5 ${mode === 'rag' ? 'text-white' : 'text-brand-400'}`} />
            <span>Deep RAG</span>
            <span className="text-[10px] opacity-80 font-mono hidden md:inline">🔬 Grounded</span>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Corpus Dropdown */}
          <div className="relative hidden lg:block">
            <select
              value={activeCorpus.id}
              onChange={(e) => {
                const selected = corpora.find(c => c.id === e.target.value);
                if (selected) onSelectCorpus(selected);
              }}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg pl-3 pr-8 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none"
            >
              {corpora.map(c => (
                <option key={c.id} value={c.id}>
                  📚 {c.name.length > 28 ? c.name.slice(0, 28) + '...' : c.name}
                </option>
              ))}
            </select>
            <Layers className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Engine Status Tag */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs border border-slate-700 transition"
            title="Configure LLM model and API keys"
          >
            <Cpu className="h-3.5 w-3.5 text-brand-400" />
            <span className="hidden sm:inline font-mono">
              {llmConfig.provider === 'simulated' ? 'Local Neural' : llmConfig.provider.toUpperCase()}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm transition shadow-brand-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Review</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Application Settings"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
