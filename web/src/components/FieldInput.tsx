import { useEffect, useState } from 'react';
import type { ColumnMeta, OptionItem } from '../../../src/types';
import { api } from '../api';

const LONG_TEXT = new Set(['descripcion', 'valor_anterior', 'valor_nuevo', 'causa_fallecimiento', 'causa_muerte']);

/** Convierte el valor almacenado al formato del <input>. */
export function toInputValue(c: ColumnMeta, v: unknown): string | boolean {
  if (c.type === 'boolean') return Number(v) === 1;
  if (v == null) return '';
  if (c.type === 'datetime') return String(v).replace(' ', 'T').slice(0, 16);
  return String(v);
}

interface Props {
  column: ColumnMeta;
  value: string | boolean;
  disabled?: boolean;
  onChange: (v: string | boolean) => void;
}

export function FkSelect({ table, value, onChange, disabled, required, placeholder = '— seleccione —' }: {
  table: string; value: string; onChange: (v: string) => void; disabled?: boolean; required?: boolean; placeholder?: string;
}) {
  const [opts, setOpts] = useState<OptionItem[] | null>(null);
  useEffect(() => {
    let vivo = true;
    api.options(table).then((o) => vivo && setOpts(o)).catch(() => vivo && setOpts([]));
    return () => { vivo = false; };
  }, [table]);
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled || !opts} required={required}>
      <option value="">{opts ? placeholder : 'Cargando…'}</option>
      {opts?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function FieldInput({ column: c, value, disabled, onChange }: Props) {
  const required = c.required && !disabled;
  if (c.fk) return <FkSelect table={c.fk} value={String(value)} onChange={onChange} disabled={disabled} required={required} />;
  if (c.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 py-2 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-slate-800" checked={Boolean(value)} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        {Boolean(value) ? 'Sí' : 'No'}
      </label>
    );
  }
  if (c.options) {
    return (
      <select className="input" value={String(value)} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={required}>
        <option value="">— seleccione —</option>
        {c.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (c.type === 'text' && LONG_TEXT.has(c.name)) {
    return <textarea className="input min-h-20" value={String(value)} disabled={disabled} required={required} onChange={(e) => onChange(e.target.value)} />;
  }
  const type = { integer: 'number', real: 'number', date: 'date', time: 'time', datetime: 'datetime-local', text: c.name.startsWith('correo') ? 'email' : 'text' }[c.type];
  return (
    <input
      className="input"
      type={type}
      step={c.type === 'real' ? 'any' : c.type === 'integer' ? 1 : undefined}
      value={String(value)}
      disabled={disabled}
      required={required}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
