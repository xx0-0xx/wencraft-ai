import type { ReactNode } from 'react';
import { cn } from '../../../lib/cn';

export function PanelHeading({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.28em] text-secondary/80">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-serif text-[19px] leading-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-[11px] leading-relaxed text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </div>
  );
}

export function PanelBlock({
  children,
  className,
  title,
  hint,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  hint?: string;
}) {
  return (
    <section className={cn('space-y-2.5', className)}>
      {title ? (
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[12px] font-medium text-ink/90">{title}</h3>
          {hint ? (
            <span className="text-[10px] text-secondary/80">{hint}</span>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/55 py-2.5 last:border-0">
      <span className="shrink-0 text-[11px] text-secondary">{label}</span>
      <span
        className={cn(
          'min-w-0 text-right text-[12px] leading-relaxed',
          accent ? 'font-serif text-brand' : 'text-ink',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function SoftNote({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-line/65 bg-muted/30 px-3 py-2.5 text-[10.5px] leading-relaxed text-secondary">
      {icon ? <span className="mt-0.5 shrink-0 text-brand/70">{icon}</span> : null}
      <span>{children}</span>
    </div>
  );
}
