import type { PackagingId } from '../types/studio';

export interface PackagingOption {
  id: PackagingId;
  name: string;
  english: string;
  description: string;
  tone: string;
  accent: string;
}

export const packagingOptions: PackagingOption[] = [
  {
    id: 'paper',
    name: '经典纸盒',
    english: 'Classic paper box',
    description: '素净纸盒，轻巧日常',
    tone: '#d9cdbb',
    accent: '#8f7b65',
  },
  {
    id: 'gift',
    name: '新中式礼盒',
    english: 'New oriental gift box',
    description: '深棕礼盒，适合郑重相赠',
    tone: '#5b3d2c',
    accent: '#c6a26b',
  },
  {
    id: 'pouch',
    name: '布袋包装',
    english: 'Linen pouch',
    description: '棉麻布袋，温润从容',
    tone: '#b8a78e',
    accent: '#6e5a45',
  },
];

export function getPackaging(id: PackagingId): PackagingOption {
  return packagingOptions.find((item) => item.id === id) ?? packagingOptions[0];
}
