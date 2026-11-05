import { lazy, Suspense, useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrandMark } from './components/BrandMark';
import { Button } from './components/ui/Button';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudioPage = lazy(() => import('./features/studio3d/StudioPage'));
const ModelInspectorPage = lazy(() => import('./pages/ModelInspectorPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper">
      <BrandMark />
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-brand/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand/75" />
        <span className="font-serif text-[14px] text-brand">器</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.24em] text-secondary/70">
        Preparing the studio
      </p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-brand">
        <Compass className="h-6 w-6" />
      </span>
      <div>
        <p className="text-[10px] uppercase tracking-[0.26em] text-secondary/70">
          404 / Not found
        </p>
        <h1 className="mt-2 font-serif text-3xl text-ink">此处尚无器物</h1>
        <p className="mt-2 text-[12px] text-secondary">
          页面可能已移动，或仍在下一阶段的创作中。
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/">
          <Button variant="secondary" leadingIcon={<ArrowLeft className="h-4 w-4" />}>
            返回首页
          </Button>
        </Link>
        <Link to="/studio">
          <Button variant="primary">进入 3D 工作台</Button>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="页面暂时未加载">
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/model-inspector" element={<ModelInspectorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
