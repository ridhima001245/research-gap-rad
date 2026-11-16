# ScholarRAD 🔬⚡
### AI Literature Review & Research Gap Identification Web App
*Powered by Large Language Models with Dual **RAD Mode** & **Deep RAG Mode***

ScholarRAD is an academic research platform designed to streamline systematic literature reviews, map cross-paper consensuses and contradictions, evaluate corpus health via a 5-axis vulnerability radar, and formulate testable research hypotheses.

---

## 🚀 Key Features

### 1. Dual Operational Modes
* **⚡ RAD Mode (Rapid Analysis & Discovery):**
  * Sub-second heuristic limitation extraction (< 50ms)
  * Automated 5-axis vulnerability radar scoring (*Methodological Rigor, Empirical Diversity, Theoretical Depth, Scalability, Benchmark Reproducibility*)
  * Fast cross-paper gap triage and executive matrix generation
* **🧠 Deep RAG Mode (Retrieval-Augmented Generation):**
  * In-browser TF-IDF & BM25 vector chunk indexing
  * Grounded citation retrieval pairing every assertion with exact paper quotes
  * Step-by-step chain-of-thought analysis traces

### 2. Systematic Literature Review Matrix
* Interactive comparative matrix tabulating:
  * Objective & Research Question
  * Methodology & Architectural Strategy
  * Datasets & Evaluation Protocols
  * Primary Empirical Results
  * Stated Vulnerabilities & Unaddressed Gaps
* Live keyword/author search, subdomain filtering, and one-click **CSV/Markdown export**.

### 3. Consensus vs Contradiction Engine
* Pinpoints where leading papers agree (e.g. indiscriminate retrieval noise degradation).
* Surfaces critical active scientific debates and opposing results (e.g. whether LLMs can intrinsically self-correct vs the "self-correction illusion").

### 4. Novel Hypothesis & Research Proposal Pitch Generator
* Automatically synthesizes high-impact research hypotheses for any identified gap.
* Formulates a 3-Phase Execution Roadmap (*Diagnostic Profiling -> Prototyping -> Benchmark Stress-Testing*).
* Generates an NSF/ERC/PhD thesis prospectus pitch ready to copy.

### 5. Multi-Provider LLM Integration
* **Simulated Local Neural Engine (Default):** Zero-setup offline academic engine with simulated reasoning traces.
* **Google Gemini API:** Native support for Gemini 1.5 Pro and Gemini 1.5 Flash with custom temperature and token limits.
* **OpenAI / Ollama:** Compatible endpoints for local LLM inference.

---

## 🛠️ Local Development & Running

### Prerequisites
* Node.js v18+ and npm

### Quickstart
\`\`\`bash
# 1. Navigate to the project directory
cd C:\Users\jridh\.gemini\antigravity\scratch\research-gap-rad

# 2. Start the dev server
npm run dev

# 3. Open in browser:
http://127.0.0.1:5173
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm run preview
\`\`\`
