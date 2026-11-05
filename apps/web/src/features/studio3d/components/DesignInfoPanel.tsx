import { ArrowRight, BookOpen, Save, ShieldCheck } from 'lucide-react';
import { getClayMaterial } from '../../../data/materials';
import { getOrnament } from '../../../data/ornaments';
import { getPackaging } from '../../../data/packaging';
import { useStudioStore } from '../../../store/studioStore';
import { formatTime } from '../../../lib/text';
import { Button } from '../../../components/ui/Button';
import { InfoRow } from './PanelParts';

interface DesignInfoPanelProps {
  onSave: () => void;
  onConfirm: () => void;
}

export function DesignInfoPanel({ onSave, onConfirm }: DesignInfoPanelProps) {
  const design = useStudioStore((state) => state.design);
  const lastSavedAt = useStudioStore((state) => state.lastSavedAt);
  const clay = getClayMaterial(design.materialId);
  const ornament = getOrnament(design.ornament.id);
  const packaging = getPackaging(design.packagingId);
  const displayName =
    design.inscription.enabled && design.inscription.text.trim()
      ? `「${design.inscription.text.trim()}」`
      : '素面紫砂壶';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.26em] text-secondary/80">
              Current work / 当前方案
            </p>
            <h2 className="mt-1 truncate font-serif text-[22px] leading-tight text-ink">
              {displayName}
            </h2>
          </div>
          <span className="mt-0.5 shrink-0 rounded-full border border-brand/20 bg-brand/[0.07] px-2 py-1 text-[9px] tracking-[0.08em] text-brand">
            概念演示
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-line/70 bg-surface/55 px-3.5">
          <InfoRow label="器物" value="经典紫砂壶" />
          <InfoRow label="泥色" value={`${clay.name} · ${clay.english}`} accent />
          <InfoRow
            label="铭文"
            value={
              design.inscription.enabled && design.inscription.text.trim()
                ? design.inscription.text
                : '不添加铭文'
            }
          />
          <InfoRow
            label="纹样"
            value={
              ornament
                ? `${ornament.name} · ${
                    design.ornament.style === 'painted' ? '彩绘' : '雕刻'
                  }`
                : '不添加纹样'
            }
          />
          <InfoRow label="包装" value={packaging.name} />
          <InfoRow label="演示起价" value="¥399 起" accent />
        </div>

        {ornament ? (
          <div className="mt-3 rounded-xl border border-brand/15 bg-brand/[0.045] p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand/15 bg-surface text-brand">
                <BookOpen className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-secondary/75">
                  Cultural note
                </p>
                <p className="font-serif text-[14px] text-ink">
                  {ornament.name} · 文化寓意
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-secondary">
              {ornament.meaning}。以上为演示创作参考，不作为特定历史出处或工艺承诺。
            </p>
          </div>
        ) : null}

        <div className="mt-3 space-y-2 rounded-xl border border-line/60 bg-muted/20 p-3.5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-secondary/75">
            Live craft notes
          </p>
          <p className="text-[11px] leading-relaxed text-secondary">
            铭文与纹样通过贴花投射贴合壶身曲面，随视角转动而自然变化；泥色采用实时 PBR
            材质。所有定制均为数字演示效果。
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[10px] text-secondary/80">
          <ShieldCheck className="h-3.5 w-3.5 text-success" />
          <span>仅保存在本机浏览器，不上传个人信息</span>
        </div>
        <p className="mt-1.5 text-[10px] text-secondary/60">
          最近保存 · {formatTime(lastSavedAt)}
        </p>
      </div>

      <div className="space-y-2 border-t border-line/70 bg-surface/75 p-3">
        <Button
          variant="primary"
          block
          leadingIcon={<ArrowRight className="h-4 w-4" />}
          onClick={onConfirm}
        >
          确认作品
        </Button>
        <Button
          variant="secondary"
          block
          leadingIcon={<Save className="h-4 w-4" />}
          onClick={onSave}
        >
          保存草稿
        </Button>
        <p className="text-center text-[9px] leading-relaxed text-secondary/65">
          概念演示 · 不接入真实支付与生产
        </p>
      </div>
    </div>
  );
}
