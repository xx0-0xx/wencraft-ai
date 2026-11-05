import { Link } from 'react-router-dom';
import { cn } from '../lib/cn';

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
  to?: string;
}

export function BrandMark({ compact, className, to = '/' }: BrandMarkProps) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-3', className)}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-surface shadow-sm">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden>
          <path
            d="M7 23c0-8 4.6-14.6 12-18-.4 8.8-4.8 15.8-12 18Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            className="text-brand"
          />
          <path
            d="M9 25c4.6-1 8.2-4 10.6-8.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            className="text-accent"
          />
          <circle cx="24" cy="9" r="1.7" className="fill-gold" />
        </svg>
      </span>
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-[17px] tracking-[0.18em] text-ink transition-colors group-hover:text-brand">
            器物有言
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.32em] text-secondary">
            WenCraft AI
          </span>
        </span>
      ) : null}
    </Link>
  );
}
