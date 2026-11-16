import { CorpusCollection, ResearchGap, PaperConsensusItem } from '../types';

export const SAMPLE_CORPORA: CorpusCollection[] = [
  {
    id: 'rag-hallucination',
    name: 'RAG & Hallucination Mitigation in LLMs',
    field: 'Natural Language Processing & Information Retrieval',
    description: 'Investigates retrieval fidelity, parametric memory conflicts, context compression, and real-time fact-checking in Large Language Models.',
    iconName: 'Database',
    papers: [
      {
        id: 'paper-rag-1',
        title: 'Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection',
        authors: ['Akari Asai', 'Zeqiu Wu', 'Yizhong Wang', 'Avirup Sil', 'Hannaneh Hajishirzi'],
        year: 2024,
        venue: 'ICLR 2024 (Oral)',
        category: 'Information Retrieval / LLM Reasoning',
        keywords: ['Retrieval-Augmented Generation', 'Self-Reflection', 'Critique Tokens', 'Factuality'],
        abstract: 'Despite the remarkable capabilities of Large Language Models (LLMs), they frequently produce factually incorrect statements or hallucinations. Retrieval-Augmented Generation (RAG) mitigates this by fetching relevant documents, but indiscriminate retrieval often introduces noisy, irrelevant context that degrades generation quality. We introduce Self-RAG, a framework that trains a single LLM to selectively retrieve on-demand and evaluate both retrieved passages and its own generations through special reflection tokens. Self-RAG significantly outperforms standard RAG and LLMs across open-domain QA, reasoning, and fact verification.',
        metadata: {
          coreObjective: 'Enable LLMs to selectively invoke retrieval and critique retrieved facts dynamically without external orchestrators.',
          methodology: 'Fine-tuning with specialized reflection tokens ([Retrieve], [IsRel], [IsSup], [IsUse]) generated via a critic model trained on synthetic preference feedback.',
          datasetOrBenchmark: 'PopQA, TriviaQA, PubHealth, ARC-Challenge, FactScore',
          primaryFindings: 'Self-RAG (7B & 13B) achieves 7.3% higher citation precision and 12.4% higher factual accuracy than ChatGPT on open-domain medical and knowledge tasks while reducing retrieval calls by 42%.',
          explicitLimitations: [
            'Requires specialized pre-training and fine-tuning with custom tokens, making it incompatible with closed proprietary API models like GPT-4.',
            'Reflection token prediction adds a 15-25% latency overhead during greedy decoding when high retrieval density is triggered.',
            'Evaluated primarily on short-form question answering; behavior on complex multi-hop longitudinal documents remains untested.'
          ],
          suggestedFutureWork: [
            'Extending critique tokens to streaming long-context inputs.',
            'Investigating multi-agent negotiation between retrieval critic and generator.'
          ],
          hardwareOrCompute: '8x NVIDIA A100 (80GB) for 48 hours for 7B/13B parameter checkpoints.'
        }
      },
      {
        id: 'paper-rag-2',
        title: 'Lost in the Middle: How Language Models Use Long Contexts',
        authors: ['Nelson F. Liu', 'Kevin Lin', 'John Hewitt', 'Ashwin Paranjape', 'Michele Bevilacqua', 'Fabio Petroni', 'Percy Liang'],
        year: 2024,
        venue: 'Transactions of the ACL (TACL)',
        category: 'Long-Context LLMs / Attention Mechanics',
        keywords: ['Long Context', 'Positional Bias', 'Lost in the Middle', 'Multi-document QA'],
        abstract: 'While recent language models can accept inputs spanning tens of thousands of tokens, how effectively models utilize long contexts remains poorly understood. In this work, we analyze model performance across diverse key-value retrieval and multi-document QA tasks with varied answer locations. We uncover a pervasive U-shaped performance curve: LLM performance is highest when relevant information occurs at the absolute beginning or end of the input context, and degrades significantly when relevant information is situated in the middle. This effect holds across both open-weight and closed commercial models.',
        metadata: {
          coreObjective: 'Empirically quantify and diagnose position-dependent attention degradation in long-context LLMs and RAG document rerankers.',
          methodology: 'Controlled multi-document permutation experiments inserting gold answer passages at varying normalized context depths (0.0 to 1.0) amid distractor documents.',
          datasetOrBenchmark: 'NaturalQuestions-Open, MS-MARCO, Synthetic Key-Value Retrieval',
          primaryFindings: 'Accuracy drops by up to 34.6% when the relevant passage is positioned in the middle third of the context window, even in models explicitly fine-tuned for 32k+ tokens.',
          explicitLimitations: [
            'Analysis is focused on extractive QA; synthetic summarization and code generation might exhibit distinct positional biases.',
            'Does not propose an algorithmic architecture to eradicate the U-curve, serving as an empirical diagnostic rather than a mitigation technique.',
            'Distractor documents used were randomly shuffled rather than semantically adversarial.'
          ],
          suggestedFutureWork: [
            'Developing position-invariant attention mechanisms or dynamically weighted rotary positional embeddings (RoPE).',
            'Context-aware rerankers that place high-salience chunks at extremes.'
          ]
        }
      },
      {
        id: 'paper-rag-3',
        title: 'CRAG: Corrective Retrieval Augmented Generation',
        authors: ['Shi-Qi Yan', 'Jia-Chen Gu', 'Yun-Zhuo Zhu', 'Zhen-Hua Ling'],
        year: 2024,
        venue: 'arXiv preprint / NeurIPS 2024',
        category: 'Retrieval Augmentation / Quality Control',
        keywords: ['Corrective RAG', 'Confidence Estimation', 'Web Fallback', 'Information Filtering'],
        abstract: 'Standard RAG systems assume retrieved documents are undeniably accurate and relevant. When retrieval fails or retrieves contaminated documents, generation suffers severe degradation. We propose Corrective Retrieval-Augmented Generation (CRAG) to address retrieval vulnerability. CRAG introduces a lightweight retrieval evaluator to quantify confidence in retrieved passages. Based on confidence tiers (Correct, Ambiguous, Incorrect), it either executes fine-grained internal knowledge decomposition, triggers external web search queries, or strips irrelevant noise.',
        metadata: {
          coreObjective: 'Implement a self-correcting retrieval safety-gate that dynamically switches between local corpus decomposition and live web fallback.',
          methodology: 'Trained a lightweight T5-based retrieval evaluator scoring confidence scores; decomposed documents into sub-sentence strips filtered by TF-IDF and cross-encoder scores.',
          datasetOrBenchmark: 'PopQA, BiographyQA, PubHealth, Arc-Challenge',
          primaryFindings: 'CRAG improves factuality by 14.9% over standard RAG and prevents catastrophic hallucination when local corpus exhibits high domain drift.',
          explicitLimitations: [
            'Dependent on an external search engine (e.g. Google Search API) for the fallback tier, introducing latency, economic cost, and dependency on external web availability.',
            'The threshold tuning between Correct, Ambiguous, and Incorrect is highly sensitive and requires manual calibration per domain.',
            'Sub-sentence stripping can sever vital anaphoric references and cross-clause qualifying conditions.'
          ],
          suggestedFutureWork: [
            'End-to-end differentiable confidence calibrator that adapts thresholds without manual grid search.',
            'Privacy-preserving synthetic fallback generator without external web leaks.'
          ]
        }
      },
      {
        id: 'paper-rag-4',
        title: 'When Not to Trust Language Models: Investigating Parametric vs Non-Parametric Conflicts',
        authors: ['Alex Mallen', 'Akari Asai', 'Victor Zhong', 'Rajesh Rao', 'Hannaneh Hajishirzi'],
        year: 2023,
        venue: 'ACL 2023',
        category: 'Knowledge Conflicts / Factual Memorization',
        keywords: ['Parametric Memory', 'Knowledge Conflicts', 'Long-tail Facts', 'Hallucination'],
        abstract: 'Large Language Models rely on two distinct knowledge sources: parametric memory acquired during pre-training, and non-parametric context provided at inference time (e.g., via RAG). When retrieved context directly contradicts internal parametric priors, models frequently oscillate unpredictably. We present a systematic study measuring model behavior across high-frequency head entities versus low-frequency tail entities, demonstrating that LLMs stubbornly cling to hallucinations on long-tail facts even when explicitly given correct contradictory evidence in the prompt.',
        metadata: {
          coreObjective: 'Characterize failure conditions when LLM internal memory clashes with retrieved external evidence.',
          methodology: 'Subject-entity frequency stratification across Wikipedia page views paired with counterfactual and factual prompt perturbations across LLaMA, GPT-3.5, and PaLM.',
          datasetOrBenchmark: 'PopQA, EntityQuestions, Wikidata Tail-Probe',
          primaryFindings: 'LLMs override correct retrieved context with wrong internal memories in over 42% of long-tail queries, exhibiting an inverse scaling law where larger models are more dogmatic.',
          explicitLimitations: [
            'Focused solely on single-hop entity property retrieval (e.g. birth dates, author names), leaving complex multi-premise reasoning unanalyzed.',
            'Did not explore mechanistic interpretability circuits (e.g. induction heads) responsible for the stubbornness phenomenon.',
            'Prompting interventions (e.g., "Ignore prior beliefs") had minimal and inconsistent effect on model adherence.'
          ],
          suggestedFutureWork: [
            'Activation patching and representation engineering to modulate parametric memory suppression.',
            'Attribution-guided decoding that enforces strict non-parametric grounding.'
          ]
        }
      },
      {
        id: 'paper-rag-5',
        title: 'RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval',
        authors: ['Parth Sarthi', 'Salman Abdullah', 'Aditi Tuli', 'Shwetrajna Shrivastava', 'Graham Neubig'],
        year: 2024,
        venue: 'ICLR 2024',
        category: 'Hierarchical Retrieval / Long-Doc RAG',
        keywords: ['Tree Structured RAG', 'Recursive Summarization', 'Global Context', 'Clustering'],
        abstract: 'Existing retrieval-augmented generation methods predominantly retrieve small, contiguous text chunks, precluding the model from grasping holistic themes, narrative arcs, and macro-level thematic connections across lengthy books or corpora. We introduce RAPTOR, a novel tree-organized retrieval strategy that recursively clusters and summarizes text chunks bottom-up. At query time, RAPTOR traverses this multi-scale abstraction tree, retrieving both high-level semantic summaries and granular text snippets simultaneously.',
        metadata: {
          coreObjective: 'Enable multi-layered thematic and holistic corpus querying by building recursive summarization trees.',
          methodology: 'Gaussian Mixture Models (GMM) with soft clustering of text embeddings, followed by recursive LLM summarization until a root node is reached.',
          datasetOrBenchmark: 'QASPER, NarrativeQA, QuALITY, GovReport',
          primaryFindings: 'Outperforms standard dense retrieval on complex holistic questions by up to 20% absolute accuracy, unlocking comprehension of 50k+ token documents without massive context windows.',
          explicitLimitations: [
            'Offline tree indexing is computationally intensive: building the recursive cluster tree for a 100-page book requires significant LLM summarization API expenditure.',
            'Information loss propagates up the tree: faulty summaries at level 1 irreversibly corrupt all ancestor nodes.',
            'Dynamic corpus updates require expensive tree rebalancing and partial re-summarization.'
          ],
          suggestedFutureWork: [
            'Incremental online tree re-balancing algorithms that insert new papers without re-clustering the entire corpus.',
            'Formal bounds on abstractive summary fidelity across tree depths.'
          ]
        }
      }
    ]
  },
  {
    id: 'reasoning-cot',
    name: 'LLM Reasoning, Chain-of-Thought & Agentic Planning',
    field: 'Artificial Intelligence & Cognitive Computing',
    description: 'Explores multi-step deliberative reasoning, search over thought trajectories, self-correction illusions, and agentic tool synthesis.',
    iconName: 'BrainCircuit',
    papers: [
      {
        id: 'paper-cot-1',
        title: 'Tree of Thoughts: Deliberate Problem Solving with Large Language Models',
        authors: ['Shunyu Yao', 'Dian Yu', 'Jeffrey Zhao', 'Izhak Shafran', 'Thomas L. Griffiths', 'Yuan Cao', 'Karthik Narasimhan'],
        year: 2023,
        venue: 'NeurIPS 2023',
        category: 'Cognitive Architectures / Search Algorithms',
        keywords: ['Tree of Thoughts', 'Heuristic Search', 'Backtracking', 'Game of 24', 'Creative Writing'],
        abstract: 'Popular autoregressive language generation is confined to left-to-right token generation, lacking deliberate exploration, lookahead, and backtracking. We introduce Tree of Thoughts (ToT), enabling LLMs to explore multiple reasoning paths over coherent units of thought. ToT allows models to evaluate their own intermediate progress, backtrack when an exploratory path hits a dead end, and combine heuristic search algorithms (BFS and DFS) with self-evaluations.',
        metadata: {
          coreObjective: 'Generalize chain-of-thought to tree-structured search with lookahead and backtracking.',
          methodology: 'Thought decomposition into discrete steps, generation of multiple candidate thoughts, heuristic evaluation prompts, and BFS/DFS traversal.',
          datasetOrBenchmark: 'Game of 24, 5x5 Crosswords, Creative Writing Prompts',
          primaryFindings: 'In Game of 24, while GPT-4 with standard CoT solved only 7.3% of tasks, ToT achieved a 74% success rate by actively backtracking from incorrect intermediate equations.',
          explicitLimitations: [
            'Extremely high token consumption: requires 40x to 100x more API calls than single-pass greedy generation, making it economically unviable for real-time applications.',
            'Heuristic self-evaluation is prone to self-confirmation bias: models frequently assign high scores to flawed reasoning steps if the syntax appears persuasive.',
            'Tested on tightly constrained, rule-governed mathematical puzzles; generalization to open-domain subjective argumentation was not rigorously evaluated.'
          ],
          suggestedFutureWork: [
            'Learned value functions and policy networks (AlphaZero-style) to replace costly verbose prompt evaluations.',
            'Adaptive branching factor based on problem uncertainty.'
          ]
        }
      },
      {
        id: 'paper-cot-2',
        title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
        authors: ['Shunyu Yao', 'Jeffrey Zhao', 'Dian Yu', 'Nan Du', 'Izhak Shafran', 'Karthik Narasimhan', 'Yuan Cao'],
        year: 2023,
        venue: 'ICLR 2023',
        category: 'Agentic Workflows / Tool Use',
        keywords: ['ReAct', 'Agent Framework', 'Tool Calling', 'Interleaved Thought-Action'],
        abstract: 'While chain-of-thought prompting enables internal reasoning, it remains disconnected from external environments. Conversely, pure action-oriented agents blindly call APIs without strategic reasoning. We present ReAct, an approach where LLMs interleave domain-specific reasoning traces (Thoughts) with discrete actions (Actions) and observations (Observations) from external tools and environments.',
        metadata: {
          coreObjective: 'Combine verbal reasoning traces with interactive tool execution in a tight feedback loop.',
          methodology: 'Few-shot prompting enforcing a Thought -> Action -> Observation -> Thought cycle over Wikipedia APIs and web environments.',
          datasetOrBenchmark: 'HotpotQA, Fever, ALFWorld, WebShop',
          primaryFindings: 'ReAct overcomes hallucination issues in HotpotQA by retrieving targeted facts and improves human inspectability and interpretability of autonomous decision trails.',
          explicitLimitations: [
            'Prone to error loops: when an initial action returns an empty observation, models frequently repeat identical or minimally mutated queries indefinitely until token limits are exhausted.',
            'Rigid sequential execution lacks parallel speculative tool calling.',
            'Sensitive to prompt demonstration formatting; small alterations in few-shot demonstrations severely degrade execution trajectory.'
          ],
          suggestedFutureWork: [
            'Asynchronous multi-tool orchestration with speculative branching.',
            'Reinforcement learning with trajectory rollouts to break infinite retry loops.'
          ]
        }
      },
      {
        id: 'paper-cot-3',
        title: 'Large Language Models Cannot Self-Correct Reasoning Yet',
        authors: ['Jie Huang', 'Xinyun Chen', 'Swaroop Mishra', 'Huaixiu Steven Zheng', 'Adams Wei Yu', 'Xinyi Wang', 'Kevin Chen-Chuan Chang'],
        year: 2024,
        venue: 'ICLR 2024',
        category: 'Self-Correction / Meta-Cognition',
        keywords: ['Intrinsic Self-Correction', 'Reasoning Fallacies', 'Prompting Mirages', 'Oracle Feedback'],
        abstract: 'Self-correction has garnered immense enthusiasm as a mechanism for LLMs to refine their initial outputs. However, recent literature frequently conflates intrinsic self-correction (where the model identifies and fixes errors purely from its own reasoning) with extrinsic self-correction (relying on ground-truth oracle feedback, external unit test compilers, or ground truth answers). We conduct rigorous controlled experiments to test whether LLMs can intrinsically self-correct reasoning tasks without external feedback.',
        metadata: {
          coreObjective: 'Disentangle intrinsic self-correction capability from oracle-assisted correction in state-of-the-art LLMs.',
          methodology: 'Multi-turn self-critique prompting ("Review your answer and correct errors") without external verifiers across GSM8K, CommonSenseQA, and SVAMP.',
          datasetOrBenchmark: 'GSM8K, SVAMP, CommonSenseQA, MultiArith',
          primaryFindings: 'Across all models evaluated (GPT-4, PaLM-2, Claude), intrinsic self-correction WITHOUT external feedback degrades accuracy compared to initial attempts, as models flip correct answers into wrong answers in 28% of cases.',
          explicitLimitations: [
            'Focused on standard one-turn critique prompts; multi-agent debates with specialized contrarian personas were not exhaustively profiled.',
            'Did not train specialized verifier networks or reward models specifically tuned for error detection.',
            'Natural language math benchmarks may have narrower solution spaces than open-ended coding tasks with syntactic compilers.'
          ],
          suggestedFutureWork: [
            'Independent calibrated verifier networks trained on counterexample synthesis.',
            'Formal verification bridges for provably sound self-correction in domain-specific languages.'
          ]
        }
      }
    ]
  }
];

export const INITIAL_GAPS: ResearchGap[] = [
  {
    id: 'gap-1',
    title: 'Absence of Dynamic Grounding Verification in Parametric-Memory Conflicts',
    category: 'methodological',
    severity: 'critical',
    description: 'Existing RAG architectures either blindly trust external retrieved documents (CRAG, RAPTOR) or fail when long-tail parametric memory stubbornness overrides retrieved ground truth (Mallen et al.). There is no unified mechanism that dynamically arbitrates epistemic conflict between internal parameter activations and retrieved contextual tokens at decoding time.',
    affectedPaperIds: ['paper-rag-1', 'paper-rag-3', 'paper-rag-4'],
    noveltyScore: 9.2,
    feasibilityScore: 7.8,
    urgencyScore: 9.5,
    evidenceQuotes: [
      {
        paperId: 'paper-rag-4',
        paperTitle: 'When Not to Trust Language Models',
        section: 'Limitations § 6.2',
        quote: 'LLMs override correct retrieved context with wrong internal memories in over 42% of long-tail queries, exhibiting an inverse scaling law...',
        relevanceExplanation: 'Empirically shows the stubborn conflict phenomenon where models ignore factual retrieved context.'
      },
      {
        paperId: 'paper-rag-3',
        paperTitle: 'CRAG: Corrective Retrieval Augmented Generation',
        section: 'Future Work § 5',
        quote: 'Sub-sentence stripping can sever vital anaphoric references... threshold tuning between Correct and Ambiguous requires manual calibration.',
        relevanceExplanation: 'Highlights that current heuristic filters lack token-level epistemic calibration.'
      }
    ],
    suggestedHypothesis: 'Modulating the attention logits of feed-forward layer memory heads during generation via contrastive decoding between parametric-only and context-conditioned distributions will reduce memory override errors by >60% without training an external critic.',
    proposedMethodology: 'Design an Epistemic Arbitration Logit Filter (EALF) that tracks internal token entropy across MLP key-value memory projections vs cross-attention scores. When dissonance is detected, dynamically down-weight parametric priors in favor of non-parametric evidence spans.',
    expectedContribution: 'A zero-shot decoding algorithm for LLMs that eliminates parametric-memory conflicts on long-tail knowledge tasks without expensive re-training.',
    recommendedEvaluation: 'Evaluate across PopQA tail split, EntityQuestions counterfactual perturbations, and FreshQA real-time updates against baseline Self-RAG and CRAG.'
  },
  {
    id: 'gap-2',
    title: 'Severe Latency & Cost Bottlenecks of Hierarchical Recursive Summarization (RAPTOR)',
    category: 'application',
    severity: 'critical',
    description: 'Hierarchical tree-structured RAG (RAPTOR) significantly boosts thematic and long-context comprehension, but indexing requires recursive LLM summarization calls whose cost and latency scale quadratically with corpus volume. Furthermore, live real-world knowledge streams require continuous document insertions, which currently force expensive full-tree re-clustering.',
    affectedPaperIds: ['paper-rag-5'],
    noveltyScore: 8.5,
    feasibilityScore: 8.9,
    urgencyScore: 8.7,
    evidenceQuotes: [
      {
        paperId: 'paper-rag-5',
        paperTitle: 'RAPTOR: Recursive Abstractive Processing',
        section: 'Limitations § 7',
        quote: 'Offline tree indexing is computationally intensive... dynamic corpus updates require expensive tree rebalancing and partial re-summarization.',
        relevanceExplanation: 'Direct acknowledgement by the authors that incremental streaming updates and compute overhead remain an unsolved hurdle.'
      }
    ],
    suggestedHypothesis: 'An online localized B-Tree clustering variant utilizing lightweight student-distilled summary heads can perform incremental O(log N) tree updates with less than 2% loss in global retrieval accuracy.',
    proposedMethodology: 'Implement an Online Dynamic Summary Tree (ODST) using streaming vector clustering with bounded radius updates, triggering localized sub-tree re-summarization only when centroid drift exceeds a statistical KL-divergence threshold.',
    expectedContribution: 'The first streaming, low-latency hierarchical RAG tree capable of ingesting live news feeds, research repositories, and enterprise wikis in real-time.',
    recommendedEvaluation: 'Benchmarking indexing throughput, API token expenditure, and retrieval accuracy on QASPER and NarrativeQA streaming updates.'
  },
  {
    id: 'gap-3',
    title: 'The "Self-Correction Illusion": Over-Reliance on Oracle Feedback without Autonomous Verifiers',
    category: 'theoretical',
    severity: 'critical',
    description: 'Literature commonly asserts that LLMs can spontaneously refine their intermediate reasoning (ToT, ReAct). However, recent empirical audits (Huang et al.) prove that intrinsic self-correction without external test oracles or ground truth degrades accuracy by 28%, turning correct hypotheses into false ones due to sycophancy and lack of objective verifiers.',
    affectedPaperIds: ['paper-cot-1', 'paper-cot-2', 'paper-cot-3'],
    noveltyScore: 9.4,
    feasibilityScore: 7.2,
    urgencyScore: 9.8,
    evidenceQuotes: [
      {
        paperId: 'paper-cot-3',
        paperTitle: 'Large Language Models Cannot Self-Correct Reasoning Yet',
        section: 'Conclusion & Findings',
        quote: 'Intrinsic self-correction WITHOUT external feedback degrades accuracy compared to initial attempts, as models flip correct answers into wrong answers in 28% of cases.',
        relevanceExplanation: 'Demonstrates mathematically and empirically that ungrounded iterative prompting is self-defeating.'
      },
      {
        paperId: 'paper-cot-1',
        paperTitle: 'Tree of Thoughts',
        section: 'Discussion § 5',
        quote: 'Heuristic self-evaluation is prone to self-confirmation bias: models frequently assign high scores to flawed reasoning steps if the syntax appears persuasive.',
        relevanceExplanation: 'Corroborates that self-scoring in search trees is vulnerable to hallucinated confidence.'
      }
    ],
    suggestedHypothesis: 'Autonomous self-correction can succeed if and only if reasoning traces are translated into verifiable intermediate formal artifacts (e.g., Lean 4 proofs, Python assertion contracts, or SAT-solvers) evaluated deterministically outside the generative model.',
    proposedMethodology: 'Develop a Neuro-Symbolic Verification Engine (NSVE) that forces each intermediate thought in a search tree to generate an executable verification assertion before advancing the search frontier.',
    expectedContribution: 'A formal boundary definition and neuro-symbolic architecture proving under what conditions autonomous self-correction is mathematically reliable.',
    recommendedEvaluation: 'Evaluate on GSM-Symbolic, BigBench Hard logic puzzles, and HumanEval-X using syntax-restricted formal specifications.'
  },
  {
    id: 'gap-4',
    title: 'Unaddressed Positional U-Curve Bias in Document Rerankers',
    category: 'empirical',
    severity: 'emerging',
    description: 'While "Lost in the Middle" demonstrated severe attention degradation in middle-placed chunks across LLMs, popular modern RAG orchestrators (LangChain, LlamaIndex) still sort retrieved chunks strictly by monotonic descending similarity score, inadvertently placing the highest scoring chunks into known attention dead-zones or middle regions.',
    affectedPaperIds: ['paper-rag-2', 'paper-rag-1'],
    noveltyScore: 7.9,
    feasibilityScore: 9.4,
    urgencyScore: 8.2,
    evidenceQuotes: [
      {
        paperId: 'paper-rag-2',
        paperTitle: 'Lost in the Middle',
        section: 'Section 4.1 Results',
        quote: 'Accuracy drops by up to 34.6% when the relevant passage is positioned in the middle third of the context window...',
        relevanceExplanation: 'Provides rigorous quantification of the vulnerability in modern context assemblies.'
      }
    ],
    suggestedHypothesis: 'A bilateral "Curtain Reranker" that interleaves top-k retrieved documents alternately between the prompt prefix (positions 1, 3, 5) and prompt suffix (positions 2, 4, 6) will restore up to 28% of lost middle-context recall at zero computational cost.',
    proposedMethodology: 'Formulate an attention-aware permutation matrix optimizer that maximizes mutual information between query tokens and retrieved key embeddings by exploiting the U-shaped positional weight distribution of transformer architectures.',
    expectedContribution: 'An immediate drop-in replacement for standard monotonic rerankers in all RAG frameworks that eliminates the "Lost in the Middle" penalty.',
    recommendedEvaluation: 'Multi-document QA benchmarks (NaturalQuestions, HotpotQA) across context sizes from 8k to 64k tokens with varying distractor densities.'
  },
  {
    id: 'gap-5',
    title: 'Infinite Error Loops and Lack of Speculative Tool Execution in Agentic Frameworks',
    category: 'evaluation',
    severity: 'emerging',
    description: 'ReAct-style interactive agents operate on strictly sequential Thought-Action-Observation loops. When an intermediate tool output is empty or noisy, agents enter degenerative retry loops or suffer from catastrophic context bloat that exhausts window limits without solving the core objective.',
    affectedPaperIds: ['paper-cot-2'],
    noveltyScore: 8.1,
    feasibilityScore: 8.4,
    urgencyScore: 8.0,
    evidenceQuotes: [
      {
        paperId: 'paper-cot-2',
        paperTitle: 'ReAct: Synergizing Reasoning and Acting',
        section: 'Limitations § 6',
        quote: 'Prone to error loops: when an initial action returns an empty observation, models frequently repeat identical or minimally mutated queries indefinitely...',
        relevanceExplanation: 'Explicitly pinpoints agent paralysis under non-deterministic environmental feedback.'
      }
    ],
    suggestedHypothesis: 'Speculative multi-path action dispatch coupled with an environmental state rollback policy will reduce agent execution steps by 45% and prevent infinite cyclic looping.',
    proposedMethodology: 'Design a Speculative Branching Agent (SBA) that predicts top-3 probable subsequent actions and tool signatures, executes read-only tools asynchronously in parallel, and rolls back state when encountering anomalous observation signatures.',
    expectedContribution: 'An asynchronous speculative execution standard for LLM agents with guaranteed non-cycling termination bounds.',
    recommendedEvaluation: 'WebArena, ALFWorld, and GAIA benchmarks measuring trajectory completion rate, token expenditure, and recovery latency.'
  }
];

export const INITIAL_CONSENSUS: PaperConsensusItem[] = [
  {
    id: 'cons-1',
    topic: 'Indiscriminate Retrieval Degrades LLM Reasoning and Factuality',
    type: 'consensus',
    summary: 'Both Self-RAG and CRAG agree that naively injecting top-k retrieved passages into prompts introduces context noise, distracts attention heads, and increases hallucinations compared to selective or corrective filtering.',
    paperArguments: [
      {
        paperId: 'paper-rag-1',
        paperTitle: 'Self-RAG',
        stance: 'Supports',
        quote: 'Indiscriminate retrieval often introduces noisy, irrelevant context that degrades generation quality... selective retrieval improves citation precision.'
      },
      {
        paperId: 'paper-rag-3',
        paperTitle: 'CRAG',
        stance: 'Supports',
        quote: 'When retrieval fails or retrieves contaminated documents, generation suffers severe degradation... fine-grained filtering is essential.'
      }
    ]
  },
  {
    id: 'cons-2',
    topic: 'Intrinsic Self-Correction vs Multi-Step Search Capability',
    type: 'contradiction',
    summary: 'Tree of Thoughts claims LLMs can successfully evaluate and backtrack on their own intermediate thoughts to reach high accuracy, whereas Huang et al. prove that intrinsic self-correction is largely an illusion and causes models to flip correct answers to incorrect ones unless external non-LLM ground-truth feedback is supplied.',
    paperArguments: [
      {
        paperId: 'paper-cot-1',
        paperTitle: 'Tree of Thoughts',
        stance: 'Claims Self-Evaluation Works',
        quote: 'ToT allows models to evaluate their own intermediate progress, backtrack when an exploratory path hits a dead end... boosting accuracy from 7.3% to 74%.'
      },
      {
        paperId: 'paper-cot-3',
        paperTitle: 'LLMs Cannot Self-Correct Yet',
        stance: 'Proves Self-Correction Degrades Performance',
        quote: 'Intrinsic self-correction WITHOUT external feedback degrades accuracy compared to initial attempts... flipping correct answers into wrong answers in 28% of cases.'
      }
    ]
  },
  {
    id: 'cons-3',
    topic: 'Long-Context Window Scaling vs Retrieval Augmentation',
    type: 'contradiction',
    summary: 'Proponents of million-token context windows claim RAG is becoming obsolete, but "Lost in the Middle" and RAPTOR demonstrate that extended context windows suffer from positional blindness and cannot perform holistic multi-scale thematic synthesis without structured hierarchical retrieval.',
    paperArguments: [
      {
        paperId: 'paper-rag-2',
        paperTitle: 'Lost in the Middle',
        stance: 'Context Length Does Not Guarantee Context Utilization',
        quote: 'Performance is highest when relevant information occurs at the absolute beginning or end... degrading significantly in the middle even in 32k+ models.'
      },
      {
        paperId: 'paper-rag-5',
        paperTitle: 'RAPTOR',
        stance: 'Hierarchical Chunk Trees are Necessary for Macro Synthesis',
        quote: 'Contiguous chunks preclude models from grasping holistic themes... recursive trees outperform standard dense retrieval on complex questions by up to 20%.'
      }
    ]
  }
];
