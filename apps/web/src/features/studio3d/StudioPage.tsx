import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Save } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { getClayMaterial } from '../../data/materials';
import { getOrnament } from '../../data/ornaments';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import type { ViewPreset } from './StudioCanvas';
import { StudioHeader } from './components/StudioHeader';
import { ToolTabs, type ToolTab } from './components/ToolTabs';
import { MaterialPanel } from './components/MaterialPanel';
import { InscriptionPanel } from './components/InscriptionPanel';
import { OrnamentPanel } from './components/OrnamentPanel';
import { PackagingPanel } from './components/PackagingPanel';
import { DesignInfoPanel } from './components/DesignInfoPanel';
import { StageOverlay } from './components/StageOverlay';
import { StagePreview } from './components/StagePreview';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ConfirmDialog, type ConfirmationSnapshot } from './components/ConfirmDialog';

const StudioCanvas = lazy(() => import('./StudioCanvas').then(({ StudioCanvas }) => ({ default: StudioCanvas })));

function ActivePanel({ tab }: { tab: ToolTab }) {
  const content =
    tab === 'material' ? (
      <MaterialPanel />
    ) : tab === 'inscription' ? (
      <InscriptionPanel />
    ) : tab === 'ornament' ? (
      <OrnamentPanel />
    ) : (
      <PackagingPanel />
    );

  return (
    <div key={tab} className="animate-fade-up">
      {content}
    </div>
  );
}

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('material');
  const [stageReady, setStageReady] = useState(false);
  const [viewCommand, setViewCommand] = useState<{ preset: ViewPreset; nonce: number }>({
    preset: 'front',
    nonce: 0,
  });
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationSnapshot | null>(null);

  const design = useStudioStore((state) => state.design);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const setAutoRotate = useStudioStore((state) => state.setAutoRotate);
  const saveDraft = useStudioStore((state) => state.saveDraft);

  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) setAutoRotate(false);
  }, [setAutoRotate]);

  const handleView = useCallback(
    (preset: ViewPreset) => {
      setAutoRotate(false);
      setViewCommand((previous) => ({ preset, nonce: previous.nonce + 1 }));
    },
    [setAutoRotate],
  );

  const handleSave = useCallback(() => {
    saveDraft();
    showToast('草稿已保存到本机浏览器');
  }, [saveDraft, showToast]);

  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      'canvas[data-studio-canvas="true"]',
    );
    if (!canvas) {
      showToast('3D 场景尚未准备好，请稍后再试');
      return;
    }
    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const context = output.getContext('2d');
    if (!context) {
      showToast('当前浏览器不支持导出预览图');
      return;
    }
    context.fillStyle = '#ece4d7';
    context.fillRect(0, 0, output.width, output.height);
    context.drawImage(canvas, 0, 0);

    const scale = Math.max(1, output.width / 1400);
    context.font = `500 ${Math.round(20 * scale)}px "Noto Serif SC", "Songti SC", "SimSun", serif`;
    context.fillStyle = 'rgba(245, 234, 218, 0.58)';
    context.textAlign = 'right';
    context.fillText(
      '器物有言 · WenCraft AI',
      output.width - Math.round(28 * scale),
      output.height - Math.round(22 * scale),
    );

    output.toBlob((blob) => {
      if (!blob) {
        showToast('预览图生成失败，请重试');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `器物有言-紫砂壶-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('预览图已保存到下载目录');
    }, 'image/png');
  }, [showToast]);

  const handleConfirm = useCallback(() => {
    const at = new Date().toISOString();
    const day = at.slice(0, 10).replace(/-/g, '');
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const orderNo = `WC-${day}-${suffix}`;
    try {
      localStorage.setItem(
        'wencraft:demo-confirmation:v1',
        JSON.stringify({
          version: 1,
          productId: 'teapot',
          orderNo,
          createdAt: at,
          design,
        }),
      );
    } catch (error) {
      console.warn('无法写入演示确认单', error);
    }
    saveDraft();
    setConfirmation({ orderNo, at });
    showToast('已生成演示确认单');
  }, [design, saveDraft, showToast]);

  const clay = getClayMaterial(design.materialId);
  const ornament = getOrnament(design.ornament.id);
  const displayName =
    design.inscription.enabled && design.inscription.text.trim()
      ? `「${design.inscription.text.trim()}」`
      : '素面紫砂壶';

  return (
    <div className="min-h-screen bg-paper text-ink">
      <StudioHeader />

      <div className="mx-auto max-w-[1680px] px-3 pb-[calc(96px+env(safe-area-inset-bottom))] pt-3 sm:px-5 lg:h-[calc(100vh-64px)] lg:overflow-hidden lg:px-6 lg:pb-4 lg:pt-4">
        <div className="grid grid-cols-1 gap-3 lg:h-full lg:grid-cols-[228px_minmax(0,1fr)_300px] xl:grid-cols-[248px_minmax(0,1fr)_320px]">
          <aside className="hidden min-h-0 flex-col gap-3 lg:flex">
            <div className="rounded-2xl border border-line/70 bg-surface/75 p-1.5 shadow-soft">
              <ToolTabs active={activeTab} onChange={setActiveTab} />
            </div>
            <div className="scroll-slim min-h-0 flex-1 overflow-y-auto rounded-2xl border border-line/70 bg-surface/75 shadow-soft">
              <ActivePanel tab={activeTab} />
            </div>
          </aside>

          <section className="flex min-w-0 flex-col gap-3 lg:h-full">
            <div className="relative h-[46vh] min-h-[320px] max-h-[560px] overflow-hidden rounded-2xl border border-line/80 bg-[#34271e] shadow-soft sm:h-[52vh] lg:h-auto lg:min-h-0 lg:max-h-none lg:flex-1">
              <div className="absolute inset-0">
                <ErrorBoundary fallback={<StagePreview onRetry={() => window.location.reload()} />}>
                  <Suspense fallback={<StagePreview />}>
                    <StudioCanvas viewCommand={viewCommand} ready={stageReady} onReadyChange={setStageReady} />
                  </Suspense>
                </ErrorBoundary>
              </div>
              {stageReady && <StageOverlay
                autoRotate={autoRotate}
                onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
                onScreenshot={handleScreenshot}
                onView={handleView}
              />}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
            </div>

            <div className="lg:hidden">
              <ToolTabs
                active={activeTab}
                onChange={setActiveTab}
                orientation="horizontal"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-line/70 bg-surface/75 shadow-soft lg:hidden">
              <ActivePanel tab={activeTab} />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-surface/65 px-3.5 py-2.5 shadow-soft lg:hidden">
              <div className="min-w-0">
                <p className="text-[8.5px] uppercase tracking-[0.2em] text-secondary/75">
                  Current work
                </p>
                <p className="truncate font-serif text-[14px] text-ink">
                  {displayName}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                <span className="rounded-full border border-line/80 bg-surface px-2 py-0.5 text-[9px] text-secondary">
                  {clay.name}
                </span>
                <span className="rounded-full border border-line/80 bg-surface px-2 py-0.5 text-[9px] text-secondary">
                  {ornament ? ornament.name : '素面'}
                </span>
                <span className="rounded-full border border-line/80 bg-surface px-2 py-0.5 text-[9px] text-secondary">
                  ¥399 起
                </span>
              </div>
            </div>
          </section>

          <aside className="hidden min-h-0 flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface/75 shadow-soft lg:flex">
            <DesignInfoPanel
              onSave={handleSave}
              onConfirm={() => setConfirmOpen(true)}
            />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line/80 bg-surface/95 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            leadingIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            保存草稿
          </Button>
          <Button
            variant="primary"
            className="flex-[1.35]"
            leadingIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => setConfirmOpen(true)}
          >
            确认作品
          </Button>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />

      <ConfirmDialog
        open={confirmOpen}
        confirmation={confirmation}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
