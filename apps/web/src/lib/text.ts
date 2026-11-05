export const MAX_INSCRIPTION_CHARS = 8;

export function clampInscription(value: string): string {
  return Array.from(value.replace(/\s+/g, ' ').trimStart())
    .slice(0, MAX_INSCRIPTION_CHARS)
    .join('');
}

export function countChars(value: string): number {
  return Array.from(value).length;
}

export function formatTime(iso: string | null): string {
  if (!iso) return '尚未保存';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
