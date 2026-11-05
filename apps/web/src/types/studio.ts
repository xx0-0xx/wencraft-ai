export type MaterialId = 'zini' | 'zhuni' | 'duanni';
export type FontId = 'song' | 'kai' | 'hei';
export type TextDirection = 'horizontal' | 'vertical';
export type OrnamentStyle = 'painted' | 'carved';
export type PackagingId = 'paper' | 'gift' | 'pouch';

export type OrnamentId =
  | 'none'
  | 'bamboo'
  | 'plum'
  | 'orchid'
  | 'lotus'
  | 'pine'
  | 'mountain'
  | 'wave'
  | 'cloud'
  | 'koi'
  | 'crane';

export interface InscriptionConfig {
  enabled: boolean;
  text: string;
  fontId: FontId;
  color: string;
  size: number;
  direction: TextDirection;
}

export interface OrnamentConfig {
  id: OrnamentId;
  style: OrnamentStyle;
  size: number;
  x: number;
  y: number;
  rotation: number;
}

export interface StudioDesign {
  materialId: MaterialId;
  inscription: InscriptionConfig;
  ornament: OrnamentConfig;
  packagingId: PackagingId;
}

export interface SavedDesignSnapshot {
  version: 1;
  design: StudioDesign;
  savedAt: string;
}

export const DEFAULT_DESIGN: StudioDesign = {
  materialId: 'zini',
  inscription: {
    enabled: true,
    text: '清心雅韵',
    fontId: 'song',
    color: '#E8D4AC',
    size: 1,
    direction: 'horizontal',
  },
  ornament: {
    id: 'bamboo',
    style: 'painted',
    size: 19,
    x: 0,
    y: 0,
    rotation: 0,
  },
  packagingId: 'gift',
};
