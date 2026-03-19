import type { GenerationProgress } from '../types';

interface Props {
  progress: GenerationProgress;
}

export function ProgressBar({ progress }: Props) {
  const pct = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-indigo-700">
          🎨 이미지 생성 중...
        </span>
        <span className="text-xs text-indigo-500 font-mono">
          {progress.completed} / {progress.total}
        </span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-2 rounded-full bg-indigo-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-indigo-400">{progress.currentLabel}</p>

      {/* 에러 목록 */}
      {progress.errors.length > 0 && (
        <div className="mt-3 space-y-1">
          {progress.errors.map((err) => (
            <p key={err} className="text-xs text-red-500">
              ⚠️ {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
