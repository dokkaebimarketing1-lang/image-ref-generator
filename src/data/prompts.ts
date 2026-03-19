import type { BlogParams, ImageCategory } from '../types';

/**
 * 비포/애프터 전용 프롬프트.
 * before: 독립 생성용 프롬프트
 * after : 비포 이미지를 레퍼런스로 넘길 때 같이 보내는 변환 프롬프트
 */
export function getBeforeAfterPair(params: BlogParams): { before: string; after: string } {
  const { beforeKg, afterKg, duration } = params;
  const lossKg = beforeKg - afterKg;

  return {
    before: `A soft watercolor-style illustration of a Korean woman in her 30s, standing on a bathroom scale looking worried. She appears to weigh around ${beforeKg}kg with a slightly fuller figure. She's wearing comfortable home clothes (oversized t-shirt and sweatpants). The mood is a bit gloomy with muted colors. Bathroom setting with warm lighting. Blog-style illustration, NOT photorealistic. Korean beauty standard proportions. Vertical composition suitable for a blog post.`,
    after: `Transform this SAME person into her "after" version. She has now lost ${lossKg}kg over ${duration}, weighing ${afterKg}kg. KEEP the same face, same art style, same illustration technique. Changes: slimmer body, brighter expression with a confident smile, wearing fitted casual clothes instead of oversized ones, vibrant warm colors replacing the gloomy tones, sunshine feeling. She's looking at herself in a mirror with a satisfied expression. CRITICAL: must look like the SAME person, just healthier and slimmer.`,
  };
}

export function getPrompts(category: ImageCategory, params: BlogParams): string[] {
  const { beforeKg, afterKg, duration, situation } = params;
  const lossKg = beforeKg - afterKg;

  switch (category) {
    case 'before-after':
      // 세트 생성은 getBeforeAfterPair()를 사용. 여기는 fallback/변주용
      return [
        getBeforeAfterPair(params).before,
      ];

    case 'healthy-food':
      return [
        // 다이어트 식단 1 — 아침/점심
        `Overhead flat-lay food photography of a healthy Korean diet meal on a clean white marble table. The meal includes: grilled chicken breast, mixed green salad with cherry tomatoes and avocado, brown rice in a small ceramic bowl, and a glass of lemon water. Natural soft window lighting from the left. Minimal styling with wooden chopsticks and a linen napkin. Instagram-worthy food photography style. High resolution, appetizing colors.`,
        // 다이어트 식단 2 — 간식/보조
        `Aesthetic food photography of healthy Korean diet snacks arranged on a light wooden tray. Items include: Greek yogurt topped with mixed berries and granola, sliced sweet potato, a small bowl of mixed nuts, and a cup of green tea. Soft natural lighting, minimalist styling. Shot from a 45-degree angle. Clean, bright, and fresh feeling. Blog-worthy food photography for a ${situation}'s diet journey.`,
      ];

    case 'exercise':
      return [
        // 운동 장면 1 — 실내
        `A bright, motivational lifestyle photograph of a home workout scene. Focus on exercise equipment arranged neatly: a yoga mat in pastel color, light dumbbells (2-3kg), resistance bands, and a water bottle. A phone showing a workout timer is placed nearby. Clean modern Korean apartment interior with wooden flooring and natural light streaming through windows. No people in the frame. Warm, inviting atmosphere that motivates exercise. Blog-style photography.`,
        // 운동 장면 2 — 야외
        `A beautiful morning jogging scene photograph. Focus on running shoes on a clean park trail, with trees and soft morning sunlight creating a peaceful atmosphere. A fitness tracker watch and earbuds are placed beside the shoes. Fresh morning dew on grass. The scene suggests a healthy outdoor exercise routine. No people visible. Soft, warm color grading. Perfect for a diet blog about a ${situation}'s ${duration} weight loss journey.`,
      ];

    case 'scale-measurement':
      return [
        // 체중계 장면
        `Top-down photograph of a modern digital bathroom scale on clean white tile floor. The scale display shows ${afterKg}.0 kg. Next to the scale: a measuring tape showing a slim waist measurement, a small notebook with handwritten weight tracking numbers (${beforeKg} crossed out, arrow pointing to ${afterKg} circled with a heart), and a pen. Soft bathroom lighting. Clean, minimal composition. The mood is celebratory and satisfying — representing a ${lossKg}kg weight loss achievement. Blog-style product photography.`,
      ];

    case 'product-staging':
      return [
        // 제품 연출 1 — 라이프스타일
        `Aesthetic lifestyle product photography of a health supplement bottle on a clean white marble surface. The bottle is a modern, minimal design with a green/natural color label reading "Phytochemical Fiber" in elegant typography. Surrounding the bottle: fresh green vegetables (broccoli, spinach leaves), colorful fruits (blueberries, oranges), and a glass of water. Soft natural morning light from the side. Clean, premium, health-conscious mood. Instagram-worthy flat lay composition. NOT medical or pharmaceutical looking — lifestyle and wellness aesthetic.`,
        // 제품 연출 2 — 일상 복용 장면
        `A cozy morning routine still-life photograph on a kitchen counter. A supplement bottle with a natural green label sits next to a breakfast setting: a cup of warm tea, a small plate of fruits, and a glass of water with the supplement powder dissolved (light green color). A small potted plant and morning sunlight complete the scene. The mood is calm, healthy daily routine of a ${situation}. Warm, inviting color palette. Blog-worthy lifestyle photography that feels authentic and relatable, not like an advertisement.`,
      ];

    default:
      return [];
  }
}

const ANGLES = ['top-down composition', '45-degree angle', 'eye-level framing'];
const LIGHTS = ['soft morning light', 'natural daylight', 'warm indoor lighting'];
const MOODS = ['clean and minimal mood', 'bright editorial style', 'cozy lifestyle look'];

const STYLE_GUIDES: Record<ImageCategory, string> = {
  'healthy-food': 'lighting style, composition layout, and color palette',
  'exercise': 'mood and atmosphere, spatial depth, and color temperature',
  'scale-measurement': 'minimalist style, background color, and lighting angle',
  'product-staging': 'product presentation mood, background texture, and light direction',
  'before-after': '', // Not applicable for before-after sets
};

export function getPromptVariants(
  category: ImageCategory,
  params: BlogParams,
  count: number,
): string[] {
  const basePrompts = getPrompts(category, params);
  if (basePrompts.length === 0 || count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const base = basePrompts[index % basePrompts.length];
    const angle = ANGLES[index % ANGLES.length];
    const light = LIGHTS[index % LIGHTS.length];
    const mood = MOODS[index % MOODS.length];
    return `${base} Variation ${index + 1}: ${angle}, ${light}, ${mood}. Keep subject and context consistent but composition distinct.`;
  });
}

export function getBoardRefPrompt(
  category: ImageCategory,
  _params: BlogParams,
  originalPrompt: string,
): string {
  if (category === 'before-after') return originalPrompt;
  const styleGuide = STYLE_GUIDES[category];
  return `[STYLE REFERENCE MODE] Use the attached image as a style reference only. Focus on: ${styleGuide}. Create a completely new composition — different angle, different framing. Do NOT copy the subject or layout.\n\n${originalPrompt}`;
}
