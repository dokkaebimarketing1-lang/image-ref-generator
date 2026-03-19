import { X, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { IMAGE_TYPES } from '../data/imageTypes';
import type { BlogParams, ImageCategory } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  params: BlogParams;
  onParamsChange: (params: BlogParams) => void;
  perCategory: Record<ImageCategory, number>;
  onPerCategoryChange: (counts: Record<ImageCategory, number>) => void;
}

const TRIGGER_PRESETS = ['출산 후 체중 증가', '건강검진 충격', '여름 전 다이어트', '결혼 준비', '자신감 회복'];
const SITUATION_PRESETS = ['직장인', '육아맘', '자취 직장인', '프리랜서', '대학원생'];

export function SettingsPanel({
  open,
  onClose,
  apiKey,
  onApiKeyChange,
  params,
  onParamsChange,
  perCategory,
  onPerCategoryChange,
}: Props) {
  const [keyVisible, setKeyVisible] = useState(false);

  if (!open) return null;

  function updateParams(patch: Partial<BlogParams>) {
    onParamsChange({ ...params, ...patch });
  }

  function updateCount(id: ImageCategory, val: number) {
    onPerCategoryChange({ ...perCategory, [id]: Math.max(1, Math.min(12, val)) });
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* 백드롭 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm cursor-default"
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        aria-label="닫기"
      />

      {/* 패널 */}
      <div className="relative ml-14 w-96 bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-sm font-bold text-slate-800">설정</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* API 키 */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Gemini API Key</h3>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={keyVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-9 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setKeyVisible(!keyVisible)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => { localStorage.setItem('gemini-api-key', apiKey); }}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-600"
              >
                저장
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                키 발급받기 →
              </a>
            </p>
          </section>

          {/* 블로그 파라미터 */}
          <section>
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">블로그 파라미터</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="s-before" className="block text-[10px] text-slate-500 mb-0.5">감량 전 (kg)</label>
                <input id="s-before" type="number" value={params.beforeKg || ''} onChange={(e) => updateParams({ beforeKg: Number(e.target.value) })} className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="s-after" className="block text-[10px] text-slate-500 mb-0.5">감량 후 (kg)</label>
                <input id="s-after" type="number" value={params.afterKg || ''} onChange={(e) => updateParams({ afterKg: Number(e.target.value) })} className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="s-duration" className="block text-[10px] text-slate-500 mb-0.5">기간</label>
                <input id="s-duration" type="text" value={params.duration} onChange={(e) => updateParams({ duration: e.target.value })} placeholder="4개월" className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="s-trigger" className="block text-[10px] text-slate-500 mb-0.5">계기</label>
                <input id="s-trigger" type="text" value={params.trigger} onChange={(e) => updateParams({ trigger: e.target.value })} className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {TRIGGER_PRESETS.map((t) => (
                <button type="button" key={t} onClick={() => updateParams({ trigger: t })} className={`rounded-full px-2 py-0.5 text-[10px] ${params.trigger === t ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label htmlFor="s-situation" className="block text-[10px] text-slate-500 mb-0.5">직업/상황</label>
              <input id="s-situation" type="text" value={params.situation} onChange={(e) => updateParams({ situation: e.target.value })} className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {SITUATION_PRESETS.map((s) => (
                <button type="button" key={s} onClick={() => updateParams({ situation: s })} className={`rounded-full px-2 py-0.5 text-[10px] ${params.situation === s ? 'bg-indigo-100 text-indigo-700 font-medium' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* 주제별 장수 */}
          <section>
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">주제별 생성 장수</h3>
            <div className="space-y-2">
              {IMAGE_TYPES.map((type) => (
                <div key={type.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                  <span className="text-xs text-slate-600">{type.label}</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={perCategory[type.id]}
                    onChange={(e) => updateCount(type.id, Number(e.target.value))}
                    className="w-14 rounded border border-slate-200 px-2 py-1 text-center text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
