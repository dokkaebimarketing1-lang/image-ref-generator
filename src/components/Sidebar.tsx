import { Settings, Sparkles, Images, Trash2 } from 'lucide-react';

interface Props {
  onOpenSettings: () => void;
  onGenerate: () => void;
  onClearAll: () => void;
  isGenerating: boolean;
  totalImages: number;
}

export function Sidebar({
  onOpenSettings,
  onGenerate,
  onClearAll,
  isGenerating,
  totalImages,
}: Props) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-dvh w-14 flex-col items-center border-r border-slate-200 bg-white py-4 gap-2">
      {/* 로고 */}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-4">
        <Images className="w-4 h-4" />
      </div>

      {/* AI 생성 */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        title="오늘 분량 생성"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-pulse text-indigo-500' : ''}`} />
      </button>

      {/* 설정 */}
      <button
        type="button"
        onClick={onOpenSettings}
        title="설정"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* 이미지 수 */}
      {totalImages > 0 && (
        <div className="text-[10px] font-mono text-slate-400 leading-tight text-center mb-1">
          <span className="text-sm font-semibold text-indigo-500">{totalImages}</span>
          <br />장
        </div>
      )}

      {/* 전체 삭제 */}
      {totalImages > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          title="전체 삭제"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}
