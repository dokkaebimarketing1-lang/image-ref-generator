import { Download, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import type { ImageCategory } from '../types';
import type { StoredImage } from '../lib/storage';

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  'before-after': '비포/애프터',
  'healthy-food': '건강 식단',
  exercise: '운동',
  'scale-measurement': '체중계',
  'product-staging': '제품 연출',
};

const CATEGORY_COLORS: Record<ImageCategory, string> = {
  'before-after': 'bg-purple-500',
  'healthy-food': 'bg-green-500',
  exercise: 'bg-orange-500',
  'scale-measurement': 'bg-blue-500',
  'product-staging': 'bg-emerald-500',
};

interface Props {
  image: StoredImage;
  onSelect: (image: StoredImage) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export function ImageCard({ image, onSelect, isSaved, onToggleSave }: Props) {
  const [loaded, setLoaded] = useState(false);
  const category = image.category as ImageCategory;
  const dateStr = new Date(image.createdAt).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  });

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = image.dataUrl;
    a.download = `${image.category}-${image.id.slice(0, 8)}.png`;
    a.click();
  }

  function handleToggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleSave(image.id);
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(image)}
      className="group relative break-inside-avoid mb-4 w-full text-left cursor-pointer"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        {/* 이미지 */}
        <div className="relative bg-slate-100">
          {!loaded && (
            <div className="h-52 animate-pulse bg-slate-200 rounded-t-xl" />
          )}
          <img
            src={image.dataUrl}
            alt={CATEGORY_LABELS[category]}
            onLoad={() => setLoaded(true)}
            className={`w-full object-cover transition-transform group-hover:scale-[1.02] ${loaded ? '' : 'absolute inset-0 opacity-0'}`}
            loading="lazy"
          />

          {/* 호버 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span
                role="img"
                aria-label="download"
                onClick={handleDownload}
                onKeyDown={(e) => { if (e.key === 'Enter') handleDownload(e as unknown as React.MouseEvent); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm hover:bg-white"
              >
                <Download className="w-4 h-4" />
              </span>
              <span
                role="img"
                aria-label="preview"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg backdrop-blur-sm hover:bg-white"
              >
                <Maximize2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

         {/* 하단 메타 */}
         <div className="px-3 py-2.5">
           <div className="flex items-center justify-between">
             <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${CATEGORY_COLORS[category]}`}>
               {CATEGORY_LABELS[category]}
             </span>
             <button
               type="button"
               onClick={handleToggleSave}
               className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                 isSaved
                   ? 'bg-indigo-500 text-white'
                   : 'border border-slate-200 text-slate-500 hover:border-slate-300'
               }`}
             >
               {isSaved ? '저장됨 ✓' : '보드에 저장'}
             </button>
           </div>
           <p className="mt-1.5 text-[11px] text-slate-400 truncate">{dateStr}</p>
         </div>
      </div>
    </button>
  );
}
