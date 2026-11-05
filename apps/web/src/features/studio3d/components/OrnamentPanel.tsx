import { Ban, Flower2, RotateCcw } from 'lucide-react';
import { getOrnament, ornaments } from '../../../data/ornaments';
import { useStudioStore } from '../../../store/studioStore';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { RangeField } from '../../../components/ui/RangeField';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/cn';
import type { OrnamentId, OrnamentStyle } from '../../../types/studio';
import { PanelBlock, PanelHeading, SoftNote } from './PanelParts';

export function OrnamentPanel() {
  const ornament = useStudioStore((state) => state.design.ornament);
  const setOrnament = useStudioStore((state) => state.setOrnament);
  const setOrnamentId = useStudioStore((state) => state.setOrnamentId);
  const resetOrnament = useStudioStore((state) => state.resetOrnament);
  const selected = getOrnament(ornament.id);
  const enabled = ornament.id !== 'none';

  return (
    <div className="space-y-5 p-4">
      <PanelHeading
        eyebrow="Ornament / 纹样"
        title="择一纹样"
        description="选用已有东方纹样素材，以贴花方式落在壶身正面。"
        aside={
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 bg-brand/5 text-brand">
            <Flower2 className="h-3.5 w-3.5" />
          </span>
        }
      />

      <PanelBlock title="呈现方式" hint="只改变视觉，不生成真实雕刻">
        <SegmentedControl<OrnamentStyle>
          value={ornament.style}
          onChange={(style) => setOrnament({ style })}
          options={[
            { value: 'painted', label: '彩绘', hint: '保留原色' },
            { value: 'carved', label: '雕刻', hint: '单色纹样' },
          ]}
          ariaLabel="纹样呈现方式"
        />
      </PanelBlock>

      <PanelBlock title="选择纹样" hint={`${ornaments.length} 种素材`}>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => setOrnamentId('none')}
            aria-pressed={!enabled}
            title="不添加纹样"
            className={cn(
              'group flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-lg border p-1.5 transition-all duration-200',
              !enabled
                ? 'border-brand/50 bg-brand/[0.06] ring-1 ring-brand/20'
                : 'border-line/70 bg-surface/55 hover:border-brand/25 hover:bg-surface',
            )}
          >
            <Ban className="h-4 w-4 text-secondary/65" />
            <span className="text-[9px] text-secondary">无</span>
          </button>
          {ornaments.map((item) => {
            const active = ornament.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOrnamentId(item.id as OrnamentId)}
                aria-pressed={active}
                title={`${item.name} · ${item.meaning}`}
                className={cn(
                  'group flex aspect-[4/5] flex-col items-center gap-1 rounded-lg border p-1.5 transition-all duration-200',
                  active
                    ? 'border-brand/50 bg-brand/[0.06] ring-1 ring-brand/20'
                    : 'border-line/70 bg-surface/55 hover:border-brand/25 hover:bg-surface',
                )}
              >
                <span className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[5px] bg-[radial-gradient(circle_at_50%_45%,#fffdf8,#f2eadd)]">
                  <img
                    src={item.thumb}
                    alt={item.name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </span>
                <span
                  className={cn(
                    'shrink-0 text-[9.5px] leading-none',
                    active ? 'font-medium text-brand' : 'text-secondary',
                  )}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </PanelBlock>

      {selected ? (
        <div className="rounded-xl border border-brand/15 bg-brand/[0.045] px-3 py-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-serif text-[15px] text-brand">
              {selected.name}
            </span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-secondary/75">
              {ornament.style === 'painted' ? 'Painted' : 'Carved'}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-secondary">
            寓意 · {selected.meaning}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          'space-y-4 transition-opacity duration-300',
          !enabled && 'pointer-events-none select-none opacity-40',
        )}
      >
        <PanelBlock title="纹样调整">
          <div className="space-y-3.5">
            <RangeField
              label="大小"
              value={ornament.size}
              min={12}
              max={20}
              step={0.5}
              onChange={(size) => setOrnament({ size })}
              format={(value) => value.toFixed(1)}
            />
            <RangeField
              label="左右位置"
              value={ornament.x}
              min={-5}
              max={5}
              step={0.5}
              onChange={(x) => setOrnament({ x })}
              format={(value) =>
                Math.abs(value) < 0.1
                  ? '居中'
                  : `${value > 0 ? '右' : '左'} ${Math.abs(value).toFixed(1)}`
              }
            />
            <RangeField
              label="上下位置"
              value={ornament.y}
              min={-4}
              max={2}
              step={0.5}
              onChange={(y) => setOrnament({ y })}
              format={(value) =>
                Math.abs(value) < 0.1
                  ? '居中'
                  : `${value > 0 ? '上' : '下'} ${Math.abs(value).toFixed(1)}`
              }
            />
            <RangeField
              label="旋转"
              value={ornament.rotation}
              min={-20}
              max={20}
              step={1}
              onChange={(rotation) => setOrnament({ rotation })}
              format={(value) => `${value}°`}
            />
          </div>
        </PanelBlock>

        <div className="flex items-center justify-between gap-3 border-t border-line/60 pt-3">
          <SoftNote>位置范围已限制，避免覆盖壶嘴、壶把与壶盖。</SoftNote>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 px-2"
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={resetOrnament}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
