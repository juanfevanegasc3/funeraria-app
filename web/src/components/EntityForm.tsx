import { useState, type FormEvent } from 'react';
import type { PublicTableMeta, Row } from '../../../src/types';
import { api, rowId } from '../api';
import FieldInput, { toInputValue } from './FieldInput';

interface Props {
  meta: PublicTableMeta;
  row: Row | null; // null = crear
  onClose: () => void;
  onSaved: () => void;
}

export default function EntityForm({ meta, row, onClose, onSaved }: Props) {
  const editing = row !== null;
  const visibles = meta.columns.filter((c) => !(c.pk && c.auto && !editing));
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(visibles.map((c) => [c.name, toInputValue(c, row ? row[c.name] : c.type === 'boolean' && c.name.startsWith('esta_') ? 1 : null)])),
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body: Row = {};
    for (const c of visibles) {
      if (c.computed || (editing && c.pk)) continue;
      const v = values[c.name];
      if (!editing && v === '' && c.hasDefault) continue; // deja actuar el DEFAULT de la base
      body[c.name] = v === '' ? null : v;
    }
    try {
      if (editing) await api.update(meta.name, rowId(meta, row), body);
      else await api.create(meta.name, body);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-8" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="card w-full max-w-2xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{editing ? `Editar: ${String(row.__label ?? '')}` : `Nuevo registro · ${meta.title}`}</h2>
          {meta.description && <p className="mt-1 text-xs text-slate-500">{meta.description}</p>}
        </div>
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {visibles.map((c) => {
            const disabled = c.computed || (editing && c.pk);
            return (
              <div key={c.name} className={c.type === 'text' && ['descripcion', 'valor_anterior', 'valor_nuevo'].includes(c.name) ? 'sm:col-span-2' : ''}>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {c.label}
                  {c.required && !disabled && <span className="text-rose-600"> *</span>}
                  {c.computed && <span className="ml-1 font-normal text-slate-400">(calculado)</span>}
                </label>
                <FieldInput column={c} value={values[c.name]} disabled={disabled} onChange={(v) => setValues((s) => ({ ...s, [c.name]: v }))} />
              </div>
            );
          })}
        </div>
        {error && <p className="mx-6 mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
