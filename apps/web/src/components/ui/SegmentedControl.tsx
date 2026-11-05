import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
  compact?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
  ariaLabel,
  compact,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'grid gap-1 rounded-xl border border-line/80 bg-muted/45 p-1',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-w-0 rounded-lg px-2 text-center transition-all duration-200 ease-silk',
              compact ? 'py-1.5 text-[12px]' : 'py-2 text-[13px]',
              active
                ? 'bg-surface text-ink shadow-[0_4px_14px_-10px_rgba(62,43,31,0.65)]'
                : 'text-secondary hover:bg-surface/55 hover:text-ink',
            )}
          >
            <span className="block truncate font-medium">{option.label}</span>
            {option.hint ? (
              <span className="mt-0.5 block truncate text-[10px] text-secondary/80">
                {option.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
