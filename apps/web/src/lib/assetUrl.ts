const baseUrl = import.meta.env.BASE_URL;

export function assetUrl(path: string): string {
  return `${baseUrl}${path.replace(/^\/+/, '')}`;
}
