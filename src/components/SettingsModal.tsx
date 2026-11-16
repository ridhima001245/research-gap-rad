import React, { useState } from 'react';
import { LLMConfig } from '../types';
import { Sliders, Cpu, Key, CheckCircle, Sparkles, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  config: LLMConfig;
  onSave: (config: LLMConfig) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ config, onSave, onClose }) => {
  const [provider, setProvider] = useState(config.provider);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [temperature, setTemperature] = useState(config.temperature);
  const [customEndpoint, setCustomEndpoint] = useState(config.customEndpoint || '');

  const handleSave = () => {
    onSave({
      provider,
      apiKey,
      model,
      temperature,
      customEndpoint
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              LLM & Synthesis Configuration
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Provider Select */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Inference Engine / Backend
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setProvider('simulated');
                setModel('scholar-rad-neural-v2');
              }}
              className={`p-3 rounded-xl border text-left transition ${
                provider === 'simulated'
                  ? 'bg-brand-600/20 border-brand-500 text-white ring-1 ring-brand-500'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-400" />
                <span>Simulated Neural</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Zero-setup offline AI with multi-step reasoning traces
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setProvider('gemini');
                setModel('gemini-1.5-pro');
              }}
              className={`p-3 rounded-xl border text-left transition ${
                provider === 'gemini'
                  ? 'bg-brand-600/20 border-brand-500 text-white ring-1 ring-brand-500'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <span>Google Gemini API</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Live Gemini 1.5 Pro / Flash models
              </p>
            </button>
          </div>
        </div>

        {/* Gemini API Key input if Gemini selected */}
        {provider === 'gemini' && (
          <div className="space-y-2 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                <span>Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-brand-400 hover:underline flex items-center gap-0.5"
              >
                Get Key <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 font-mono text-xs focus:ring-1 focus:ring-brand-500"
            />
            <p className="text-[10px] text-slate-500">
              Your key is held strictly in browser memory and sent directly to Google APIs.
            </p>
          </div>
        )}

        {/* Model Selection */}
        <div className="text-xs space-y-1">
          <label className="font-semibold text-slate-300">Model Name</label>
          <input
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
            className="w-full bg-slate-800 text-slate-100 rounded-xl px-3 py-2 border border-slate-700 font-mono text-xs"
          />
        </div>

        {/* Temperature slider */}
        <div className="text-xs space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span className="font-semibold">Temperature: {temperature}</span>
            <span className="text-[10px] text-slate-400">
              {temperature < 0.4 ? 'Strict & Deterministic' : 'Exploratory & Creative'}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
