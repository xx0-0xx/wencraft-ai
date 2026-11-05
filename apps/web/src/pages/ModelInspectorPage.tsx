import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ArrowLeft, Box, CheckCircle2, Info, Layers3 } from 'lucide-react';
import { BrandMark } from '../components/BrandMark';
import { Button } from '../components/ui/Button';
import { assetUrl } from '../lib/assetUrl';

interface TeapotMeta {
  name: string;
  source: string;
  vertices: number;
  faces: number;
  bounds: number[][];
  extents: number[];
  up_axis: string;
  base_y: number;
  uv: string;
  normals: string;
  orientation: string;
  lid_fix: {
    radial_scale: number;
    vertical_shift: number;
    seated_overlap: number;
  };
}

interface MeshInfo {
  name: string;
  type: string;
  vertices: number;
  triangles: number;
  hasUV: boolean;
  hasNormal: boolean;
  materialType: string;
}

function DataCard({
  label,
  value,
  hint,
  ok,
}: {
  label: string;
  value: string;
  hint?: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line/70 bg-surface/60 p-3.5">
      <p className="text-[9px] uppercase tracking-[0.18em] text-secondary/75">
        {label}
      </p>
      <p className="mt-1.5 flex items-center gap-1.5 font-serif text-[16px] text-ink">
        {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : null}
        {value}
      </p>
      {hint ? <p className="mt-1 text-[10px] text-secondary/75">{hint}</p> : null}
    </div>
  );
}

export default function ModelInspectorPage() {
  const [meta, setMeta] = useState<TeapotMeta | null>(null);
  const [meshes, setMeshes] = useState<MeshInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(assetUrl('/assets/models/teapot-meta.json'))
      .then((response) => {
        if (!response.ok) throw new Error(`meta ${response.status}`);
        return response.json() as Promise<TeapotMeta>;
      })
      .then((data) => {
        if (!cancelled) setMeta(data);
      })
      .catch((reason) => {
        if (!cancelled) setError(String(reason));
      });

    const loader = new GLTFLoader();
    loader.load(
      assetUrl('/assets/models/teapot.glb'),
      (gltf) => {
        if (cancelled) return;
        const found: MeshInfo[] = [];
        gltf.scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const geometry = mesh.geometry;
          const indexCount = geometry.index?.count;
          const vertexCount = geometry.attributes.position?.count ?? 0;
          found.push({
            name: object.name || '未命名网格',
            type: object.type,
            vertices: vertexCount,
            triangles: Math.round((indexCount ?? vertexCount) / 3),
            hasUV: Boolean(geometry.attributes.uv),
            hasNormal: Boolean(geometry.attributes.normal),
            materialType: Array.isArray(mesh.material)
              ? `Array(${mesh.material.length})`
              : mesh.material?.type ?? 'none',
          });
        });
        setMeshes(found);
      },
      undefined,
      (reason) => {
        if (!cancelled) setError(String(reason));
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <BrandMark />
          <Link
            to="/studio"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] text-secondary transition-colors hover:bg-muted/70 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回工作台
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-secondary/75">
              Development / Asset check
            </p>
            <h1 className="mt-2 font-serif text-[clamp(28px,4vw,40px)] tracking-[0.05em] text-ink">
              紫砂壶模型检查
            </h1>
            <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-secondary">
              这是开发阶段的临时检查页。用于确认真实 GLB 的网格、包围盒、法线与 UV
              状态，并记录壶盖合拢处理。
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 text-[10px] text-brand">
            <Info className="h-3.5 w-3.5" />
            teapot.glb · 已合拢壶盖
          </span>
        </div>

        {error ? (
          <div className="mt-8 rounded-xl border border-accent/25 bg-accent/[0.06] p-4 text-[12px] text-accent">
            模型读取失败：{error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DataCard
            label="模型文件"
            value={meta?.name ?? '加载中…'}
            hint={meta ? `原始文件：${meta.source}` : undefined}
            ok={Boolean(meta)}
          />
          <DataCard
            label="网格 / 面数"
            value={meta ? `${meshes.length} / ${meta.faces.toLocaleString()}` : '加载中…'}
            hint={meta ? `${meta.vertices.toLocaleString()} 个顶点` : undefined}
          />
          <DataCard
            label="UV 属性"
            value={meshes.some((mesh) => mesh.hasUV) ? '存在' : '不存在'}
            hint="不含 UV，铭文与纹样改用 DecalGeometry 投射。"
          />
          <DataCard
            label="法线"
            value={meshes.some((mesh) => mesh.hasNormal) ? '已生成 · 朝外' : '缺失'}
            hint="导出 GLB 时重新计算，保证陶土受光正确。"
            ok={meshes.some((mesh) => mesh.hasNormal)}
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-line/70 bg-surface/60">
            <div className="flex items-center gap-2 border-b border-line/60 px-4 py-3">
              <Layers3 className="h-4 w-4 text-brand" />
              <h2 className="font-serif text-[16px] text-ink">网格结构</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-line/50 text-[9px] uppercase tracking-[0.14em] text-secondary/70">
                    <th className="px-4 py-2.5 font-medium">名称</th>
                    <th className="px-3 py-2.5 font-medium">顶点</th>
                    <th className="px-3 py-2.5 font-medium">三角面</th>
                    <th className="px-3 py-2.5 font-medium">UV</th>
                    <th className="px-3 py-2.5 font-medium">法线</th>
                    <th className="px-4 py-2.5 font-medium">材质</th>
                  </tr>
                </thead>
                <tbody>
                  {meshes.map((mesh) => (
                    <tr key={mesh.name} className="border-b border-line/40 last:border-0">
                      <td className="px-4 py-3 font-mono text-[10.5px] text-ink">
                        {mesh.name}
                      </td>
                      <td className="px-3 py-3 text-[11px] tabular-nums text-secondary">
                        {mesh.vertices.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-[11px] tabular-nums text-secondary">
                        {mesh.triangles.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-secondary">
                        {mesh.hasUV ? '有' : '无'}
                      </td>
                      <td className="px-3 py-3 text-[11px] text-secondary">
                        {mesh.hasNormal ? '有' : '无'}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10.5px] text-secondary">
                        {mesh.materialType}
                      </td>
                    </tr>
                  ))}
                  {!meshes.length && !error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-[11px] text-secondary"
                      >
                        正在解析 GLB…
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-line/70 bg-surface/60 p-4">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-brand" />
                <h2 className="font-serif text-[16px] text-ink">坐标与尺寸</h2>
              </div>
              <dl className="mt-3 space-y-2.5 text-[11px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">坐标轴</dt>
                  <dd className="text-ink">{meta?.up_axis ?? 'Y'} up</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">底面高度</dt>
                  <dd className="tabular-nums text-ink">{meta?.base_y ?? 0}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">包围盒</dt>
                  <dd className="text-right font-mono text-[10px] leading-relaxed text-ink">
                    {meta
                      ? meta.bounds
                          .map((row) => `[${row.map((n) => n.toFixed(1)).join(', ')}]`)
                          .join(' → ')
                      : '加载中…'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-secondary">朝向</dt>
                  <dd className="text-right text-ink">
                    {meta?.orientation ?? '加载中…'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-brand/15 bg-brand/[0.045] p-4">
              <h2 className="font-serif text-[16px] text-ink">壶盖合拢记录</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-secondary">
                原始模型壶盖与壶身分离。处理时按壶口圆环匹配半径，将壶盖沿垂直轴下移并做
                约 1.5% 径向缩放，使其落到壶口内沿。
              </p>
              {meta ? (
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-line/60 bg-surface/60 px-2 py-2">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-secondary/70">
                      Scale
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-ink">
                      ×{meta.lid_fix.radial_scale.toFixed(4)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-line/60 bg-surface/60 px-2 py-2">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-secondary/70">
                      Shift
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-ink">
                      -{meta.lid_fix.vertical_shift.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-line/60 bg-surface/60 px-2 py-2">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-secondary/70">
                      Overlap
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-ink">
                      {meta.lid_fix.seated_overlap}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-line/70 bg-surface/60 p-4">
              <h2 className="font-serif text-[16px] text-ink">贴花实现策略</h2>
              <ol className="mt-2 space-y-2 text-[11px] leading-relaxed text-secondary">
                <li>1. 原始 GLB 不含 UV，不使用 UV 贴图方案。</li>
                <li>2. 使用 DecalGeometry 从壶身正面投射铭文与纹样。</li>
                <li>3. 投射深度限制在壶身外壁，铭文随器物旋转保持贴合。</li>
                <li>4. 纹样位置限制在壶身正面，避开壶嘴、壶把与壶盖。</li>
              </ol>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/70 bg-surface/60 px-4 py-3.5">
          <p className="text-[10px] leading-relaxed text-secondary/80">
            此页面为开发检查用途，生产环境可通过路由开关关闭。
          </p>
          <Link to="/studio">
            <Button variant="secondary" size="sm">
              打开 3D 工作台
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
