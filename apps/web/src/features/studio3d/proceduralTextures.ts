import * as THREE from 'three';

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function periodicValueNoise(
  size: number,
  period: number,
  random: () => number,
): (x: number, y: number) => number {
  const lattice = new Float32Array(period * period);
  for (let i = 0; i < lattice.length; i += 1) {
    lattice[i] = random();
  }

  return (x: number, y: number) => {
    const px = (x / size) * period;
    const py = (y / size) * period;
    const x0 = Math.floor(px);
    const y0 = Math.floor(py);
    const fx = px - x0;
    const fy = py - y0;
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);
    const ix0 = ((x0 % period) + period) % period;
    const iy0 = ((y0 % period) + period) % period;
    const ix1 = (ix0 + 1) % period;
    const iy1 = (iy0 + 1) % period;

    const v00 = lattice[iy0 * period + ix0];
    const v10 = lattice[iy0 * period + ix1];
    const v01 = lattice[iy1 * period + ix0];
    const v11 = lattice[iy1 * period + ix1];
    const top = v00 + (v10 - v00) * sx;
    const bottom = v01 + (v11 - v01) * sx;
    return top + (bottom - top) * sy;
  };
}

function fractalNoise(
  size: number,
  periods: number[],
  random: () => number,
): (x: number, y: number) => number {
  const layers = periods.map((period, index) => ({
    sample: periodicValueNoise(size, period, random),
    weight: 1 / Math.pow(2, index),
  }));
  const total = layers.reduce((sum, layer) => sum + layer.weight, 0);

  return (x: number, y: number) => {
    let value = 0;
    for (const layer of layers) {
      value += layer.sample(x, y) * layer.weight;
    }
    return value / total;
  };
}

let cachedTexture: THREE.DataTexture | null = null;

export function getClayGrainTexture(): THREE.DataTexture {
  if (cachedTexture) return cachedTexture;

  const size = 256;
  const random = mulberry32(0x6c6179);
  const fine = fractalNoise(size, [32, 64, 128], random);
  const meso = fractalNoise(size, [12, 24, 48, 96], random);
  const macro = fractalNoise(size, [4, 8, 16], random);
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      data[index] = Math.round(fine(x, y) * 255);
      data[index + 1] = Math.round(meso(x, y) * 255);
      data[index + 2] = Math.round(macro(x, y) * 255);
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  cachedTexture = texture;
  return texture;
}
