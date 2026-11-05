import { Box, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../../../components/BrandMark';

export function StudioHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark />
          <span className="hidden h-7 w-px bg-line md:block" />
          <div className="hidden min-w-0 md:block">
            <p className="text-[9px] uppercase tracking-[0.26em] text-secondary/80">
              Studio / 01
            </p>
            <p className="truncate font-serif text-[14px] text-ink">
              3D 紫砂壶定制工作台
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-success/20 bg-success/[0.07] px-3 py-1.5 text-[9.5px] text-success sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            真实模型 · 实时交互
          </span>
          <Link
            to="/model-inspector"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10.5px] text-secondary transition-colors hover:bg-muted/70 hover:text-ink md:inline-flex"
          >
            <Box className="h-3.5 w-3.5" />
            模型检查
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-[10.5px] text-secondary transition-colors hover:bg-muted/70 hover:text-ink"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">返回首页</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
