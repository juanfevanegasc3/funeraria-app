// Cliente HTTP de la API del Worker (/api/*).
import type { ListResponse, OptionItem, PublicTableMeta, Row } from '../../src/types';

const USER_KEY = 'funeraria.usuario';

export function getUsuarioActivo(): string {
  try {
    return localStorage.getItem(USER_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setUsuarioActivo(id: string) {
  try {
    if (id) localStorage.setItem(USER_KEY, id);
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* almacenamiento no disponible: se usa solo en memoria */
  }
  memoriaUsuario = id;
}
let memoriaUsuario = getUsuarioActivo();

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (memoriaUsuario) headers['X-Usuario-Id'] = memoriaUsuario;
  const res = await fetch(`/api${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
  return data as T;
}

const optionsCache = new Map<string, Promise<OptionItem[]>>();

export const api = {
  health: () => request<{ status: string; tablas: number; esperadas: number; latencia_ms: number }>('GET', '/health'),
  meta: () => request<PublicTableMeta[]>('GET', '/meta'),
  stats: <T,>() => request<T>('GET', '/stats'),
  list: (tabla: string, params: Record<string, string>) =>
    request<ListResponse>('GET', `/${tabla}?${new URLSearchParams(params).toString()}`),
  options: (tabla: string) => {
    if (!optionsCache.has(tabla)) {
      const p = request<OptionItem[]>('GET', `/${tabla}/options`);
      p.catch(() => optionsCache.delete(tabla));
      optionsCache.set(tabla, p);
    }
    return optionsCache.get(tabla)!;
  },
  create: (tabla: string, body: Row) => request<Row>('POST', `/${tabla}`, body).finally(() => optionsCache.clear()),
  update: (tabla: string, id: string, body: Row) =>
    request<Row>('PUT', `/${tabla}/${encodeURIComponent(id)}`, body).finally(() => optionsCache.clear()),
  remove: (tabla: string, id: string) =>
    request<{ ok: boolean }>('DELETE', `/${tabla}/${encodeURIComponent(id)}`).finally(() => optionsCache.clear()),
};

export const rowId = (meta: PublicTableMeta, row: Row) => meta.pk.map((k) => String(row[k])).join('~');
