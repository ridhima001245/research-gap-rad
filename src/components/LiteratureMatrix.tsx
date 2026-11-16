import React, { useState } from 'react';
import { ResearchPaper } from '../types';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface LiteratureMatrixProps {
  papers: ResearchPaper[];
  onSelectPaper: (paperId: string) => void;
}

export const LiteratureMatrix: React.FC<LiteratureMatrixProps> = ({ papers, onSelectPaper }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'year' | 'title'>('year');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter categories
  const categories = ['all', ...Array.from(new Set(papers.map(p => p.category)))];

  const filteredPapers = papers
    .filter(p => {
      const matchSearch = 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.metadata.methodology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.metadata.primaryFindings.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortField === 'year') {
        return sortAsc ? a.year - b.year : b.year - a.year;
      }
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });

  const exportCSV = () => {
    const headers = ['Title', 'Authors', 'Year', 'Venue', 'Objective', 'Methodology', 'Dataset', 'Key Findings', 'Explicit Limitations'];
    const rows = filteredPapers.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.authors.join(', ')}"`,
      p.year,
      `"${p.venue}"`,
      `"${p.metadata.coreObjective.replace(/"/g, '""')}"`,
      `"${p.metadata.methodology.replace(/"/g, '""')}"`,
      `"${p.metadata.datasetOrBenchmark.replace(/"/g, '""')}"`,
      `"${p.metadata.primaryFindings.replace(/"/g, '""')}"`,
      `"${p.metadata.explicitLimitations.join(' | ').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `literature_review_matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by methodology, author, findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-xs rounded-xl pl-9 pr-3 py-2 text-slate-200 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 text-xs text-slate-300 rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Subdomains' : c}
              </option>
            ))}
          </select>

          {/* Sort button */}
          <button
            onClick={() => {
              if (sortField === 'year') {
                setSortAsc(!sortAsc);
              } else {
                setSortField('year');
                setSortAsc(false);
              }
            }}
            className="flex items-center gap-1.5 bg-slate-900 text-xs text-slate-300 px-3 py-2 rounded-xl border border-slate-700 hover:text-white"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-brand-400" />
            <span>Year {sortField === 'year' ? (sortAsc ? '↑' : '↓') : ''}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs px-3 py-2 rounded-xl transition shadow-sm"
            title="Download CSV for Excel/Sheets"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-700 text-slate-300 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[220px]">Paper & Citation</th>
                <th className="py-3 px-4 min-w-[180px]">Core Objective</th>
                <th className="py-3 px-4 min-w-[200px]">Methodology</th>
                <th className="py-3 px-4 min-w-[170px]">Dataset / Benchmarks</th>
                <th className="py-3 px-4 min-w-[240px]">Primary Empirical Findings</th>
                <th className="py-3 px-4 min-w-[240px]">Explicit Limitations (Gaps)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filteredPapers.map((paper, idx) => (
                <tr 
                  key={paper.id}
                  className="hover:bg-slate-750/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectPaper(paper.id)}
                >
                  {/* Paper info */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="font-bold text-white text-sm group-hover:text-brand-300 transition-colors">
                      {paper.title}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      {paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ' et al.' : ''}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-mono text-[10px]">
                        {paper.year}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                        {paper.venue}
                      </span>
                    </div>
                  </td>

                  {/* Objective */}
                  <td className="py-3.5 px-4 align-top leading-relaxed text-slate-200">
                    {paper.metadata.coreObjective}
                  </td>

                  {/* Methodology */}
                  <td className="py-3.5 px-4 align-top leading-relaxed text-slate-300 font-mono text-[11px]">
                    {paper.metadata.methodology}
                  </td>

                  {/* Dataset */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="inline-block bg-slate-900/80 px-2 py-1 rounded text-slate-300 font-mono text-[11px] border border-slate-700/50">
                      {paper.metadata.datasetOrBenchmark}
                    </span>
                  </td>

                  {/* Findings */}
                  <td className="py-3.5 px-4 align-top leading-relaxed text-slate-200">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{paper.metadata.primaryFindings}</span>
                    </div>
                  </td>

                  {/* Limitations / Gaps */}
                  <td className="py-3.5 px-4 align-top leading-relaxed">
                    <ul className="space-y-1.5 list-disc list-inside text-amber-300/90 text-[11px]">
                      {paper.metadata.explicitLimitations.map((lim, i) => (
                        <li key={i} className="leading-snug">
                          {lim}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
