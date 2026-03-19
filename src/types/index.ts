export type ImageCategory =
  | 'before-after'
  | 'healthy-food'
  | 'exercise'
  | 'scale-measurement'
  | 'product-staging';

export interface BlogParams {
  beforeKg: number;
  afterKg: number;
  duration: string;
  trigger: string;
  situation: string;
}

export interface ImageTypeConfig {
  id: ImageCategory;
  label: string;
  description: string;
  promptCount: number;
}

export interface GeneratedImage {
  id: string;
  category: ImageCategory;
  prompt: string;
  imageDataUrl: string;
  timestamp: number;
}

export interface GenerationProgress {
  total: number;
  completed: number;
  currentLabel: string;
  errors: string[];
}

export type FilterTab = 'all' | ImageCategory;

/** 비포/애프터 세트를 묶어서 보여주기 위한 타입 */
export interface BeforeAfterSet {
  setId: string;
  before: { id: string; dataUrl: string; prompt: string; createdAt: number };
  after: { id: string; dataUrl: string; prompt: string; createdAt: number } | null;
}
