import type { OrnamentId } from '../types/studio';
import { assetUrl } from '../lib/assetUrl';

export interface Ornament {
  id: Exclude<OrnamentId, 'none'>;
  name: string;
  image: string;
  thumb: string;
  texture: string;
  meaning: string;
  categories: Array<'teapot' | 'postcard'>;
}

export const ornaments: Ornament[] = [
  {
    id: 'bamboo',
    name: '竹',
    image: assetUrl('/assets/ornaments/bamboo.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/bamboo.webp'),
    texture: assetUrl('/assets/ornaments/textures/bamboo.webp'),
    meaning: '坚韧、清雅、君子之风',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'plum',
    name: '梅',
    image: assetUrl('/assets/ornaments/plum.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/plum.webp'),
    texture: assetUrl('/assets/ornaments/textures/plum.webp'),
    meaning: '坚毅、希望、高洁',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'orchid',
    name: '兰',
    image: assetUrl('/assets/ornaments/orchid.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/orchid.webp'),
    texture: assetUrl('/assets/ornaments/textures/orchid.webp'),
    meaning: '幽雅、淡泊、君子之交',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'lotus',
    name: '荷',
    image: assetUrl('/assets/ornaments/lotus.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/lotus.webp'),
    texture: assetUrl('/assets/ornaments/textures/lotus.webp'),
    meaning: '清净、雅致、和合',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'pine',
    name: '松',
    image: assetUrl('/assets/ornaments/pine.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/pine.webp'),
    texture: assetUrl('/assets/ornaments/textures/pine.webp'),
    meaning: '常青、坚韧、长寿',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'mountain',
    name: '山水',
    image: assetUrl('/assets/ornaments/mountain.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/mountain.webp'),
    texture: assetUrl('/assets/ornaments/textures/mountain.webp'),
    meaning: '稳重、旷达、寄情山水',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'wave',
    name: '海浪',
    image: assetUrl('/assets/ornaments/wave.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/wave.webp'),
    texture: assetUrl('/assets/ornaments/textures/wave.webp'),
    meaning: '通达、从容、生生不息',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'cloud',
    name: '云纹',
    image: assetUrl('/assets/ornaments/cloud.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/cloud.webp'),
    texture: assetUrl('/assets/ornaments/textures/cloud.webp'),
    meaning: '祥瑞、自在、如意',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'koi',
    name: '锦鲤',
    image: assetUrl('/assets/ornaments/koi.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/koi.webp'),
    texture: assetUrl('/assets/ornaments/textures/koi.webp'),
    meaning: '富足、顺遂、年年有余',
    categories: ['teapot', 'postcard'],
  },
  {
    id: 'crane',
    name: '仙鹤',
    image: assetUrl('/assets/ornaments/crane.png'),
    thumb: assetUrl('/assets/ornaments/thumbs/crane.webp'),
    texture: assetUrl('/assets/ornaments/textures/crane.webp'),
    meaning: '高洁、长寿、志远',
    categories: ['teapot', 'postcard'],
  },
];

export function getOrnament(id: OrnamentId): Ornament | null {
  if (id === 'none') return null;
  return ornaments.find((item) => item.id === id) ?? null;
}
