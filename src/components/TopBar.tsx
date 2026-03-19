import { Search } from 'lucide-react';
import { IMAGE_TYPES } from '../data/imageTypes';
import type { FilterTab } from '../types';

interface Props {
  activeFilter: FilterTab;
  onFilterChange: (filter: FilterTab) => void;
  categoryCounts: Record<string, number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activePage: 'browse' | 'board';
  onPageChange: (page: 'browse' | 'board') => void;
  savedCount: number;
}

export function TopBar({
  activeFilter,
  onFilterChange,
  categoryCounts,
  searchQuery,
  onSearchChange,
  activePage,
  onPageChange,
  savedCount,
}: Props) {
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-100">
      {/* 검색바 */}
      <div className="flex items-center justify-center py-3 px-4">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="프롬프트 키워드로 검색..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* 페이지 탭 */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <button
          type="button"
          onClick={() => onPageChange('browse')}
          className={`shrink-0 rounded-full px-5 py-1.5 text-xs font-semibold transition-colors ${
            activePage === 'browse'
              ? 'bg-indigo-500 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          🖼️ 이미지 브라우징
        </button>

        <button
          type="button"
          onClick={() => onPageChange('board')}
          className={`shrink-0 rounded-full px-5 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1 ${
            activePage === 'board'
              ? 'bg-indigo-500 text-white'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          📌 내 보드
          {savedCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1">
              {savedCount}
            </span>
          )}
        </button>
      </div>

      {/* 카테고리 필터 칩 */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          전체 {totalCount > 0 && `(${totalCount})`}
        </button>

        {IMAGE_TYPES.map((type) => {
          const count = categoryCounts[type.id] ?? 0;
          const isActive = activeFilter === type.id;
          return (
            <button
              type="button"
              key={type.id}
              onClick={() => onFilterChange(type.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
