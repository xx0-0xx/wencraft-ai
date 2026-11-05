import type { ReactNode } from 'react';
import { Camera, Move3d, Pause, Play, Rotate3d, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { ViewPreset } from '../StudioCanvas';

interface StageOverlayProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onScreenshot: () => void;
  onView: (preset: ViewPreset) => void;
}

const views: Array<{ id: ViewPreset; label: string }> = [
  { id: 'front', label: '正面' },
  { id: 'side', label: '侧面' },
  { id: 'back', label: '背面' },
];

function StageIconButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
        active
          ? 'border-brand/30 bg-brand text-white shadow-sm'
          : 'border-line/80 bg-surface/85 text-secondary backdrop-blur hover:border-brand/30 hover:text-brand',
      )}
    >
      {children}
    </button>
  );
}

export function StageOverlay({
  autoRotate,
  onToggleAutoRotate,
  onScreenshot,
  onView,
}: StageOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/85 px-2.5 py-1.5 text-[9.5px] font-medium text-secondary shadow-sm backdrop-blur sm:px-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            实时 3D · 真实 GLB
          </span>
          <span className="hidden rounded-full border border-line/70 bg-surface/70 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] text-secondary/85 backdrop-blur sm:inline-flex">
            Teapot / 经典紫砂壶
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <StageIconButton
            label={autoRotate ? '暂停自动旋转' : '开启自动旋转'}
            onClick={onToggleAutoRotate}
            active={autoRotate}
          >
            {autoRotate ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </StageIconButton>
          <StageIconButton label="保存预览截图" onClick={onScreenshot}>
            <Camera className="h-4 w-4" />
          </StageIconButton>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="pointer-events-none hidden items-center gap-1.5 rounded-full border border-line/60 bg-surface/70 px-3 py-1.5 text-[9.5px] text-secondary/85 backdrop-blur sm:flex">
          <Move3d className="h-3.5 w-3.5" />
          拖动旋转 · 滚轮 / 双指缩放
        </div>

        <div className="pointer-events-auto mx-auto flex items-center gap-0.5 rounded-full border border-line/80 bg-surface/90 p-1 shadow-soft backdrop-blur sm:absolute sm:bottom-4 sm:left-1/2 sm:mx-0 sm:-translate-x-1/2">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => onView(view.id)}
              className="rounded-full px-2.5 py-1.5 text-[10px] text-secondary transition-colors hover:bg-muted/75 hover:text-ink sm:px-3"
            >
              {view.label}
            </button>
          ))}
          <span className="mx-0.5 h-4 w-px bg-line/80" />
          <button
            type="button"
            onClick={() => onView('reset')}
            title="重置视角"
            aria-label="重置视角"
            className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] text-secondary transition-colors hover:bg-muted/75 hover:text-ink"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">重置</span>
          </button>
        </div>

        <div className="pointer-events-none flex items-center gap-1.5 rounded-full border border-line/60 bg-surface/70 px-3 py-1.5 text-[9.5px] text-secondary/80 backdrop-blur sm:hidden">
          <Rotate3d className="h-3.5 w-3.5" />
          单指旋转
        </div>
      </div>
    </div>
  );
}
