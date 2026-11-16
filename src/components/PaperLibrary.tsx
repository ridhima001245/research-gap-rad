import React, { useState } from 'react';
import { ResearchPaper, CorpusCollection } from '../types';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  User, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PaperLibraryProps {
  papers: ResearchPaper[];
  onAddPaper: (paper: ResearchPaper) => void;
  onRemovePaper: (paperId: string) => void;
  corpora: CorpusCollection[];
  activeCorpus: CorpusCollection;
  onSelectCorpus: (corpus: CorpusCollection) => void;
  selectedPaperId: string | null;
  onSelectPaper: (paperId: string | null) => void;
}

export const PaperLibrary: React.FC<PaperLibraryProps> = ({
  papers,
  onAddPaper,
  onRemovePaper,
  corpora,
  activeCorpus,
  onSelectCorpus,
  selectedPaperId,
  onSelectPaper
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newVenue, setNewVenue] = useState('arXiv');
  const [newAbstract, setNewAbstract] = useState('');
  const [newMethodology, setNewMethodology] = useState('');
  const [newDataset, setNewDataset] = useState('');
  const [newFindings, setNewFindings] = useState('');
  const [newLimitations, setNewLimitations] = useState('');

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const paper: ResearchPaper = {
      id: `custom-paper-${Date.now()}`,
      title: newTitle.trim(),
      authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
      year: parseInt(newYear) || 2024,
      venue: newVenue.trim() || 'Preprint',
      category: 'User Added / Custom Paper',
      keywords: ['Custom', 'Literature Review'],
      abstract: newAbstract.trim() || 'No abstract provided.',
      metadata: {
        coreObjective: newTitle,
        methodology: newMethodology.trim() || 'Empirical evaluation and comparative analysis',
        datasetOrBenchmark: newDataset.trim() || 'Standard domain benchmark',
        primaryFindings: newFindings.trim() || 'Evaluated proposed architecture against baseline systems.',
        explicitLimitations: newLimitations.split('\n').map(l => l.trim()).filter(Boolean).length > 0
          ? newLimitations.split('\n').map(l => l.trim()).filter(Boolean)
          : ['Generalization to out-of-distribution domains requires further empirical validation.'],
        suggestedFutureWork: ['Explore cross-domain transferability and computational profiling.']
      }
    };

    onAddPaper(paper);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewAuthors('');
    setNewAbstract('');
    setNewMethodology('');
    setNewDataset('');
    setNewFindings('');
    setNewLimitations('');
  };

  const selectedPaper = papers.find(p => p.id === selectedPaperId);

  return (
    <div className="space-y-5">
      {/* Top Corpus Switcher Banner */}
      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
            Active Research Corpus
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            {activeCorpus.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {activeCorpus.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {corpora.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectCorpus(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                c.id === activeCorpus.id
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {c.name.split(' ')[0]}...
            </button>
          ))}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Paper</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Papers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers.map((paper) => (
          <div
            key={paper.id}
            onClick={() => onSelectPaper(paper.id)}
            className={`rounded-2xl border p-4.5 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPaperId === paper.id
                ? 'bg-slate-800 border-brand-500 ring-2 ring-brand-500/30 shadow-xl'
                : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="flex items-center gap-1 font-mono text-[11px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                  <Calendar className="h-3 w-3" /> {paper.year}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {paper.venue}
                </span>
              </div>

              <h4 className="font-bold text-white text-sm mb-1.5 line-clamp-2 leading-snug">
                {paper.title}
              </h4>

              <div className="text-[11px] text-slate-400 mb-2.5 flex items-center gap-1">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{paper.authors.join(', ')}</span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                {paper.abstract}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[10px] text-amber-300 font-mono">
                {paper.metadata.explicitLimitations.length} Stated Limitations
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPaper(paper.id);
                }}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                Inspect Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Paper Deep View Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-md">
                  {selectedPaper.venue} • {selectedPaper.year}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 leading-tight">
                  {selectedPaper.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authors: {selectedPaper.authors.join(', ')}
                </p>
              </div>

              <button
                onClick={() => onSelectPaper(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Abstract */}
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Abstract
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedPaper.abstract}
              </p>
            </div>

            {/* Structured Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                <h6 className="text-xs font-bold text-brand-400 mb-1">Methodology</h6>
                <p className="text-xs text-slate-300">{selectedPaper.metadata.methodology}</p>
              </div>

              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
                <h6 className="text-xs font-bold text-brand-400 mb-1">Dataset / Benchmarks</h6>
                <p className="text-xs text-slate-300">{selectedPaper.metadata.datasetOrBenchmark}</p>
              </div>
            </div>

            {/* Primary Findings */}
            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20">
              <h6 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Primary Empirical Findings
              </h6>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedPaper.metadata.primaryFindings}
              </p>
            </div>

            {/* Explicit Limitations / Gaps */}
            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/20">
              <h6 className="text-xs font-bold text-amber-400 mb-1.5">
                Explicit Limitations & Vulnerabilities Disclosed by Authors
              </h6>
              <ul className="space-y-1.5 list-disc list-inside text-xs text-amber-200">
                {selectedPaper.metadata.explicitLimitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onSelectPaper(null)}
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs px-5 py-2 rounded-xl font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Paper Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-400" />
                <span>Ingest Research Paper to Library</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph-based Multihop Reasoning with Knowledge Decoupling"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Authors (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. J. Doe, A. Smith"
                    value={newAuthors}
                    onChange={e => setNewAuthors(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Publication Year & Venue</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newYear}
                      onChange={e => setNewYear(e.target.value)}
                      className="w-20 bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                    />
                    <input
                      type="text"
                      placeholder="Venue (e.g. ICLR)"
                      value={newVenue}
                      onChange={e => setNewVenue(e.target.value)}
                      className="flex-1 bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Abstract</label>
                <textarea
                  rows={3}
                  placeholder="Paste abstract here..."
                  value={newAbstract}
                  onChange={e => setNewAbstract(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Methodology</label>
                  <input
                    type="text"
                    placeholder="e.g. Contrastive decoding with dynamic pruning"
                    value={newMethodology}
                    onChange={e => setNewMethodology(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dataset / Benchmarks</label>
                  <input
                    type="text"
                    placeholder="e.g. HotpotQA, GSM8K"
                    value={newDataset}
                    onChange={e => setNewDataset(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Known Limitations / Stated Flaws (1 per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fails under out-of-distribution entity shifts"
                  value={newLimitations}
                  onChange={e => setNewLimitations(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
