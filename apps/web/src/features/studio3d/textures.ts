import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { getFont } from '../../data/fonts';
import type { InscriptionConfig, OrnamentStyle } from '../../types/studio';

const imageCache = new Map<string, Promise<HTMLImageElement>>();
const textureCache = new Map<string, THREE.Texture>();

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`无法加载纹样：${src}`));
    image.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

export interface OrnamentTextureState {
  texture: THREE.Texture | null;
  loading: boolean;
}

export function useOrnamentTexture(
  src: string,
  style: OrnamentStyle,
  tint: string,
): OrnamentTextureState {
  const key = `${src}|${style}|${style === 'carved' ? tint : 'painted'}`;
  const [state, setState] = useState<OrnamentTextureState>(() => {
    const cached = textureCache.get(key);
    return { texture: cached ?? null, loading: !cached };
  });

  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setState({ texture: null, loading: false });
      return;
    }
    const cached = textureCache.get(key);
    if (cached) {
      setState({ texture: cached, loading: false });
      return;
    }

    setState((previous) => ({ ...previous, loading: true }));

    loadImage(src)
      .then((image) => {
        if (cancelled) return;
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('无法创建纹样画布');
        context.drawImage(image, 0, 0);

        if (style === 'carved') {
          context.globalCompositeOperation = 'source-in';
          context.fillStyle = tint;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.globalCompositeOperation = 'source-over';
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        texture.needsUpdate = true;
        textureCache.set(key, texture);
        setState({ texture, loading: false });
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setState({ texture: null, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [key, src, style, tint]);

  return state;
}

function isLightColor(hex: string): boolean {
  const value = hex.replace('#', '');
  if (value.length !== 6) return true;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55;
}

export function createInscriptionTexture(
  config: InscriptionConfig,
): THREE.CanvasTexture | null {
  const text = config.text.trim();
  if (!text) return null;

  const horizontal = config.direction === 'horizontal';
  const width = horizontal ? 1024 : 448;
  const height = horizontal ? 384 : 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const chars = Array.from(text);
  const font = getFont(config.fontId);
  const padding = 48;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  let fontSize: number;
  let step: number;

  if (horizontal) {
    fontSize = Math.min(availableHeight * 0.66, (availableWidth / Math.max(chars.length, 1)) / 1.12);
    step = fontSize * 1.12;
  } else {
    fontSize = Math.min(availableWidth * 0.68, availableHeight / Math.max(chars.length, 1) / 1.1);
    step = fontSize * 1.1;
  }

  context.clearRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = `500 ${fontSize}px ${font.canvasFamily}`;
  context.lineJoin = 'round';

  const light = isLightColor(config.color);
  context.shadowColor = light ? 'rgba(28, 18, 12, 0.42)' : 'rgba(58, 40, 28, 0.2)';
  context.shadowBlur = light ? Math.max(2, fontSize * 0.045) : Math.max(1, fontSize * 0.014);
  context.shadowOffsetY = light ? Math.max(1, fontSize * 0.018) : 1;
  if (light) {
    context.lineWidth = Math.max(1, fontSize * 0.014);
    context.strokeStyle = 'rgba(36, 23, 16, 0.32)';
  }

  chars.forEach((char, index) => {
    const offset = (index - (chars.length - 1) / 2) * step;
    const x = horizontal ? width / 2 + offset : width / 2;
    const y = horizontal ? height / 2 + fontSize * 0.02 : height / 2 + offset + fontSize * 0.02;
    if (light) context.strokeText(char, x, y);
    context.fillStyle = config.color;
    context.fillText(char, x, y);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
