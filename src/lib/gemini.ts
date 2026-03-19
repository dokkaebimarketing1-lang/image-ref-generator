import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.1-flash-image-preview';

/** data:image/png;base64,xxxx → raw base64 string */
function stripDataUrl(dataUrl: string): { mime: string; data: string } {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) throw new Error('올바른 data URL이 아닙니다.');
  return { mime: match[1], data: match[2] };
}

/** 텍스트 프롬프트만으로 이미지 생성 */
export async function generateImage(apiKey: string, prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  return extractImage(response);
}

/**
 * 레퍼런스 이미지 + 프롬프트 → 변형 이미지 생성
 * 비포/애프터 세트용: 비포 이미지를 넘기고 "같은 사람, 살 빠진 버전" 요청
 */
export async function generateImageFromReference(
  apiKey: string,
  referenceDataUrl: string,
  prompt: string,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const { mime, data } = stripDataUrl(referenceDataUrl);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { inlineData: { mimeType: mime, data } },
      { text: prompt },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  return extractImage(response);
}

/**
 * 보드 이미지를 스타일 참고로 사용하여 새로운 이미지 생성
 * 보드 이미지의 분위기, 색상 팔레트, 조명, 미학만 참고하고
 * 구성이나 주제는 복사하지 않음
 */
export async function generateImageWithBoardRef(
  apiKey: string,
  boardImageDataUrl: string,
  prompt: string,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const { mime, data } = stripDataUrl(boardImageDataUrl);

  const enhancedPrompt = `Use the attached image as a STYLE REFERENCE ONLY (mood, color palette, lighting, overall aesthetic).
DO NOT copy the composition or subject. Create a completely NEW image with different framing and layout.
${prompt}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { inlineData: { mimeType: mime, data } },
      { text: enhancedPrompt },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  return extractImage(response);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractImage(response: any): string {
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error('응답에서 이미지를 찾을 수 없습니다.');
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType ?? 'image/png';
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('이미지 생성에 실패했습니다. 프롬프트를 수정해보세요.');
}
