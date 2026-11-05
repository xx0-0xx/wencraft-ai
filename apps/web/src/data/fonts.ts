import type { FontId } from '../types/studio';

export interface InscriptionFont {
  id: FontId;
  name: string;
  note: string;
  cssFamily: string;
  canvasFamily: string;
}

export const inscriptionFonts: InscriptionFont[] = [
  {
    id: 'song',
    name: '宋体',
    note: '清雅端正',
    cssFamily:
      '"Noto Serif SC", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif',
    canvasFamily:
      '"Noto Serif SC", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif',
  },
  {
    id: 'kai',
    name: '楷体',
    note: '温润舒展',
    cssFamily: 'KaiTi, STKaiti, "Kaiti SC", "Noto Serif SC", SimSun, serif',
    canvasFamily: 'KaiTi, STKaiti, "Kaiti SC", "Noto Serif SC", SimSun, serif',
  },
  {
    id: 'hei',
    name: '黑体',
    note: '简洁当代',
    cssFamily:
      '"Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", SimHei, sans-serif',
    canvasFamily:
      '"Noto Sans SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", SimHei, sans-serif',
  },
];

export function getFont(id: FontId): InscriptionFont {
  return inscriptionFonts.find((font) => font.id === id) ?? inscriptionFonts[0];
}
