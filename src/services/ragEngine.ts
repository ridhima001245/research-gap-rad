import { ResearchPaper, PaperChunk } from '../types';

// Lightweight in-browser BM25 / TF-IDF Vector Retrieval Engine
export class LocalRagEngine {
  private chunks: PaperChunk[] = [];
  private vocab: Map<string, number> = new Map();
  private docFrequencies: Map<string, number> = new Map();
  private chunkVectors: Map<string, Map<string, number>> = new Map();

  constructor(papers: ResearchPaper[]) {
    this.indexPapers(papers);
  }

  public indexPapers(papers: ResearchPaper[]): void {
    this.chunks = [];
    this.vocab.clear();
    this.docFrequencies.clear();
    this.chunkVectors.clear();

    // 1. Decompose papers into searchable chunks
    for (const paper of papers) {
      // Abstract chunk
      this.chunks.push({
        id: `${paper.id}-abstract`,
        paperId: paper.id,
        section: 'Abstract',
        text: paper.abstract
      });

      // Metadata / Findings chunk
      this.chunks.push({
        id: `${paper.id}-findings`,
        paperId: paper.id,
        section: 'Core Findings & Methodology',
        text: `Methodology: ${paper.metadata.methodology}. Dataset: ${paper.metadata.datasetOrBenchmark}. Findings: ${paper.metadata.primaryFindings}`
      });

      // Limitations chunk (critical for gap finding)
      this.chunks.push({
        id: `${paper.id}-limitations`,
        paperId: paper.id,
        section: 'Explicit Limitations & Open Problems',
        text: paper.metadata.explicitLimitations.join(' ')
      });

      // Future work chunk
      this.chunks.push({
        id: `${paper.id}-future-work`,
        paperId: paper.id,
        section: 'Suggested Future Work',
        text: paper.metadata.suggestedFutureWork.join(' ')
      });

      // Additional fulltext / extra chunks if present
      if (paper.chunks && paper.chunks.length > 0) {
        this.chunks.push(...paper.chunks);
      }
    }

    // 2. Compute vocabulary and term frequencies
    const totalDocs = this.chunks.length;
    for (const chunk of this.chunks) {
      const tokens = this.tokenize(chunk.text);
      const uniqueTokens = new Set(tokens);

      for (const token of uniqueTokens) {
        this.docFrequencies.set(token, (this.docFrequencies.get(token) || 0) + 1);
      }
    }

    // 3. Compute TF-IDF vectors for all chunks
    for (const chunk of this.chunks) {
      const tokens = this.tokenize(chunk.text);
      const tfMap = new Map<string, number>();

      for (const token of tokens) {
        tfMap.set(token, (tfMap.get(token) || 0) + 1);
      }

      const vector = new Map<string, number>();
      let normSq = 0;

      for (const [token, count] of tfMap.entries()) {
        const tf = count / tokens.length;
        const df = this.docFrequencies.get(token) || 1;
        const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
        const score = tf * idf;
        vector.set(token, score);
        normSq += score * score;
      }

      // Normalize
      const norm = Math.sqrt(normSq) || 1;
      for (const [token, score] of vector.entries()) {
        vector.set(token, score / norm);
      }

      this.chunkVectors.set(chunk.id, vector);
    }
  }

  public search(query: string, topK: number = 4): { chunk: PaperChunk; score: number }[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0 || this.chunks.length === 0) return [];

    const queryTf = new Map<string, number>();
    for (const token of queryTokens) {
      queryTf.set(token, (queryTf.get(token) || 0) + 1);
    }

    const queryVector = new Map<string, number>();
    let normSq = 0;
    const totalDocs = this.chunks.length;

    for (const [token, count] of queryTf.entries()) {
      const tf = count / queryTokens.length;
      const df = this.docFrequencies.get(token) || 1;
      const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
      const score = tf * idf;
      queryVector.set(token, score);
      normSq += score * score;
    }

    const norm = Math.sqrt(normSq) || 1;
    for (const [token, score] of queryVector.entries()) {
      queryVector.set(token, score / norm);
    }

    // Cosine similarity scoring
    const results: { chunk: PaperChunk; score: number }[] = [];

    for (const chunk of this.chunks) {
      const chunkVec = this.chunkVectors.get(chunk.id);
      if (!chunkVec) continue;

      let dotProduct = 0;
      for (const [token, qScore] of queryVector.entries()) {
        const cScore = chunkVec.get(token);
        if (cScore) {
          dotProduct += qScore * cScore;
        }
      }

      if (dotProduct > 0.05) {
        results.push({ chunk, score: dotProduct });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  private tokenize(text: string): string[] {
    const stopWords = new Set([
      'the', 'is', 'in', 'and', 'to', 'of', 'a', 'for', 'on', 'with', 'as', 'by',
      'at', 'an', 'be', 'this', 'that', 'which', 'from', 'or', 'are', 'we', 'our',
      'it', 'can', 'not', 'have', 'has', 'been', 'its', 'their', 'they', 'was'
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }
}
