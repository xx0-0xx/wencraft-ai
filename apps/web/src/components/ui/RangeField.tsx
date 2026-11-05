import { cn } from '../../lib/cn';

interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: string;
  className?: string;
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
  className,
}: RangeFieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-medium text-ink/90">{label}</span>
        <span className="font-serif text-[12px] tabular-nums text-secondary">
          {format ? format(value) : value}
        </span>
      </span>
      <input
        className="silk-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? (
        <span className="mt-0.5 block text-[10px] leading-relaxed text-secondary/75">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
