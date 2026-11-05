import { assetUrl } from '../../../lib/assetUrl';

export function StagePreview({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className={`absolute inset-0 bg-[#34271e] ${onRetry ? 'z-30' : 'z-20'}`}>
      <img
        className="h-full w-full object-contain"
        src={assetUrl('/assets/products/teapot-cover.webp')}
        alt="紫砂壶款式参考图"
        fetchPriority="high"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-black/70 px-3 py-2 text-xs text-white">
        <p role="status">
          {onRetry
            ? '款式参考图 · 可继续编辑'
            : '款式参考图 · 3D 在后台准备，可先编辑'}
        </p>
        {onRetry && (
          <button type="button" className="rounded-full border border-white/40 px-3 py-1.5" onClick={onRetry}>
            重试 3D
          </button>
        )}
      </div>
    </div>
  );
}
