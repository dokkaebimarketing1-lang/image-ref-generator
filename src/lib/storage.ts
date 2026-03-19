import Dexie, { type EntityTable } from 'dexie';

export interface StoredImage {
  id: string;
  category: string;
  prompt: string;
  dataUrl: string;
  createdAt: number;
  batchId: string;
  /** 비포/애프터 세트 연결용 (같은 setId = 같은 세트) */
  setId?: string;
  /** 세트 내 역할: 'before' | 'after' */
  setRole?: 'before' | 'after';
  /** 저장 여부 */
  isSaved?: boolean;
}

const db = new Dexie('image-ref-db') as Dexie & {
  images: EntityTable<StoredImage, 'id'>;
};

db.version(2).stores({
  images: 'id, category, batchId, createdAt, setId',
});

db.version(3).stores({
  images: 'id, category, batchId, createdAt, setId, isSaved',
});

export async function saveImage(image: StoredImage): Promise<void> {
  await db.images.put(image);
}

export async function getAllImages(): Promise<StoredImage[]> {
  return db.images.orderBy('createdAt').reverse().toArray();
}

export async function getImagesByCategory(category: string): Promise<StoredImage[]> {
  return db.images.where('category').equals(category).reverse().sortBy('createdAt');
}

export async function getImagesByBatch(batchId: string): Promise<StoredImage[]> {
  return db.images.where('batchId').equals(batchId).toArray();
}

export async function deleteImage(id: string): Promise<void> {
  await db.images.delete(id);
}

export async function clearAllImages(): Promise<void> {
  await db.images.clear();
}

export async function clearCategory(category: string): Promise<void> {
  await db.images.where('category').equals(category).delete();
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const all = await db.images.toArray();
  const counts: Record<string, number> = {};
  for (const img of all) {
    counts[img.category] = (counts[img.category] ?? 0) + 1;
  }
  return counts;
}

export async function toggleSave(id: string): Promise<boolean> {
  const image = await db.images.get(id);
  if (!image) throw new Error(`Image with id ${id} not found`);
  
  const newSavedState = !image.isSaved;
  await db.images.update(id, { isSaved: newSavedState });
  return newSavedState;
}

export async function toggleSaveSet(setId: string): Promise<boolean> {
  const images = await db.images.where('setId').equals(setId).toArray();
  if (images.length === 0) throw new Error(`No images found with setId ${setId}`);
  
  // 하나라도 isSaved=false면 전체 true로, 전부 true면 전체 false로
  const allSaved = images.every(img => img.isSaved === true);
  const newSavedState = !allSaved;
  
  await Promise.all(
    images.map(img => db.images.update(img.id, { isSaved: newSavedState }))
  );
  
  return newSavedState;
}

export async function getSavedImages(): Promise<StoredImage[]> {
  // Dexie는 boolean 인덱스를 1/0으로 처리하므로 filter 사용
  const all = await db.images.orderBy('createdAt').reverse().toArray();
  return all.filter((img) => img.isSaved === true);
}

export async function getSavedCount(): Promise<number> {
  const all = await db.images.toArray();
  return all.filter((img) => img.isSaved === true).length;
}

export { db };
