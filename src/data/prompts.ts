import type { BlogParams, ImageCategory } from '../types';

/**
 * 비포/애프터 전용 프롬프트 — 사실적 사진 스타일.
 * before: 독립 생성
 * after : 비포 이미지를 레퍼런스로 넘길 때 사용
 */
export function getBeforeAfterPair(params: BlogParams): { before: string; after: string } {
  const { beforeKg, afterKg, duration } = params;
  const lossKg = beforeKg - afterKg;

  return {
    before: `Photorealistic full-body photograph of a Korean woman in her early 30s, standing in front of a full-length mirror in her bedroom. She weighs approximately ${beforeKg}kg. She has a round face and slightly chubby body shape. She is wearing a loose oversized grey hoodie and black leggings. Her expression is slightly uncomfortable and self-conscious, looking at herself in the mirror. The room has soft warm lighting, a neatly made bed in the background, and a wooden floor. Shot with a Canon EOS R5, 35mm lens, f/2.8, natural indoor lighting. The photo looks like a candid selfie-style mirror shot typical of Korean weight loss blog posts. High resolution, realistic skin texture, no filters.`,
    after: `Transform this EXACT SAME woman into her "after" version — she has lost ${lossKg}kg over ${duration} and now weighs ${afterKg}kg. CRITICAL: Keep the SAME face, same hair, same room, same mirror. Changes: visibly slimmer body (especially face, arms, waist), brighter confident smile, standing with better posture. She is now wearing a fitted white t-shirt tucked into high-waisted blue jeans that show her slimmer waist. The room lighting is brighter and warmer. The photo should still look like a realistic mirror selfie. She looks genuinely happy and proud. Same camera style, same realism level. Must be recognizably the SAME person.`,
  };
}

export function getPrompts(category: ImageCategory, params: BlogParams): string[] {
  const { beforeKg, afterKg, duration, situation } = params;
  const lossKg = beforeKg - afterKg;

  switch (category) {
    case 'before-after':
      return [getBeforeAfterPair(params).before];

    case 'healthy-food':
      return [
        // 1. 오버헤드 플랫레이 — 인스타 정석
        `Ultra high-quality overhead flat-lay food photography shot on iPhone 15 Pro. A beautiful Korean diet meal perfectly arranged on a white ceramic plate placed on a light oak wooden table. Grilled chicken breast sliced diagonally, quinoa salad with cherry tomatoes, cucumber, and avocado slices fanned out. A small glass of lemon-infused water with ice and a sprig of mint. Wooden chopsticks, a folded linen napkin, and a tiny potted succulent as props. Golden hour window light from the left casting soft shadows. Shallow depth of field on edges. The kind of photo that gets 10K likes on Korean Instagram food accounts. #먹스타그램 vibes.`,
        // 2. 45도 각도 — 카페 감성
        `Stunning 45-degree angle food photograph of a healthy Korean brunch spread at a trendy Seoul cafe. On a matte grey ceramic plate: smoked salmon on whole grain toast with cream cheese, arugula, capers, and a perfectly poached egg with runny yolk. Side dishes: a small bowl of mixed berries, a matcha latte in a handmade ceramic cup. Marble table surface with morning sunlight streaming through large cafe windows. Shot with portrait mode bokeh effect. Clean, bright, airy cafe aesthetic. Looks like a real Korean food blogger's photo. Natural colors, no heavy editing.`,
        // 3. 도시락 스타일
        `Photorealistic top-down photo of a meal-prepped Korean diet lunchbox (dosirak). Black rectangular bento box with compartments: brown rice with black sesame seeds, grilled tofu with teriyaki glaze, steamed broccoli and carrots, kimchi, and boiled egg halves. The lunchbox is placed on a clean white desk next to a laptop keyboard and a stainless steel water bottle, suggesting an office worker's healthy lunch. Fluorescent-free natural lighting. The photo looks exactly like what a Korean office worker would post on their diet Instagram account.`,
        // 4. 간식 트레이
        `Beautiful food photography of healthy Korean diet snacks artfully arranged on a round wooden serving board. Items: Greek yogurt in a glass jar topped with granola and fresh blueberries, sliced green apple with almond butter dip, a handful of mixed nuts (almonds, walnuts, cashews), rice cakes (뻥튀기) stacked neatly, and a cup of roasted barley tea (보리차). Shot from a 30-degree angle on a white linen tablecloth. Soft diffused natural light. Warm, cozy afternoon snack vibes. Instagram-worthy composition with negative space.`,
        // 5. 스무디볼
        `Gorgeous overhead photo of a purple acai smoothie bowl on a light terrazzo surface. Toppings arranged in neat rows: sliced banana, fresh strawberries, coconut flakes, chia seeds, granola clusters, and a drizzle of honey. A gold spoon rests on the side. Tiny dried flower petals scattered around the bowl. Morning light creating a bright, fresh atmosphere. The photo is styled exactly like popular Korean health Instagram accounts. Vibrant colors, clean composition, professional food styling.`,
        // 6. 식단 일기
        `Flat-lay photo of a weekly Korean diet meal plan spread. Multiple small ceramic bowls and plates arranged in a grid on a clean white surface. Each container has different healthy foods: japchae with vegetables, steamed fish, kongnamul (bean sprouts), stir-fried mushrooms, sweet potato cubes, and fresh salad. A handwritten meal plan notebook is open beside the food with cute Korean handwriting. A pink pen and small flower vase complete the scene. Shot from directly above. Clean, organized, motivational. Perfect for a diet journal blog post.`,
      ];

    case 'exercise':
      return [
        // 1. 홈트 — 요가매트 위
        `Photorealistic lifestyle photo of a bright home workout setup in a modern Korean apartment. A pastel pink yoga mat is rolled out on light wooden flooring. On the mat: a pair of 2kg pastel mint dumbbells, a foam roller, and a resistance band. Next to the mat: an iPhone on a phone stand showing a workout app timer, a white towel folded neatly, and a clear water bottle with lemon slices. Large windows with sheer white curtains let in soft morning light. The room is clean and minimalist with white walls and a small monstera plant in the corner. No people. The scene looks like a real Korean woman's morning workout setup photographed for her Instagram story.`,
        // 2. 러닝 — 한강/공원
        `A beautiful morning scene at a Korean park running trail (like Seoul's Han River park). Fresh running shoes (white Nike or New Balance) placed neatly on a clean section of the trail. Next to the shoes: wireless earbuds in their case, a Garmin fitness watch, and a small towel. The trail stretches into the background with cherry blossom trees (or autumn leaves). Soft golden morning light. Dew on the grass beside the trail. No people visible. The photo has a peaceful, motivational "morning run" energy. Shot with natural color grading, slight warm tone. Looks like a real Korean running community Instagram post.`,
        // 3. 필라테스/스트레칭
        `Clean lifestyle photograph of a Pilates/stretching setup in a bright Korean studio or living room. A rolled-out charcoal grey yoga mat with a Pilates ring and stretching strap placed on top. A small Bluetooth speaker, a candle (unlit), and a water bottle arranged beside the mat. The background shows a clean white wall with a minimalist wall clock and a small potted plant on a shelf. Soft overhead lighting mixed with natural window light. The scene suggests a calm evening stretching routine. No people. Looks like a wellness influencer's Instagram aesthetic.`,
        // 4. 운동 후 셀카 배경
        `Photorealistic photo of a gym mirror selfie background setup. Clean modern Korean fitness center mirror with good lighting. On the floor near the mirror: a gym bag slightly open, a shaker bottle with pink protein shake, a small towel, and wireless earbuds. The gym equipment (dumbbells rack, cable machine) is visible but blurred in the background. Bright fluorescent gym lighting mixed with natural light from windows. No people in frame. The setup looks like someone just finished an intense workout and is about to take a mirror selfie. Typical Korean gym aesthetics — clean, modern, well-lit.`,
      ];

    case 'scale-measurement':
      return [
        // 1. 체중계 + 기록
        `Ultra-realistic top-down photograph of a modern white digital bathroom scale on clean white marble tile floor. The LED display clearly shows ${afterKg}.0 kg in blue digits. Next to the scale: a pastel pink measuring tape coiled loosely, a small Moleskine-style notebook open to a page with handwritten weight tracking — dates and numbers in neat Korean handwriting, with ${beforeKg} crossed out with a red line and ${afterKg} circled with a heart drawn next to it. A black pen rests on the notebook. Soft bathroom lighting from above. The composition is clean, minimal, and celebratory. This represents a ${lossKg}kg weight loss achievement over ${duration}. Shot like a real person's proud progress photo.`,
        // 2. 줄자 측정
        `Close-up photorealistic photograph of a woman's hands holding a yellow measuring tape around her waist (only hands and midsection visible, wearing a fitted white crop top). The tape shows a slim measurement. Background is a clean bathroom mirror with soft warm lighting. The photo is cropped to show just the measuring moment — no face visible. It looks like a real progress photo someone would take to track their waist measurement during a diet. Natural skin tone, realistic lighting, no filters.`,
      ];

    case 'product-staging':
      return [
        // 1. 라이프스타일 플랫레이
        `High-end product photography of a health supplement in a lifestyle setting. A sleek, modern supplement bottle with a clean green and white label sits on a white marble kitchen counter. Around it: a glass of water, a small bowl of fresh mixed berries, a halved avocado, some spinach leaves, and a wooden cutting board. Morning sunlight streams in from a window, creating warm highlights and soft shadows. The aesthetic is premium Korean wellness brand — think "clean beauty" meets health food. NOT pharmaceutical looking. Instagram flat-lay composition from a 45-degree angle. Shot with a mirrorless camera, shallow depth of field, the bottle is in sharp focus.`,
        // 2. 아침 루틴
        `Cozy photorealistic still-life of a morning wellness routine on a light wooden bedside table or kitchen counter. A supplement bottle with natural green branding sits next to: a steaming cup of warm tea in a ceramic mug, a small white plate with sliced fruit (apple, banana), a glass of water, and a small potted herb plant (basil or mint). Warm golden morning light from the side. The scene looks like a real ${situation}'s healthy morning captured casually on their phone. Warm, authentic, relatable — not a staged advertisement. The bottle blends naturally into the scene.`,
        // 3. 가방 속 에센셜
        `Flat-lay "what's in my bag" style photo on a clean white background. A stylish Korean tote bag is open with contents spilled out aesthetically: the supplement bottle, a water bottle, a small snack bag of nuts, a phone, earbuds case, a lip balm, hand cream, and a small pouch. Everything is arranged neatly in a pleasing composition. Bright, even lighting from above. The supplement looks like a natural part of a health-conscious Korean woman's daily essentials. Clean, modern, lifestyle aesthetic. Shot from directly above.`,
      ];

    default:
      return [];
  }
}

const ANGLES = [
  'overhead bird-eye shot',
  '45-degree angle with shallow depth of field',
  'eye-level straight-on framing',
  'slight low angle looking up',
  'dutch angle with dynamic energy',
  '30-degree angle with foreground blur',
];
const LIGHTS = [
  'golden hour warm window light from the left',
  'bright overcast soft diffused daylight',
  'warm indoor lamp lighting with cool window backlight',
  'morning blue-hour cool tones with warm accent',
  'harsh midday sun with defined shadows',
  'soft studio-like even lighting',
];
const MOODS = [
  'clean minimal Scandinavian aesthetic',
  'warm cozy Korean cafe vibes',
  'bright airy Instagram influencer style',
  'moody editorial magazine look',
  'fresh morning energy feel',
  'calm evening wind-down mood',
];

const STYLE_GUIDES: Record<ImageCategory, string> = {
  'healthy-food': 'food styling arrangement, lighting direction and warmth, color palette of ingredients, plate/surface styling, and overall Instagram aesthetic',
  exercise: 'spatial arrangement, lighting mood, color temperature, equipment placement style, and motivational energy',
  'scale-measurement': 'composition minimalism, surface material, lighting softness, prop arrangement, and celebratory mood',
  'product-staging': 'product placement style, surrounding props arrangement, lighting direction, surface texture, and premium wellness brand aesthetic',
  'before-after': '',
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
    return `${base}\n\nVariation direction: ${angle}, ${light}, ${mood}. Keep the core subject but make the composition distinctly different.`;
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
