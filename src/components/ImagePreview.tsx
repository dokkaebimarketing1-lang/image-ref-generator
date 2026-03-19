import { X, Download, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import type { StoredImage } from '../lib/storage';
import type { ImageCategory } from '../types';

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  'before-after': '비포/애프터',
  'healthy-food': '건강 식단',
  exercise: '운동',
  'scale-measurement': '체중계',
  'product-staging': '제품 연출',
};

interface Props {
  image: StoredImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function ImagePreview({ image, onClose, onPrev, onNext, hasPrev, hasNext, isSaved = false, onToggleSave }: Props) {
  const category = image.category as ImageCategory;
  const dateStr = new Date(image.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  function handleDownload() {
    const a = document.createElement('a');
    a.href = image.dataUrl;
    a.download = `${image.category}-${image.id.slice(0, 8)}.png`;
    a.click();
  }

  async function handleCopy() {
    try {
      const res = await fetch(image.dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    } catch {
      await navigator.clipboard.writeText(image.dataUrl);
    }
  }

  return (
    <div
      role="dialog"
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft' && hasPrev) onPrev();
        if (e.key === 'ArrowRight' && hasNext) onNext();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] max-w-[90vw] gap-5 rounded-2xl bg-white p-5 shadow-2xl"
      >
        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 이전 */}
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* 다음 */}
        {hasNext && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-lg hover:bg-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <img
            src={image.dataUrl}
            alt={CATEGORY_LABELS[category]}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />
        </div>

        {/* 사이드 정보 */}
        <div className="w-56 shrink-0 flex flex-col gap-4">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {CATEGORY_LABELS[category]}
            </span>
            <p className="mt-2 text-xs text-slate-400">{dateStr}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-[11px] leading-relaxed text-slate-500 break-words">
              {image.prompt.slice(0, 300)}
              {image.prompt.length > 300 && '...'}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              다운로드
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              클립보드 복사
            </button>
            {onToggleSave && (
              <button
                type="button"
                onClick={onToggleSave}
                className={isSaved
                  ? "flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
                  : "flex items-center justify-center gap-2 rounded-lg border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                }
              >
                📌 {isSaved ? '저장됨 ✓' : '보드에 저장'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
