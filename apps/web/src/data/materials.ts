import type { MaterialId } from '../types/studio';

export interface ClayMaterial {
  id: MaterialId;
  name: string;
  english: string;
  color: string;
  accent: string;
  description: string;
  roughness: number;
  sheen: number;
  swatch: string;
}

export const clayMaterials: ClayMaterial[] = [
  {
    id: 'zini',
    name: '紫泥',
    english: 'Purple clay',
    color: '#5a3f2e',
    accent: '#7b5842',
    description: '温润沉静，如老茶入盏',
    roughness: 0.66,
    sheen: 0.22,
    swatch: 'linear-gradient(145deg, #7a5741 0%, #4b3023 55%, #2d1b13 100%)',
  },
  {
    id: 'zhuni',
    name: '朱泥',
    english: 'Cinnabar clay',
    color: '#6f2f23',
    accent: '#9e4c37',
    description: '朱红含光，似炉火初燃',
    roughness: 0.57,
    sheen: 0.3,
    swatch: 'linear-gradient(145deg, #a04d36 0%, #6f2f23 52%, #3e1a13 100%)',
  },
  {
    id: 'duanni',
    name: '段泥',
    english: 'Duanni clay',
    color: '#a6875b',
    accent: '#c4a97a',
    description: '浅黄温雅，若月照素笺',
    roughness: 0.72,
    sheen: 0.16,
    swatch: 'linear-gradient(145deg, #cdb488 0%, #a6875b 55%, #7b6140 100%)',
  },
];

export function getClayMaterial(id: MaterialId): ClayMaterial {
  return clayMaterials.find((item) => item.id === id) ?? clayMaterials[0];
}
