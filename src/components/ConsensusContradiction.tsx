import React, { useState } from 'react';
import { PaperConsensusItem, ResearchPaper } from '../types';
import { Scale, CheckCircle, XCircle, ArrowRight, Quote, Sparkles } from 'lucide-react';

interface ConsensusContradictionProps {
  items: PaperConsensusItem[];
  papers: ResearchPaper[];
  onSelectPaper: (paperId: string) => void;
}

export const ConsensusContradiction: React.FC<ConsensusContradictionProps> = ({
  items,
  papers,
  onSelectPaper
}) => {
  const [filter, setFilter] = useState<'all' | 'consensus' | 'contradiction'>('all');

  const filteredItems = items.filter(it => 
    filter === 'all' || it.type === filter
  );

  return (
    <div className="space-y-4">
      {/* Tab Filter */}
      <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="h-4 w-4 text-brand-400" />
            <span>Cross-Paper Consensus vs Contradiction Engine</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Surfaces epistemological agreements, active scientific debates, and clashing empirical findings
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('consensus')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'consensus' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Consensus ({items.filter(i => i.type === 'consensus').length})
          </button>
          <button
            onClick={() => setFilter('contradiction')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'contradiction' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Contradictions ({items.filter(i => i.type === 'contradiction').length})
          </button>
        </div>
      </div>

      {/* Grid of items */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isContradiction = item.type === 'contradiction';

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 shadow-lg transition-all ${
                isContradiction
                  ? 'bg-slate-800/90 border-rose-500/30 hover:border-rose-500/50'
                  : 'bg-slate-800/90 border-emerald-500/30 hover:border-emerald-500/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {isContradiction ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                      <XCircle className="h-3.5 w-3.5 text-rose-400" />
                      Direct Contradiction / Open Debate
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                      Literature Consensus
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {item.topic}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                {item.summary}
              </p>

              {/* Side-by-side stance arguments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.paperArguments.map((arg, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-700/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <button
                          onClick={() => onSelectPaper(arg.paperId)}
                          className="font-bold text-xs text-brand-300 hover:text-brand-200 text-left"
                        >
                          {arg.paperTitle}
                        </button>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isContradiction ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {arg.stance}
                        </span>
                      </div>

                      <blockquote className="italic text-xs text-slate-300 border-l-2 border-slate-600 pl-2.5 my-2">
                        "{arg.quote}"
                      </blockquote>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
