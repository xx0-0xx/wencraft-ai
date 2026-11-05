import { CheckCircle2, Circle, Clock3, ShieldCheck } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { getClayMaterial } from '../../../data/materials';
import { getOrnament } from '../../../data/ornaments';
import { getPackaging } from '../../../data/packaging';
import { formatTime } from '../../../lib/text';
import { useStudioStore } from '../../../store/studioStore';
import { InfoRow } from './PanelParts';

export interface ConfirmationSnapshot {
  orderNo: string;
  at: string;
}

interface ConfirmDialogProps {
  open: boolean;
  confirmation: ConfirmationSnapshot | null;
  onClose: () => void;
  onConfirm: () => void;
}

const steps = ['已确认', '待制作', '制作中', '质检完成', '已发货'];

export function ConfirmDialog({
  open,
  confirmation,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const design = useStudioStore((state) => state.design);
  const clay = getClayMaterial(design.materialId);
  const ornament = getOrnament(design.ornament.id);
  const packaging = getPackaging(design.packagingId);
  const name =
    design.inscription.enabled && design.inscription.text.trim()
      ? `「${design.inscription.text.trim()}」`
      : '素面紫砂壶';

  if (confirmation) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        eyebrow="Demo confirmation"
        title="作品已确认"
        maxWidth="max-w-md"
        footer={
          <Button variant="primary" block onClick={onClose}>
            继续编辑
          </Button>
        }
      >
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-success/25 bg-success/10 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="mt-4 font-serif text-lg text-ink">
            {name} · 演示确认单
          </p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-secondary">
            {confirmation.orderNo}
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-line/70 bg-surface/60 px-3.5">
          <InfoRow label="器物" value="经典紫砂壶" />
          <InfoRow label="泥色" value={clay.name} />
          <InfoRow
            label="纹样"
            value={ornament ? `${ornament.name} · ${design.ornament.style === 'painted' ? '彩绘' : '雕刻'}` : '不添加'}
          />
          <InfoRow label="包装" value={packaging.name} />
          <InfoRow label="演示价格" value="¥399 起" accent />
          <InfoRow label="确认时间" value={formatTime(confirmation.at)} />
        </div>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-secondary/75">
              Simulated progress
            </p>
            <span className="rounded-full border border-line/80 bg-muted/45 px-2 py-0.5 text-[9px] text-secondary">
              模拟流程
            </span>
          </div>
          <div className="flex items-center justify-between gap-0">
            {steps.map((step, index) => {
              const active = index === 0;
              return (
                <div key={step} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                  <div className="flex w-full items-center">
                    <span className="h-px flex-1 bg-line/70" />
                    <span
                      className={
                        active
                          ? 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-success bg-success text-white'
                          : 'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-secondary/50'
                      }
                    >
                      {active ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Circle className="h-2.5 w-2.5" />
                      )}
                    </span>
                    <span className="h-px flex-1 bg-line/70" />
                  </div>
                  <span
                    className={
                      active
                        ? 'text-[8.5px] text-success'
                        : 'text-[8.5px] text-secondary/65'
                    }
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/35 px-2.5 py-2 text-[9.5px] leading-relaxed text-secondary">
            <Clock3 className="mt-0.5 h-3 w-3 shrink-0" />
            以上为概念演示状态，不接入真实物流、支付或生产系统。
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="Confirm / 确认"
      title="确认这件作品？"
      maxWidth="max-w-lg"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            返回调整
          </Button>
          <Button variant="primary" className="flex-1" onClick={onConfirm}>
            生成演示确认单
          </Button>
        </div>
      }
    >
      <div className="rounded-xl border border-line/70 bg-surface/60 px-3.5">
        <InfoRow label="作品" value={name} />
        <InfoRow label="器物" value="经典紫砂壶 · ¥399 起" />
        <InfoRow label="泥色" value={clay.name} />
        <InfoRow
          label="铭文"
          value={
            design.inscription.enabled && design.inscription.text.trim()
              ? design.inscription.text
              : '不添加'
          }
        />
        <InfoRow
          label="纹样"
          value={
            ornament
              ? `${ornament.name} · ${design.ornament.style === 'painted' ? '彩绘' : '雕刻'}`
              : '不添加'
          }
        />
        <InfoRow label="包装" value={packaging.name} />
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand/15 bg-brand/[0.045] px-3 py-2.5 text-[10.5px] leading-relaxed text-secondary">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand/75" />
        <span>
          确认后会生成演示订单编号并保存当前方案快照。不会发起支付，也不会产生真实生产订单。
        </span>
      </div>
    </Modal>
  );
}
