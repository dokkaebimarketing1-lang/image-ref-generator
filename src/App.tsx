import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MasonryGrid } from './components/MasonryGrid';
import { ImagePreview } from './components/ImagePreview';
import { SetPreview } from './components/SetPreview';
import { SettingsPanel } from './components/SettingsPanel';
import { ProgressBar } from './components/ProgressBar';
import { IMAGE_TYPES } from './data/imageTypes';
import { getPromptVariants, getBeforeAfterPair, getBoardRefPrompt } from './data/prompts';
import { generateImage, generateImageFromReference, generateImageWithBoardRef } from './lib/gemini';
import {
  saveImage,
  getAllImages,
  clearAllImages,
  toggleSave,
  toggleSaveSet,
  getSavedImages,
  type StoredImage,
} from './lib/storage';
import type { BlogParams, ImageCategory, FilterTab, GenerationProgress, BeforeAfterSet } from './types';

const INITIAL_PARAMS: BlogParams = {
  beforeKg: 78,
  afterKg: 58,
  duration: '4개월',
  trigger: '건강검진 충격',
  situation: '직장인',
};

const INITIAL_PER_CATEGORY: Record<ImageCategory, number> = {
  'before-after': 4,
  'healthy-food': 6,
  exercise: 4,
  'scale-measurement': 3,
  'product-staging': 4,
};

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini-api-key') ?? '');
  const [params, setParams] = useState<BlogParams>(() => {
    const saved = localStorage.getItem('blog-params');
    return saved ? (JSON.parse(saved) as BlogParams) : INITIAL_PARAMS;
  });
  const [perCategory, setPerCategory] = useState<Record<ImageCategory, number>>(() => {
    const saved = localStorage.getItem('per-category');
    return saved ? (JSON.parse(saved) as Record<ImageCategory, number>) : INITIAL_PER_CATEGORY;
  });

  const [images, setImages] = useState<StoredImage[]>([]);
  const [activePage, setActivePage] = useState<'browse' | 'board'>('browse');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
  const [selectedSet, setSelectedSet] = useState<BeforeAfterSet | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // IndexedDB에서 이미지 로드
  useEffect(() => {
    getAllImages().then(setImages);
  }, []);

  // 설정 영속화
  useEffect(() => { localStorage.setItem('blog-params', JSON.stringify(params)); }, [params]);
  useEffect(() => { localStorage.setItem('per-category', JSON.stringify(perCategory)); }, [perCategory]);
  useEffect(() => {
    if (apiKey) localStorage.setItem('gemini-api-key', apiKey);
  }, [apiKey]);

  const savedImageIds = useMemo(
    () => new Set(images.filter((img) => img.isSaved).map((img) => img.id)),
    [images],
  );
  const savedCount = savedImageIds.size;

  // 필터링된 이미지
  const filteredImages = useMemo(() => {
    let list = activePage === 'board' ? images.filter((img) => img.isSaved) : images;
    if (activeFilter !== 'all') {
      list = list.filter((img) => img.category === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((img) => img.prompt.toLowerCase().includes(q));
    }
    return list;
  }, [images, activePage, activeFilter, searchQuery]);

  // 카테고리별 카운트
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const img of images) {
      counts[img.category] = (counts[img.category] ?? 0) + 1;
    }
    return counts;
  }, [images]);

  // 프리뷰 네비게이션
  const selectedIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrevImage = useCallback(() => {
    if (selectedIndex > 0) setSelectedImage(filteredImages[selectedIndex - 1]);
  }, [filteredImages, selectedIndex]);

  const handleNextImage = useCallback(() => {
    if (selectedIndex < filteredImages.length - 1) setSelectedImage(filteredImages[selectedIndex + 1]);
  }, [filteredImages, selectedIndex]);

  async function handleToggleSave(id: string) {
    const newState = await toggleSave(id);
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, isSaved: newState } : img)));
  }

  async function handleToggleSaveSet(setId: string) {
    const newState = await toggleSaveSet(setId);
    setImages((prev) => prev.map((img) => (img.setId === setId ? { ...img, isSaved: newState } : img)));
  }

  // ── 비포/애프터 세트 생성 (비포 → 레퍼런스로 애프터) ──
  async function generateBeforeAfterSets(
    batchId: string,
    errors: string[],
    completedRef: { value: number },
  ) {
    const setCount = Math.floor((perCategory['before-after'] ?? 4) / 2) || 1;
    const pair = getBeforeAfterPair(params);

    for (let s = 0; s < setCount; s++) {
      const setId = `set-${Date.now()}-${s}`;

      // 1) 비포 생성
      setProgress((prev) => (prev ? { ...prev, currentLabel: `비포/애프터 세트 ${s + 1} — 비포 생성 중` } : prev));
      let beforeDataUrl: string;
      try {
        beforeDataUrl = await generateImage(apiKey, pair.before);
        const beforeStored: StoredImage = {
          id: `${Date.now()}-ba-before-${s}`,
          category: 'before-after',
          prompt: `[비포] ${pair.before}`,
          dataUrl: beforeDataUrl,
          createdAt: Date.now(),
          batchId,
          setId,
          setRole: 'before',
        };
        await saveImage(beforeStored);
        setImages((prev) => [beforeStored, ...prev]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : '알 수 없는 오류';
        errors.push(`비포 세트${s + 1}: ${msg}`);
        completedRef.value += 2;
        setProgress((prev) => (prev ? { ...prev, completed: completedRef.value, errors: [...errors] } : prev));
        continue;
      }

      completedRef.value += 1;
      setProgress((prev) => (prev ? { ...prev, completed: completedRef.value } : prev));
      await new Promise((r) => setTimeout(r, 2500));

      // 2) 애프터 생성 (비포 이미지를 레퍼런스로 전달 → 같은 사람)
      setProgress((prev) => (prev ? { ...prev, currentLabel: `비포/애프터 세트 ${s + 1} — 애프터 생성 중 (같은 사람)` } : prev));
      try {
        const afterDataUrl = await generateImageFromReference(apiKey, beforeDataUrl, pair.after);
        const afterStored: StoredImage = {
          id: `${Date.now()}-ba-after-${s}`,
          category: 'before-after',
          prompt: `[애프터] ${pair.after}`,
          dataUrl: afterDataUrl,
          createdAt: Date.now(),
          batchId,
          setId,
          setRole: 'after',
        };
        await saveImage(afterStored);
        setImages((prev) => [afterStored, ...prev]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : '알 수 없는 오류';
        errors.push(`애프터 세트${s + 1}: ${msg}`);
      }

      completedRef.value += 1;
      setProgress((prev) => (prev ? { ...prev, completed: completedRef.value, errors: [...errors] } : prev));

      if (s < setCount - 1) await new Promise((r) => setTimeout(r, 2500));
    }
  }

  // ── 오늘 분량 생성 ──
  async function handleGenerate() {
    if (!apiKey || isGenerating) return;

    setIsGenerating(true);
    const errors: string[] = [];
    const batchId = `batch-${Date.now()}`;
    const boardImages = await getSavedImages();

    // 총 작업 수 계산
    const beforeAfterCount = perCategory['before-after'] ?? 4;
    const otherTasks: { category: ImageCategory; prompt: string; label: string }[] = [];
    for (const type of IMAGE_TYPES) {
      if (type.id === 'before-after') continue; // 별도 처리
      const count = perCategory[type.id] ?? 4;
      const prompts = getPromptVariants(type.id, params, count);
      prompts.forEach((prompt, i) => {
        otherTasks.push({ category: type.id, prompt, label: `${type.label} ${i + 1}/${prompts.length}` });
      });
    }

    const totalCount = beforeAfterCount + otherTasks.length;
    const completedRef = { value: 0 };

    setProgress({ total: totalCount, completed: 0, currentLabel: '비포/애프터 세트 생성 시작...', errors: [] });

    // Step 1: 비포/애프터 세트 (레퍼런스 기반)
    await generateBeforeAfterSets(batchId, errors, completedRef);

    // Step 2: 나머지 카테고리 (일반 생성)
    for (let i = 0; i < otherTasks.length; i++) {
      const task = otherTasks[i];
      setProgress((prev) => (prev ? { ...prev, currentLabel: `${task.label} 생성 중` } : prev));

      try {
        const useBoardRef = boardImages.length > 0 && Math.random() < 0.3;
        let dataUrl: string;
        if (useBoardRef) {
          const refImg = boardImages[Math.floor(Math.random() * boardImages.length)];
          const boardPrompt = getBoardRefPrompt(task.category, params, task.prompt);
          dataUrl = await generateImageWithBoardRef(apiKey, refImg.dataUrl, boardPrompt);
          setProgress((prev) => (prev ? { ...prev, currentLabel: `${task.label} 생성 중 (보드 레퍼런스 적용 ✨)` } : prev));
        } else {
          dataUrl = await generateImage(apiKey, task.prompt);
        }
        const stored: StoredImage = {
          id: `${Date.now()}-${i}-${task.category}`,
          category: task.category,
          prompt: task.prompt,
          dataUrl,
          createdAt: Date.now(),
          batchId,
        };
        await saveImage(stored);
        setImages((prev) => [stored, ...prev]);
      } catch (error) {
        const msg = error instanceof Error ? error.message : '알 수 없는 오류';
        errors.push(`${task.label}: ${msg}`);
      }

      completedRef.value += 1;
      setProgress((prev) => (prev ? { ...prev, completed: completedRef.value, errors: [...errors] } : prev));

      if (i < otherTasks.length - 1) {
        await new Promise((r) => setTimeout(r, 2500));
      }
    }

    setProgress(null);
    setIsGenerating(false);
  }

  async function handleClearAll() {
    await clearAllImages();
    setImages([]);
    setSelectedImage(null);
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      {/* 좌측 아이콘 사이드바 */}
      <Sidebar
        onOpenSettings={() => setSettingsOpen(true)}
        onGenerate={handleGenerate}
        onClearAll={handleClearAll}
        isGenerating={isGenerating}
        totalImages={images.length}
      />

      {/* 메인 영역 (사이드바 오른쪽) */}
      <div className="ml-14">
        {/* 상단바: 검색 + 필터칩 */}
        <TopBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categoryCounts={categoryCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePage={activePage}
          onPageChange={setActivePage}
          savedCount={savedCount}
        />

        {/* 프로그레스 */}
        {progress && (
          <div className="px-4 pt-4">
            <ProgressBar progress={progress} />
          </div>
        )}

        {/* 매소니 그리드 */}
        <MasonryGrid
          images={filteredImages}
          onSelectImage={setSelectedImage}
          onSelectSet={setSelectedSet}
          savedImageIds={savedImageIds}
          onToggleSave={handleToggleSave}
          onToggleSaveSet={handleToggleSaveSet}
        />
      </div>

      {/* 설정 패널 */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        params={params}
        onParamsChange={setParams}
        perCategory={perCategory}
        onPerCategoryChange={setPerCategory}
      />

      {/* 일반 이미지 프리뷰 모달 */}
      {selectedImage && (
        <ImagePreview
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filteredImages.length - 1}
          isSaved={savedImageIds.has(selectedImage.id)}
          onToggleSave={() => handleToggleSave(selectedImage.id)}
        />
      )}

      {/* 비포/애프터 세트 비교 프리뷰 모달 */}
      {selectedSet && (
        <SetPreview
          set={selectedSet}
          onClose={() => setSelectedSet(null)}
          isSaved={savedImageIds.has(selectedSet.before.id)}
          onToggleSave={() => handleToggleSaveSet(selectedSet.setId)}
        />
      )}
    </div>
  );
}

export default App;
