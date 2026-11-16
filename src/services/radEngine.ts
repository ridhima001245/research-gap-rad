import { ResearchPaper, ResearchGap, GapCategory, GapSeverity } from '../types';

export interface RadarMetrics {
  methodologicalRigor: number; // 0-100
  datasetDiversity: number;    // 0-100
  theoreticalDepth: number;    // 0-100
  scalabilityEfficiency: number; // 0-100
  benchmarkReproducibility: number; // 0-100
}

export class RadEngine {
  /**
   * Rapidly computes 5-axis research health radar metrics across the loaded corpus
   */
  public static computeCorpusRadar(papers: ResearchPaper[]): RadarMetrics {
    if (!papers || papers.length === 0) {
      return {
        methodologicalRigor: 50,
        datasetDiversity: 50,
        theoreticalDepth: 50,
        scalabilityEfficiency: 50,
        benchmarkReproducibility: 50
      };
    }

    let rigorSum = 0;
    let dataSum = 0;
    let theorySum = 0;
    let scaleSum = 0;
    let reproSum = 0;

    for (const paper of papers) {
      const fullText = (
        paper.abstract + ' ' + 
        paper.metadata.methodology + ' ' + 
        paper.metadata.datasetOrBenchmark + ' ' +
        paper.metadata.explicitLimitations.join(' ')
      ).toLowerCase();

      // Methodological Rigor: Controlled benchmarks, ablation studies, statistical tests
      let paperRigor = 65;
      if (fullText.includes('ablation') || fullText.includes('controlled') || fullText.includes('statistically significant')) paperRigor += 15;
      if (fullText.includes('baseline') && fullText.includes('comparison')) paperRigor += 10;
      rigorSum += Math.min(paperRigor, 98);

      // Dataset Diversity: Multi-domain vs single benchmark
      let paperData = 60;
      if (paper.metadata.datasetOrBenchmark.split(',').length >= 3) paperData += 20;
      if (fullText.includes('cross-domain') || fullText.includes('out-of-distribution') || fullText.includes('multi-lingual')) paperData += 15;
      if (fullText.includes('limited to short-form') || fullText.includes('single domain')) paperData -= 15;
      dataSum += Math.max(35, Math.min(paperData, 95));

      // Theoretical Depth: Mathematical formulation, bounds, mechanistic explanations
      let paperTheory = 55;
      if (fullText.includes('theorem') || fullText.includes('proof') || fullText.includes('formal') || fullText.includes('mechanistic')) paperTheory += 25;
      if (fullText.includes('empirical diagnostic') || fullText.includes('heuristic')) paperTheory += 5;
      theorySum += Math.min(paperTheory, 95);

      // Scalability / Efficiency: Compute demands, latency, memory bounds
      let paperScale = 65;
      if (fullText.includes('latency overhead') || fullText.includes('computationally intensive') || fullText.includes('40x to 100x')) paperScale -= 25;
      if (fullText.includes('lightweight') || fullText.includes('reducing retrieval calls') || fullText.includes('low latency')) paperScale += 20;
      scaleSum += Math.max(30, Math.min(paperScale, 92));

      // Benchmark Reproducibility: Open datasets, artifacts, hardware specs
      let paperRepro = 70;
      if (paper.metadata.hardwareOrCompute) paperRepro += 15;
      if (paper.doi || paper.venue.includes('NeurIPS') || paper.venue.includes('ICLR') || paper.venue.includes('ACL')) paperRepro += 10;
      reproSum += Math.min(paperRepro, 98);
    }

    const n = papers.length;
    return {
      methodologicalRigor: Math.round(rigorSum / n),
      datasetDiversity: Math.round(dataSum / n),
      theoreticalDepth: Math.round(theorySum / n),
      scalabilityEfficiency: Math.round(scaleSum / n),
      benchmarkReproducibility: Math.round(reproSum / n)
    };
  }

  /**
   * RAD Fast Heuristic Gap Triage (<50ms execution)
   * Rapidly identifies critical unaddressed problem spaces across papers
   */
  public static extractGapsRapidly(papers: ResearchPaper[]): ResearchGap[] {
    const gaps: ResearchGap[] = [];

    // 1. Check for cross-paper limitation patterns
    const limitationBank: { paperId: string; paperTitle: string; limitation: string }[] = [];
    papers.forEach(p => {
      p.metadata.explicitLimitations.forEach(lim => {
        limitationBank.push({
          paperId: p.id,
          paperTitle: p.title,
          limitation: lim
        });
      });
    });

    // Pattern A: High Latency / Compute Scalability Gap
    const scaleIssues = limitationBank.filter(l => 
      /latency|overhead|computationally intensive|expensive|40x|100x|token consumption/i.test(l.limitation)
    );
    if (scaleIssues.length > 0) {
      gaps.push({
        id: `rad-gap-compute-${Date.now()}`,
        title: 'Compute Scaling Wall & High Inference Latency in Advanced Architectural Paradigms',
        category: 'application',
        severity: 'critical',
        description: `Multiple papers (${scaleIssues.map(s => s.paperTitle.split(':')[0]).join(', ')}) report prohibitive computational overhead and latency bottlenecks during multi-step inference and recursive traversal.`,
        affectedPaperIds: scaleIssues.map(s => s.paperId),
        noveltyScore: 8.6,
        feasibilityScore: 9.1,
        urgencyScore: 9.4,
        evidenceQuotes: scaleIssues.map(s => ({
          paperId: s.paperId,
          paperTitle: s.paperTitle,
          section: 'Explicit Limitations',
          quote: s.limitation,
          relevanceExplanation: 'Direct admission of computational efficiency barrier.'
        })),
        suggestedHypothesis: 'Dynamic early-exit pruning coupled with multi-tier speculative caching will reduce reasoning inference steps by >50% while preserving benchmark fidelity within 1.5%.',
        proposedMethodology: 'Formulate an Adaptive Trajectory Pruner (ATP) that evaluates intermediate semantic divergence and terminates unpromising branches early.',
        expectedContribution: 'An open-source runtime kernel for low-latency academic and production deployments.',
        recommendedEvaluation: 'Profile latency distributions and FLOPS across standard benchmarks under varied token budgets.'
      });
    }

    // Pattern B: Out-of-Distribution / Narrow Evaluation Gap
    const oodIssues = limitationBank.filter(l => 
      /short-form|narrow|constrained|synthetic|extractive|untested|generalization/i.test(l.limitation)
    );
    if (oodIssues.length > 0) {
      gaps.push({
        id: `rad-gap-eval-${Date.now() + 1}`,
        title: 'Benchmark Overfitting and Narrow Evaluation on Short-Form Extractive QA',
        category: 'empirical',
        severity: 'emerging',
        description: `Existing evaluations predominantly target short, synthetic or extractive datasets, failing to prove robustness on messy real-world longitudinal documents and open-ended synthesis.`,
        affectedPaperIds: oodIssues.map(s => s.paperId),
        noveltyScore: 8.0,
        feasibilityScore: 8.7,
        urgencyScore: 8.5,
        evidenceQuotes: oodIssues.map(s => ({
          paperId: s.paperId,
          paperTitle: s.paperTitle,
          section: 'Methodology & Limitations',
          quote: s.limitation,
          relevanceExplanation: 'Demonstrates limited empirical scope of current validation protocols.'
        })),
        suggestedHypothesis: 'Constructing an adversarial, multi-hop longitudinal benchmark spanning conflicting real-world reports will reveal catastrophic failure modes unobserved in existing QA leaderboards.',
        proposedMethodology: 'Curate a 1,000-sample expert-annotated LongDoc-Conflict benchmark pairing historical corporate filings, clinical trial discrepancies, and legal appeals.',
        expectedContribution: 'A standard evaluation suite for diagnosing multi-document temporal and factual discrepancies.',
        recommendedEvaluation: 'Zero-shot and few-shot evaluation across leading commercial and open-weight models on LongDoc-Conflict.'
      });
    }

    // Pattern C: Verification / Grounding Gap
    const verifyIssues = limitationBank.filter(l => 
      /feedback|oracle|sycophancy|dogmatic|override|hallucination|verification/i.test(l.limitation)
    );
    if (verifyIssues.length > 0) {
      gaps.push({
        id: `rad-gap-verify-${Date.now() + 2}`,
        title: 'Lack of Non-Parametric Epistemic Verification and Grounded Faithfulness',
        category: 'methodological',
        severity: 'critical',
        description: `Models exhibit severe grounding degradation when parametric priors clash with retrieved passages or when attempting self-correction without deterministic external verifiers.`,
        affectedPaperIds: verifyIssues.map(s => s.paperId),
        noveltyScore: 9.3,
        feasibilityScore: 7.6,
        urgencyScore: 9.6,
        evidenceQuotes: verifyIssues.map(s => ({
          paperId: s.paperId,
          paperTitle: s.paperTitle,
          section: 'Core Analysis',
          quote: s.limitation,
          relevanceExplanation: 'Proves the absence of self-contained epistemic truth criteria.'
        })),
        suggestedHypothesis: 'Decoupling claim extraction from semantic entailment checking using neuro-symbolic logic engines eliminates hallucinated confirmation bias.',
        proposedMethodology: 'Implement a Dual-Stream Grounding Pipeline separating generative hypothesis formulation from deductive formal verification.',
        expectedContribution: 'A mathematically provable faithfulness guarantee for safety-critical knowledge applications.',
        recommendedEvaluation: 'FactScore, MedQA, and FreshQA with human-in-the-loop double-blind verification.'
      });
    }

    return gaps;
  }
}
