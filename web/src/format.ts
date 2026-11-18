import type { ColumnMeta, Row } from '../../src/types';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('es-CO');

export const formatMoney = (v: unknown) => money.format(Number(v) || 0);
export const formatNumber = (v: unknown) => num.format(Number(v) || 0);

const MONEY_RE = /^(valor|precio|costo|tarifa|tope)/;
export const isMoney = (c: ColumnMeta) => c.type === 'real' && MONEY_RE.test(c.name);

/** Valor de una celda listo para mostrar en tablas. */
export function display(c: ColumnMeta, row: Row): string {
  const v = row[c.name];
  if (c.fk) return v == null ? '—' : String(row[`${c.name}__label`] ?? v);
  if (v == null || v === '') return '—';
  if (c.type === 'boolean') return Number(v) ? 'Sí' : 'No';
  if (isMoney(c)) return formatMoney(v);
  if (c.type === 'real') return formatNumber(v);
  if (c.type === 'datetime') return String(v).slice(0, 16);
  const s = String(v);
  return s.length > 80 ? s.slice(0, 77) + '…' : s;
}

export const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
