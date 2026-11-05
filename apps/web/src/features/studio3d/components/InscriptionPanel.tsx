import { PenLine, RotateCcw } from 'lucide-react';
import { inscriptionFonts } from '../../../data/fonts';
import { countChars, MAX_INSCRIPTION_CHARS } from '../../../lib/text';
import { useStudioStore } from '../../../store/studioStore';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { RangeField } from '../../../components/ui/RangeField';
import { Switch } from '../../../components/ui/Switch';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/cn';
import type { FontId, TextDirection } from '../../../types/studio';
import { PanelBlock, PanelHeading, SoftNote } from './PanelParts';

const presets = ['清心雅韵', '山水清音', '一盏知心', '岁岁安澜'];
const colors = ['#E8D4AC', '#F2E7D5', '#4B2F22', '#B6533C', '#2A2622'];

export function InscriptionPanel() {
  const inscription = useStudioStore((state) => state.design.inscription);
  const setInscription = useStudioStore((state) => state.setInscription);
  const setInscriptionText = useStudioStore((state) => state.setInscriptionText);
  const resetInscription = useStudioStore((state) => state.resetInscription);
  const count = countChars(inscription.text);

  return (
    <div className="space-y-5 p-4">
      <PanelHeading
        eyebrow="Inscription / 铭文"
        title="题一句心意"
        description="文字会投射并贴合壶身曲面，随视角一同转动。"
        aside={
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-brand/15 bg-brand/5 text-brand">
            <PenLine className="h-3.5 w-3.5" />
          </span>
        }
      />

      <Switch
        checked={inscription.enabled}
        onChange={(enabled) => setInscription({ enabled })}
        label="添加铭文"
        description="关闭后，壶身保持素面。"
      />

      <div
        className={cn(
          'space-y-5 transition-opacity duration-300',
          !inscription.enabled && 'pointer-events-none select-none opacity-40',
        )}
      >
        <PanelBlock title="铭文内容" hint={`${count} / ${MAX_INSCRIPTION_CHARS} 字`}>
          <div className="relative">
            <input
              value={inscription.text}
              onChange={(event) => setInscriptionText(event.target.value)}
              placeholder="清心雅韵"
              aria-label="铭文内容"
              className="h-12 w-full rounded-xl border border-line bg-surface px-4 pr-16 font-serif text-[18px] tracking-[0.18em] text-ink outline-none transition-colors placeholder:text-secondary/35 focus:border-brand/55"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] tabular-nums text-secondary/70">
              {count}/{MAX_INSCRIPTION_CHARS}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInscriptionText(preset)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10.5px] transition-colors',
                  inscription.text === preset
                    ? 'border-brand/35 bg-brand/10 text-brand'
                    : 'border-line/80 bg-surface/60 text-secondary hover:border-brand/25 hover:text-ink',
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </PanelBlock>

        <PanelBlock title="字体" hint="浏览器可用中文字形">
          <SegmentedControl<FontId>
            value={inscription.fontId}
            onChange={(fontId) => setInscription({ fontId })}
            options={inscriptionFonts.map((font) => ({
              value: font.id,
              label: (
                <span className="inline-flex items-baseline gap-1.5">
                  <span
                    className="text-[16px] leading-none"
                    style={{ fontFamily: font.cssFamily }}
                  >
                    永
                  </span>
                  <span>{font.name}</span>
                </span>
              ),
              hint: font.note,
            }))}
            ariaLabel="铭文字体"
          />
        </PanelBlock>

        <PanelBlock title="排布方向">
          <SegmentedControl<TextDirection>
            value={inscription.direction}
            onChange={(direction) => setInscription({ direction })}
            options={[
              { value: 'horizontal', label: '横排', hint: '自左向右' },
              { value: 'vertical', label: '竖排', hint: '自上而下' },
            ]}
            ariaLabel="铭文排布方向"
          />
        </PanelBlock>

        <PanelBlock>
          <RangeField
            label="文字大小"
            value={inscription.size}
            min={0.8}
            max={1.3}
            step={0.05}
            onChange={(size) => setInscription({ size })}
            format={(value) => `${Math.round(value * 100)}%`}
          />
        </PanelBlock>

        <PanelBlock title="文字颜色">
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((color) => {
              const active = inscription.color.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setInscription({ color })}
                  aria-label={`选择颜色 ${color}`}
                  aria-pressed={active}
                  className={cn(
                    'relative h-8 w-8 rounded-full border transition-all duration-200',
                    active
                      ? 'scale-110 border-brand ring-2 ring-brand/25 ring-offset-2 ring-offset-surface'
                      : 'border-white/55 hover:scale-105',
                  )}
                  style={{
                    background: color,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.35)',
                  }}
                />
              );
            })}
            <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-line bg-surface text-[10px] text-secondary transition-colors hover:border-brand/40 hover:text-brand">
              <span
                className="pointer-events-none h-4 w-4 rounded-full"
                style={{
                  background:
                    'conic-gradient(#E8D4AC, #B6533C, #4B2F22, #F2E7D5, #E8D4AC)',
                }}
              />
              <input
                type="color"
                value={inscription.color}
                onChange={(event) => setInscription({ color: event.target.value })}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="自定义铭文颜色"
              />
            </label>
          </div>
        </PanelBlock>

        <div className="flex items-center justify-between gap-3 border-t border-line/60 pt-3">
          <SoftNote>
            贴花投射，非屏幕悬浮文字；复杂曲面边缘会自然贴合。
          </SoftNote>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 px-2"
            leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={resetInscription}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
