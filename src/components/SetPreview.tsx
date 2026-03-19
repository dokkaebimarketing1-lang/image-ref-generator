import { X, Download, ArrowRight } from 'lucide-react';
import type { BeforeAfterSet } from '../types';

interface Props {
  set: BeforeAfterSet;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function SetPreview({ set, onClose, isSaved = false, onToggleSave }: Props) {
  const dateStr = new Date(set.before.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  function downloadBoth() {
    const dl = (url: string, name: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    };
    dl(set.before.dataUrl, `before-${set.setId}.png`);
    if (set.after) setTimeout(() => dl(set.after!.dataUrl, `after-${set.setId}.png`), 300);
  }

  return (
    <div
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl mx-4"
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
        </button>

         {/* 타이틀 */}
         <div className="flex items-center justify-between mb-5">
           <div>
             <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
               비포/애프터 세트 비교
             </span>
             <p className="mt-1 text-xs text-slate-400">{dateStr}</p>
           </div>
           <div className="flex items-center gap-2">
             {onToggleSave && (
               <button
                 type="button"
                 onClick={onToggleSave}
                 className={isSaved
                   ? "flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
                   : "flex items-center gap-2 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                 }
               >
                 📌 {isSaved ? '저장됨 ✓' : '보드에 저장'}
               </button>
             )}
             <button
               type="button"
               onClick={downloadBoth}
               className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
             >
               <Download className="w-4 h-4" />
               세트 다운로드
             </button>
           </div>
         </div>

        {/* 비교 뷰 */}
        <div className="flex items-stretch gap-4">
          {/* 비포 */}
          <div className="flex-1 rounded-xl overflow-hidden border-2 border-red-200 bg-red-50/30">
            <div className="bg-red-500 px-3 py-1.5 text-center text-xs font-bold text-white tracking-wider">
              BEFORE
            </div>
            <img
              src={set.before.dataUrl}
              alt="비포"
              className="w-full object-contain max-h-[60vh]"
            />
          </div>

          {/* 화살표 */}
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* 애프터 */}
          <div className="flex-1 rounded-xl overflow-hidden border-2 border-indigo-200 bg-indigo-50/30">
            <div className="bg-indigo-500 px-3 py-1.5 text-center text-xs font-bold text-white tracking-wider">
              AFTER
            </div>
            {set.after ? (
              <img
                src={set.after.dataUrl}
                alt="애프터"
                className="w-full object-contain max-h-[60vh]"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-sm text-slate-400">
                애프터 생성 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
