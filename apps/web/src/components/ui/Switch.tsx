import { cn } from '../../lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[11px] leading-relaxed text-secondary">
            {description}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200',
          checked
            ? 'border-brand bg-brand'
            : 'border-line bg-muted hover:border-secondary/40',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-surface shadow-sm transition-all duration-200 ease-silk',
            checked ? 'left-[22px]' : 'left-[3px]',
          )}
          style={{ width: 18, height: 18 }}
        />
      </button>
    </label>
  );
}
