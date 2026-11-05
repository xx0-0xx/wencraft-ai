import { Flower2, Package, Palette, Type, type LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/cn';

export type ToolTab = 'material' | 'inscription' | 'ornament' | 'packaging';

interface ToolDefinition {
  id: ToolTab;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const tools: ToolDefinition[] = [
  { id: 'material', label: '材质', hint: '泥色', icon: Palette },
  { id: 'inscription', label: '铭文', hint: '题字', icon: Type },
  { id: 'ornament', label: '纹样', hint: '贴花', icon: Flower2 },
  { id: 'packaging', label: '包装', hint: '礼盒', icon: Package },
];

interface ToolTabsProps {
  active: ToolTab;
  onChange: (tab: ToolTab) => void;
  orientation?: 'vertical' | 'horizontal';
}

export function ToolTabs({ active, onChange, orientation = 'vertical' }: ToolTabsProps) {
  if (orientation === 'horizontal') {
    return (
      <div className="grid grid-cols-4 gap-1 rounded-xl border border-line/80 bg-surface/80 p-1 shadow-soft">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const selected = active === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onChange(tool.id)}
              aria-pressed={selected}
              className={cn(
                'flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 transition-all duration-200',
                selected
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-secondary hover:bg-muted/60 hover:text-ink',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="grid gap-1" aria-label="定制工具">
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        const selected = active === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onChange(tool.id)}
            aria-pressed={selected}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ease-silk',
              selected
                ? 'border-brand/25 bg-brand text-white shadow-[0_10px_24px_-18px_rgba(80,48,32,0.9)]'
                : 'border-transparent text-secondary hover:border-line/80 hover:bg-surface/70 hover:text-ink',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
                selected
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-line/70 bg-surface text-brand/80',
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-medium">{tool.label}</span>
              <span
                className={cn(
                  'mt-0.5 block text-[9px] uppercase tracking-[0.16em]',
                  selected ? 'text-white/55' : 'text-secondary/65',
                )}
              >
                {tool.hint}
              </span>
            </span>
            <span
              className={cn(
                'font-serif text-[10px] tabular-nums',
                selected ? 'text-white/55' : 'text-secondary/45',
              )}
            >
              0{index + 1}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
