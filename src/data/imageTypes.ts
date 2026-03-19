import type { ImageTypeConfig } from '../types';

export const IMAGE_TYPES: ImageTypeConfig[] = [
  {
    id: 'before-after',
    label: '비포/애프터 체형',
    description: '다이어트 전후 체형 비교 일러스트 (2장)',
    promptCount: 2,
  },
  {
    id: 'healthy-food',
    label: '건강 식단',
    description: '다이어트 식단 음식 사진 (2장)',
    promptCount: 2,
  },
  {
    id: 'exercise',
    label: '운동/라이프스타일',
    description: '홈트, 러닝, 요가 등 운동 장면 (2장)',
    promptCount: 2,
  },
  {
    id: 'scale-measurement',
    label: '체중계/측정',
    description: '체중계, 줄자 측정 장면 (1장)',
    promptCount: 1,
  },
  {
    id: 'product-staging',
    label: '제품 연출',
    description: '파이토케미컬 보조제 제품 연출컷 (2장)',
    promptCount: 2,
  },
];
