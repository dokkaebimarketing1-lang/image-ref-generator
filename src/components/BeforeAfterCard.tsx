import { Download, ArrowRight } from 'lucide-react';
import type { BeforeAfterSet } from '../types';

interface Props {
  set: BeforeAfterSet;
  onSelect: (set: BeforeAfterSet) => void;
  isSaved: boolean;
  onToggleSaveSet: (setId: string) => void;
}

export function BeforeAfterCard({ set, onSelect, isSaved, onToggleSaveSet }: Props) {
  const dateStr = new Date(set.before.createdAt).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  function handleDownloadBoth(e: React.MouseEvent) {
    e.stopPropagation();
    const dl = (url: string, name: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    };
    dl(set.before.dataUrl, `before-${set.setId}.png`);
    if (set.after) {
      setTimeout(() => dl(set.after!.dataUrl, `after-${set.setId}.png`), 300);
    }
  }

  function handleToggleSaveSet(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleSaveSet(set.setId);
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(set)}
      className="group w-full break-inside-avoid mb-4 text-left cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        {/* 비교 이미지 영역 */}
        <div className="relative flex">
          {/* 비포 */}
          <div className="relative w-1/2 bg-slate-100 overflow-hidden">
            <div className="absolute top-2 left-2 z-10 rounded-full bg-red-500/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
              BEFORE
            </div>
            <img
              src={set.before.dataUrl}
              alt="비포"
              className="w-full aspect-[3/4] object-cover transition-transform group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>

          {/* 화살표 구분선 */}
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200">
            <ArrowRight className="w-4 h-4 text-indigo-500" />
          </div>

          {/* 애프터 */}
          <div className="relative w-1/2 bg-slate-100 overflow-hidden">
            <div className="absolute top-2 right-2 z-10 rounded-full bg-indigo-500/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
              AFTER
            </div>
            {set.after ? (
              <img
                src={set.after.dataUrl}
                alt="애프터"
                className="w-full aspect-[3/4] object-cover transition-transform group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center bg-slate-200 text-xs text-slate-400">
                생성 중...
              </div>
            )}
          </div>

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/15 transition-colors">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                role="img"
                aria-label="download"
                onClick={handleDownloadBoth}
                onKeyDown={(e) => { if (e.key === 'Enter') handleDownloadBoth(e as unknown as React.MouseEvent); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm hover:bg-white"
              >
                <Download className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

         {/* 하단 메타 */}
         <div className="px-3 py-2.5">
           <div className="flex items-center justify-between">
             <span className="inline-block rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-semibold text-white">
               비포/애프터 세트
             </span>
             <button
               type="button"
               onClick={handleToggleSaveSet}
               className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                 isSaved
                   ? 'bg-indigo-500 text-white'
                   : 'border border-slate-200 text-slate-500 hover:border-slate-300'
               }`}
             >
               {isSaved ? '저장됨 ✓' : '보드에 저장'}
             </button>
           </div>
           <p className="mt-1.5 text-[11px] text-slate-400">{dateStr} · 세트 비교</p>
         </div>
      </div>
    </button>
  );
}
