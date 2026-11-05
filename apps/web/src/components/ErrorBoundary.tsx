import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('WenCraft ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-surface/80 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-brand">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-serif text-lg text-ink">
            {this.props.fallbackTitle ?? '这一处暂时没有渲染出来'}
          </h3>
          <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-secondary">
            资源加载或图形渲染遇到了问题。可以重试，或刷新页面继续。
          </p>
          {this.state.message ? (
            <p className="mt-2 break-all font-mono text-[10px] text-secondary/70">
              {this.state.message}
            </p>
          ) : null}
        </div>
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={this.handleReset}
        >
          重新加载
        </Button>
      </div>
    );
  }
}
