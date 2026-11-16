import React, { useState, useRef, useEffect } from 'react';
import { AnalysisMode, ChatMessage, ResearchPaper, LLMConfig } from '../types';
import { LocalRagEngine } from '../services/ragEngine';
import { LLMService } from '../services/llmService';
import { 
  Send, 
  Sparkles, 
  Brain, 
  Zap, 
  Quote, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface RagChatProps {
  mode: AnalysisMode;
  papers: ResearchPaper[];
  ragEngine: LocalRagEngine;
  llmConfig: LLMConfig;
  onSelectPaper: (paperId: string) => void;
}

export const RagChat: React.FC<RagChatProps> = ({
  mode,
  papers,
  ragEngine,
  llmConfig,
  onSelectPaper
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `👋 Welcome to **ScholarRAD Assistant**. I am indexed on your **${papers.length} loaded papers**.

Currently running in **${mode === 'rad' ? '⚡ RAD Mode (Rapid Analysis & Discovery)' : '🧠 Deep RAG Mode (Retrieval-Augmented Synthesis)'}**.

Ask me anything about:
* Critical methodological or empirical gaps across the collection
* Cross-paper contradictions and opposing assumptions
* Formulating novel grant hypotheses and experimental designs
* Concrete citations and limitations stated by authors`,
      timestamp: Date.now(),
      mode
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<{ [id: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'What are the critical unaddressed research gaps?',
    'Where do these papers contradict each other?',
    'What empirical limitations are shared across models?',
    'Propose a novel high-impact thesis hypothesis combining these papers'
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: Date.now(),
      mode
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await LLMService.generateResponse(
        text,
        mode,
        papers,
        llmConfig,
        ragEngine,
        messages
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        mode,
        citations: response.citations,
        reasoningSteps: response.reasoningSteps
      };

      setMessages(prev => [...prev, assistantMsg]);
      // Auto expand reasoning for deep RAG
      if (mode === 'rag' && response.reasoningSteps) {
        setExpandedReasoning(prev => ({ ...prev, [assistantMsg.id]: true }));
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ Error synthesizing response: ${err.message || 'Unknown network error'}. Please try again.`,
          timestamp: Date.now(),
          mode
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-[700px] bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {mode === 'rad' ? (
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Brain className="h-4 w-4 text-brand-400" />
            </div>
          )}
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{mode === 'rad' ? 'RAD Rapid Synthesis Engine' : 'Deep Grounded RAG Explorer'}</span>
              <span className="text-[10px] text-slate-400 font-mono">({papers.length} papers indexed)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {mode === 'rad' ? 'Sub-second triage & high-level comparative vectors' : 'Strict citation verification against extracted paper chunks'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition"
          title="Reset conversation"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                {/* Reasoning Accordion (if present) */}
                {!isUser && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                  <div className="mb-3 border-b border-slate-800 pb-2">
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className="flex items-center justify-between w-full text-[11px] font-mono text-brand-400 hover:text-brand-300 py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Analysis & Reasoning Trace ({msg.reasoningSteps.length} steps)</span>
                      </span>
                      {expandedReasoning[msg.id] ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {expandedReasoning[msg.id] && (
                      <div className="mt-2 space-y-1 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-400">
                        {msg.reasoningSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-brand-500 font-bold">›</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {/* Grounded Citation Chips */}
                {!isUser && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Quote className="h-3 w-3 text-brand-400" /> Grounded Evidence Chunks ({msg.citations.length})
                    </div>
                    <div className="space-y-1.5">
                      {msg.citations.map((c, i) => (
                        <div
                          key={i}
                          className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 text-[11px]"
                        >
                          <div className="flex items-center justify-between text-brand-300 font-medium">
                            <button
                              onClick={() => onSelectPaper(c.paperId)}
                              className="hover:underline flex items-center gap-1 text-left"
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>{c.paperTitle}</span>
                            </button>
                            <span className="text-slate-500 font-mono text-[10px]">{c.section}</span>
                          </div>
                          <p className="italic text-slate-300 mt-1 pl-2 border-l border-brand-500/50">
                            "{c.quote}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-brand-400 bg-slate-900/80 border border-slate-700/60 p-3 rounded-xl max-w-sm">
            <Sparkles className="h-4 w-4 animate-spin text-brand-400" />
            <span>
              {mode === 'rad' ? 'RAD Engine executing fast heuristic scan...' : 'Retrieving grounded vector chunks and synthesizing literature...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-slate-500 flex-shrink-0">
          Suggested:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap transition flex-shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-700/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'rad'
                ? 'Ask for fast gap triage or heuristic synthesis...'
                : 'Ask a grounded research question (e.g., "What are the common failure modes?")...'
            }
            className="flex-1 bg-slate-800 text-xs sm:text-sm text-slate-100 rounded-xl px-4 py-2.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-md transition flex items-center justify-center flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
