import React, { useState } from 'react';
import { ResearchGap, ResearchPaper } from '../types';
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Quote, 
  ArrowRight, 
  Check, 
  Lightbulb, 
  FlaskConical,
  Award,
  BookOpen
} from 'lucide-react';

interface GapCardProps {
  gap: ResearchGap;
  papers: ResearchPaper[];
  onOpenPitchModal: (gap: ResearchGap) => void;
  onSelectPaper: (paperId: string) => void;
}

export const GapCard: React.FC<GapCardProps> = ({
  gap,
  papers,
  onOpenPitchModal,
  onSelectPaper
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Category color mapper
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'methodological':
        return { label: 'Methodological Gap', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      case 'empirical':
        return { label: 'Empirical Gap', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'theoretical':
        return { label: 'Theoretical Gap', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'application':
        return { label: 'Application & Scale', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'Evaluation Gap', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'emerging':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const catBadge = getCategoryBadge(gap.category);

  const handleCopyHypothesis = () => {
    navigator.clipboard.writeText(gap.suggestedHypothesis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-brand-500/5">
      {/* Top Banner */}
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catBadge.bg}`}>
              {catBadge.label}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getSeverityBadge(gap.severity)}`}>
              {gap.severity}
            </span>
          </div>

          {/* Metric Pills */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-slate-300 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-500">Novelty:</span>
              <span className="font-bold text-amber-400">{gap.noveltyScore}/10</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-500">Feasibility:</span>
              <span className="font-bold text-emerald-400">{gap.feasibilityScore}/10</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-500">Urgency:</span>
              <span className="font-bold text-brand-400">{gap.urgencyScore}/10</span>
            </div>
          </div>
        </div>

        {/* Gap Title */}
        <h3 className="text-base font-bold text-white mb-2 leading-snug">
          {gap.title}
        </h3>

        {/* Gap Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {gap.description}
        </p>

        {/* Affected Papers Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <BookOpen className="h-3 w-3" /> Affected Corpus:
          </span>
          {gap.affectedPaperIds.map(pid => {
            const paper = papers.find(p => p.id === pid);
            return (
              <button
                key={pid}
                onClick={() => onSelectPaper(pid)}
                className="text-xs bg-slate-900/90 hover:bg-brand-900/40 text-brand-300 hover:text-brand-200 px-2.5 py-1 rounded-lg border border-slate-700/60 hover:border-brand-500/40 transition flex items-center gap-1.5"
                title={paper?.title}
              >
                <span>{paper ? paper.title.split(':')[0] : pid}</span>
                <span className="text-[10px] text-slate-500">({paper?.year || '2024'})</span>
              </button>
            );
          })}
        </div>

        {/* AI Suggested Hypothesis Callout Box */}
        <div className="bg-gradient-to-r from-brand-950/60 via-slate-900/70 to-indigo-950/50 rounded-xl p-4 border border-brand-500/25 relative mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>AI-Formulated Novel Research Hypothesis</span>
            </div>
            <button
              onClick={handleCopyHypothesis}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded transition"
              title="Copy hypothesis to clipboard"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : null}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 font-sans italic leading-relaxed">
            "{gap.suggestedHypothesis}"
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 py-1 transition"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 text-brand-400" />
                <span>Hide Grounded Evidence & Methodology</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-brand-400" />
                <span>Inspect Evidence Quotes ({gap.evidenceQuotes.length}) & Proposed Method</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenPitchModal(gap)}
            className="text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg shadow-sm shadow-brand-500/20 flex items-center gap-1.5 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Formulate Research Pitch</span>
          </button>
        </div>
      </div>

      {/* Expandable Grounded Evidence & Experimental Methodology Drawer */}
      {isExpanded && (
        <div className="bg-slate-900/90 border-t border-slate-700/80 p-5 space-y-4 animate-fadeIn">
          {/* Grounded Evidence Quotes from actual papers */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Quote className="h-3.5 w-3.5 text-brand-400" />
              <span>Grounded Literature Evidence & Explicit Admissions</span>
            </h4>
            <div className="space-y-2.5">
              {gap.evidenceQuotes.map((eq, i) => (
                <div key={i} className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/70 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-brand-300">{eq.paperTitle}</span>
                    <span className="font-mono text-[11px] text-slate-500">{eq.section}</span>
                  </div>
                  <blockquote className="italic text-slate-200 border-l-2 border-brand-500 pl-2.5 my-1.5">
                    "{eq.quote}"
                  </blockquote>
                  <p className="text-[11px] text-slate-400 mt-1">
                    <span className="font-semibold text-slate-300">Why this creates a gap: </span>
                    {eq.relevanceExplanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Proposed Methodology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
                <span>Proposed Experimental Methodology</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {gap.proposedMethodology}
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1.5">
                <Award className="h-3.5 w-3.5 text-purple-400" />
                <span>Expected Scientific Contribution</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {gap.expectedContribution}
              </p>
            </div>
          </div>

          {/* Recommended Evaluation */}
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 text-xs">
            <span className="font-bold text-slate-300">Recommended Validation Benchmarks: </span>
            <span className="text-slate-400">{gap.recommendedEvaluation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
