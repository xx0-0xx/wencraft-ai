import { Check, Package, Sparkles } from 'lucide-react';
import { packagingOptions } from '../../../data/packaging';
import { useStudioStore } from '../../../store/studioStore';
import { cn } from '../../../lib/cn';
import { PanelHeading, SoftNote } from './PanelParts';
import type { PackagingId } from '../../../types/studio';

function PackagingIllustration({ id }: { id: PackagingId }) {
  if (id === 'paper') {
    return (
      <div className="absolute bottom-3 left-1/2 h-12 w-[68px] -translate-x-1/2 rounded-[3px] bg-[#d9cdbb] shadow-[0_8px_18px_-8px_rgba(62,43,31,0.55)]">
        <div className="absolute inset-x-0 top-0 h-3 border-b border-[#a08d75]/30 bg-[#e4d9c8]" />
        <div className="absolute left-1/2 top-4 h-6 w-9 -translate-x-1/2 rounded-[2px] border border-[#8f7b65]/35 bg-[#f7f3ec]" />
        <div className="absolute left-1/2 top-6 h-px w-5 -translate-x-1/2 bg-[#8f7b65]/35" />
        <div className="absolute left-1/2 top-[30px] h-px w-4 -translate-x-1/2 bg-[#8f7b65]/25" />
      </div>
    );
  }

  if (id === 'gift') {
    return (
      <div className="absolute bottom-3 left-1/2 h-12 w-[70px] -translate-x-1/2 rounded-[3px] bg-[#5b3d2c] shadow-[0_10px_20px_-8px_rgba(62,43,31,0.65)]">
        <div className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#c6a26b]/85" />
        <div className="absolute inset-x-0 top-4 h-2 bg-[#c6a26b]/85" />
        <div className="absolute left-1/2 top-4 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-[#c6a26b]/80 bg-[#4b3023]">
          <span className="font-serif text-[8px] text-[#e3c48d]">言</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-2 left-1/2 h-[54px] w-[52px] -translate-x-1/2 rounded-b-xl rounded-t-[45%] bg-[#b8a78e] shadow-[0_8px_18px_-8px_rgba(62,43,31,0.55)]">
      <div className="absolute inset-x-[6px] top-2 h-px bg-[#76634f]/55" />
      <div className="absolute left-1/2 top-0 h-4 w-10 -translate-x-1/2 rounded-full border border-[#76634f]/45" />
      <div className="absolute left-1/2 top-1 h-3 w-px -translate-x-1/2 bg-[#76634f]/55" />
      <div className="absolute left-1/2 top-1 h-3 w-4 -translate-x-1/2 rounded-b-full border-b border-[#76634f]/55" />
      <div className="absolute bottom-2 left-1/2 h-4 w-5 -translate-x-1/2 rounded-[2px] border border-[#76634f]/30 bg-[#f7f3ec]/40" />
    </div>
  );
}

export function PackagingPanel() {
  const packagingId = useStudioStore((state) => state.design.packagingId);
  const setPackaging = useStudioStore((state) => state.setPackaging);

  return (
    <div className="space-y-5 p-4">
      <PanelHeading
        eyebrow="Package / 包装"
        title="选择包装"
        description="为作品选择一份相称的呈现方式。"
        aside={
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 bg-brand/5 text-brand">
            <Package className="h-3.5 w-3.5" />
          </span>
        }
      />

      <div className="space-y-2.5">
        {packagingOptions.map((option) => {
          const active = option.id === packagingId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPackaging(option.id)}
              aria-pressed={active}
              className={cn(
                'group flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200',
                active
                  ? 'border-brand/40 bg-surface shadow-[0_12px_34px_-28px_rgba(62,43,31,0.9)]'
                  : 'border-line/70 bg-surface/45 hover:border-brand/25 hover:bg-surface/90',
              )}
            >
              <span className="relative h-20 w-[88px] shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_120%,#e4d8c6,#f7f1e7)]">
                <PackagingIllustration id={option.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-[16px] text-ink">
                    {option.name}
                  </span>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
                      active
                        ? 'border-brand bg-brand text-white'
                        : 'border-line bg-surface text-transparent group-hover:border-brand/35',
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-secondary/70">
                  {option.english}
                </span>
                <span className="mt-1 block text-[11px] text-secondary">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <SoftNote icon={<Sparkles className="h-3.5 w-3.5" />}>
        包装为概念演示选项，使用 CSS 几何示意，不冒用真实产品照片，也不接入真实生产与物流。
      </SoftNote>
    </div>
  );
}
