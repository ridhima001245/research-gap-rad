import React, { useState } from 'react';
import { ResearchGap, ResearchPaper } from '../types';
import { Sparkles, Copy, Check, FlaskConical, Target, ShieldCheck, Download, Award } from 'lucide-react';

interface NewHypothesisModalProps {
  gap: ResearchGap;
  papers: ResearchPaper[];
  onClose: () => void;
}

export const NewHypothesisModal: React.FC<NewHypothesisModalProps> = ({
  gap,
  papers,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  // Generate structured pitch
  const titleProposal = `Towards Resolving ${gap.title}: An Empirical & Architectural Framework`;
  
  const generateProposalText = () => {
    return `# Research Proposal & Grant Pitch
**Proposed Title:** ${titleProposal}
**Target Venues:** NeurIPS / ICLR / ACL / KDD
**Primary Focus:** ${gap.category.toUpperCase()} • Severity: ${gap.severity.toUpperCase()}

---

### 1. Executive Problem Statement
${gap.description}
Grounding evidence from active literature demonstrates that current systems suffer from critical trade-offs:
${gap.evidenceQuotes.map(eq => `> *"${eq.quote}"* — (${eq.paperTitle})`).join('\n')}

---

### 2. Core Research Questions
* **RQ1 (Theoretical Boundary):** What is the mathematical and architectural limit under which existing architectures fail to arbitrate ${gap.title.toLowerCase()}?
* **RQ2 (Empirical Efficacy):** To what extent does the proposed intervention restore benchmark fidelity and eliminate known failure modes without introducing quadratic latency?

---

### 3. Formal Research Hypothesis
"${gap.suggestedHypothesis}"

---

### 4. Proposed 3-Phase Experimental Methodology
* **Phase 1: Diagnostic Profiling & Synthetic Probing (Months 1-2):**
  Construct a fine-grained evaluation probe isolating the exact failure mode across baseline architectures (${gap.affectedPaperIds.join(', ')}).
* **Phase 2: Architectural Formulation & Training (Months 3-4):**
  Implement ${gap.proposedMethodology}.
* **Phase 3: Cross-Domain Benchmark Stress-Testing (Months 5-6):**
  Validate against ${gap.recommendedEvaluation}.

---

### 5. Expected Scientific Contribution & Impact
${gap.expectedContribution}

---

### 6. Risk Mitigation & Feasibility Bounds (Feasibility Score: ${gap.feasibilityScore}/10)
* **Risk:** High computational overhead during multi-step inference.
* **Mitigation Strategy:** Speculative early-exit decoding and adaptive threshold pruning to guarantee linear latency scaling.
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateProposalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Formulated Grant & Thesis Proposal Pitch
              </h3>
              <p className="text-xs text-slate-400">
                Actionable academic roadmap derived from {gap.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Proposal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-200 leading-relaxed">
          {/* Title Card */}
          <div className="bg-gradient-to-r from-brand-950/60 via-slate-800/80 to-indigo-950/50 p-4 rounded-2xl border border-brand-500/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 font-mono">
              Working Paper Title
            </span>
            <h4 className="text-base font-extrabold text-white mt-1">
              {titleProposal}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono">
                Target: NeurIPS / ICLR / ACL
              </span>
              <span>•</span>
              <span className="text-amber-400 font-mono">Novelty Index: {gap.noveltyScore}/10</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">Feasibility: {gap.feasibilityScore}/10</span>
            </div>
          </div>

          {/* Research Hypothesis Box */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70">
            <h5 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              Core Tested Hypothesis
            </h5>
            <blockquote className="italic text-slate-200 border-l-2 border-brand-500 pl-3 my-2 text-xs sm:text-sm">
              "{gap.suggestedHypothesis}"
            </blockquote>
          </div>

          {/* 3-Phase Experimental Methodology */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="h-3.5 w-3.5 text-emerald-400" />
              Structured 3-Phase Execution Roadmap
            </h5>

            <div className="space-y-2">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-3">
                <span className="font-mono font-bold text-brand-400 text-xs">Phase 1</span>
                <div>
                  <h6 className="font-semibold text-white text-xs">Diagnostic Profiling & Benchmark Extraction</h6>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Isolate failure conditions and baseline limitations across {gap.affectedPaperIds.length} target papers.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-3">
                <span className="font-mono font-bold text-emerald-400 text-xs">Phase 2</span>
                <div>
                  <h6 className="font-semibold text-white text-xs">Algorithm Implementation & Prototyping</h6>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {gap.proposedMethodology}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 flex gap-3">
                <span className="font-mono font-bold text-purple-400 text-xs">Phase 3</span>
                <div>
                  <h6 className="font-semibold text-white text-xs">Validation, Ablation & Leaderboard Verification</h6>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {gap.recommendedEvaluation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Scientific Contribution */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" />
              Scientific & Field Impact
            </h5>
            <p className="text-xs text-slate-300">
              {gap.expectedContribution}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/80 flex items-center justify-between bg-slate-900/90">
          <span className="text-xs text-slate-400">
            Ready to integrate into NSF, ERC, or PhD thesis prospectus
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied Pitch' : 'Copy Pitch Markdown'}</span>
            </button>

            <button
              onClick={onClose}
              className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
