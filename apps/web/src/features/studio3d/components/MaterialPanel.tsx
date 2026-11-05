import { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { clayMaterials } from '../../../data/materials';
import { useStudioStore } from '../../../store/studioStore';
import { cn } from '../../../lib/cn';
import type { MaterialId } from '../../../types/studio';
import { PanelHeading, SoftNote } from './PanelParts';

export function MaterialPanel() {
  const materialId = useStudioStore((state) => state.design.materialId);
  const setMaterial = useStudioStore((state) => state.setMaterial);
  const [selectedId, setSelectedId] = useState<MaterialId>(materialId);

  useEffect(() => {
    setSelectedId(materialId);
  }, [materialId]);

  return (
    <div className="space-y-5 p-4">
      <PanelHeading
        eyebrow="Clay / 泥色"
        title="选择泥色"
        description="三种经典紫砂泥色，实时映射到壶体 PBR 材质。"
        aside={
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 bg-brand/5 text-brand">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
        }
      />

      <div className="space-y-2.5">
        {clayMaterials.map((material) => {
          const active = material.id === selectedId;
          return (
            <button
              key={material.id}
              type="button"
              onClick={() => {
                setSelectedId(material.id);
                setMaterial(material.id);
              }}
              aria-pressed={active}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-xl border py-3 pl-3 pr-9 text-left transition-all duration-200 ease-silk',
                active
                  ? 'border-brand/40 bg-surface shadow-[0_12px_34px_-28px_rgba(62,43,31,0.9)]'
                  : 'border-line/70 bg-surface/45 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-surface/90',
              )}
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 shadow-inner">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: material.swatch }}
                />
                <span className="absolute inset-[5px] rounded-full border border-white/20" />
                <span className="absolute left-[12px] top-[9px] h-2 w-3.5 -rotate-[28deg] rounded-full bg-white/20 blur-[1px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block whitespace-nowrap font-serif text-[17px] leading-tight text-ink">
                  {material.name}
                </span>
                <span className="mt-0.5 block text-[8px] uppercase tracking-[0.18em] text-secondary/75">
                  {material.english}
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-secondary">
                  {material.description}
                </span>
              </span>
              <span
                className={cn(
                  'absolute right-3 top-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-surface text-transparent group-hover:border-brand/35',
                )}
              >
                <Check className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      <SoftNote icon={<Sparkles className="h-3.5 w-3.5" />}>
        泥色变化为数字演示效果，光泽与颗粒感来自实时材质计算，不作为真实泥料与工艺承诺。
      </SoftNote>
    </div>
  );
}
