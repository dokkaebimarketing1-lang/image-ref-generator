import { useMemo } from 'react';
import { ImageCard } from './ImageCard';
import { BeforeAfterCard } from './BeforeAfterCard';
import type { StoredImage } from '../lib/storage';
import type { BeforeAfterSet } from '../types';

interface Props {
  images: StoredImage[];
  onSelectImage: (image: StoredImage) => void;
  onSelectSet: (set: BeforeAfterSet) => void;
  savedImageIds: Set<string>;
  onToggleSave: (id: string) => void;
  onToggleSaveSet: (setId: string) => void;
}

/** 비포/애프터 이미지를 setId로 묶어서 세트 배열로 변환 */
function groupBeforeAfterSets(images: StoredImage[]): BeforeAfterSet[] {
  const map = new Map<string, { before?: StoredImage; after?: StoredImage }>();

  for (const img of images) {
    if (img.category !== 'before-after' || !img.setId) continue;
    const entry = map.get(img.setId) ?? {};
    if (img.setRole === 'before') entry.before = img;
    else if (img.setRole === 'after') entry.after = img;
    map.set(img.setId, entry);
  }

  const sets: BeforeAfterSet[] = [];
  for (const [setId, { before, after }] of map) {
    if (!before) continue;
    sets.push({
      setId,
      before: { id: before.id, dataUrl: before.dataUrl, prompt: before.prompt, createdAt: before.createdAt },
      after: after
        ? { id: after.id, dataUrl: after.dataUrl, prompt: after.prompt, createdAt: after.createdAt }
        : null,
    });
  }

  return sets.sort((a, b) => b.before.createdAt - a.before.createdAt);
}

export function MasonryGrid({ images, onSelectImage, onSelectSet, savedImageIds, onToggleSave, onToggleSaveSet }: Props) {
  const baSets = useMemo(() => groupBeforeAfterSets(images), [images]);
  const otherImages = useMemo(
    () => images.filter((img) => img.category !== 'before-after'),
    [images],
  );

  // 필터가 before-after만이면 세트만 보여주고, 전체/다른 탭이면 혼합
  const showSets = baSets.length > 0;
  const showOther = otherImages.length > 0;

  if (!showSets && !showOther) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <div className="text-5xl mb-4">🖼️</div>
        <p className="text-sm font-medium">아직 생성된 이미지가 없습니다</p>
        <p className="text-xs mt-1">왼쪽 ✨ 버튼을 눌러 오늘 분량을 생성하세요</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* 비포/애프터 세트 카드 (가로 넓게, 2열) */}
       {showSets && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {baSets.map((set) => {
             const isSaved = savedImageIds.has(set.before.id) || (set.after ? savedImageIds.has(set.after.id) : false);
             return (
               <BeforeAfterCard
                 key={set.setId}
                 set={set}
                 onSelect={onSelectSet}
                 isSaved={isSaved}
                 onToggleSaveSet={onToggleSaveSet}
               />
             );
           })}
         </div>
       )}

       {/* 일반 카드 (매소니 그리드) */}
       {showOther && (
         <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4">
           {otherImages.map((image) => (
             <ImageCard
               key={image.id}
               image={image}
               onSelect={onSelectImage}
               isSaved={savedImageIds.has(image.id)}
               onToggleSave={onToggleSave}
             />
           ))}
         </div>
       )}
    </div>
  );
}
