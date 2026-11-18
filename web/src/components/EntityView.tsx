import { useCallback, useEffect, useState } from 'react';
import type { PublicTableMeta, Row } from '../../../src/types';
import { api, rowId } from '../api';
import { display, isMoney } from '../format';
import ConfirmDialog from './ConfirmDialog';
import EntityForm from './EntityForm';
import { FkSelect } from './FieldInput';

const PAGE = 25;
const SOLO_LECTURA = new Set(['bitacora_auditoria']);

export default function EntityView({ meta }: { meta: PublicTableMeta }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [q, setQ] = useState('');
  const [qDebounced, setQDebounced] = useState('');
  const [filtros, setFiltros] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ col: string; dir: 'asc' | 'desc' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<Row | null | undefined>(undefined); // undefined = cerrado, null = nuevo
  const [borrando, setBorrando] = useState<Row | null>(null);
  const [borrandoEstado, setBorrandoEstado] = useState({ busy: false, error: '' });

  const soloLectura = SOLO_LECTURA.has(meta.name);
  const fkCols = meta.columns.filter((c) => c.fk && !c.pk).slice(0, 3);
  const columnas = meta.columns.filter((c) => !['clave_hash'].includes(c.name));

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => setOffset(0), [qDebounced, filtros]);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError('');
    const params: Record<string, string> = { limit: String(PAGE), offset: String(offset), ...filtros };
    if (qDebounced) params.q = qDebounced;
    if (sort) Object.assign(params, { sort: sort.col, dir: sort.dir });
    for (const k of Object.keys(params)) if (params[k] === '') delete params[k];
    try {
      const res = await api.list(meta.name, params);
      setRows(res.data);
      setTotal(res.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [meta.name, offset, filtros, qDebounced, sort]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const eliminar = async () => {
    if (!borrando) return;
    setBorrandoEstado({ busy: true, error: '' });
    try {
      await api.remove(meta.name, rowId(meta, borrando));
      setBorrando(null);
      setBorrandoEstado({ busy: false, error: '' });
      void cargar();
    } catch (e) {
      setBorrandoEstado({ busy: false, error: (e as Error).message });
    }
  };

  const ordenar = (col: string) =>
    setSort((s) => (s?.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' }));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-slate-900">{meta.title}</h2>
            {meta.static && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">Tabla estática</span>}
            {meta.audit && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Auditada</span>}
          </div>
          {meta.description && <p className="mt-1 text-sm text-slate-500">{meta.description}</p>}
        </div>
        {!soloLectura && <button className="btn-primary" onClick={() => setEditando(null)}>+ Nuevo</button>}
      </div>

      <div className="card flex flex-wrap items-end gap-3 p-4">
        <label className="min-w-56 flex-1">
          <span className="mb-1 block text-xs font-medium text-slate-600">Buscar</span>
          <input className="input" placeholder="Texto libre…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        {fkCols.map((c) => (
          <label key={c.name} className="w-56">
            <span className="mb-1 block text-xs font-medium text-slate-600">{c.label}</span>
            <FkSelect table={c.fk!} value={filtros[c.name] ?? ''} placeholder="Todos" onChange={(v) => setFiltros((f) => ({ ...f, [c.name]: v }))} />
          </label>
        ))}
        {(q || Object.values(filtros).some(Boolean)) && (
          <button className="btn-secondary" onClick={() => { setQ(''); setFiltros({}); }}>Limpiar</button>
        )}
      </div>

      {error && <div className="card border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {columnas.map((c) => (
                  <th key={c.name} className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold text-slate-600">
                    <button className="hover:text-slate-900" onClick={() => ordenar(c.name)}>
                      {c.label}
                      {sort?.col === c.name ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                    </button>
                  </th>
                ))}
                {!soloLectura && <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={rowId(meta, r)} className="hover:bg-slate-50">
                  {columnas.map((c) => (
                    <td key={c.name} className={`whitespace-nowrap px-3 py-2 ${isMoney(c) || c.type === 'integer' && !c.fk ? 'text-right tabular-nums' : ''} ${c.pk ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                      {display(c, r)}
                    </td>
                  ))}
                  {!soloLectura && (
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <button className="text-slate-700 underline-offset-2 hover:underline" onClick={() => setEditando(r)}>Editar</button>
                      <button className="ml-3 text-rose-700 underline-offset-2 hover:underline" onClick={() => setBorrando(r)}>Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={columnas.length + 1} className="px-3 py-10 text-center text-slate-500">No hay registros que coincidan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span>{loading ? 'Cargando…' : `${total} registro${total === 1 ? '' : 's'}`}</span>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-2 py-1" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Anterior</button>
            <span>{total ? `${offset + 1}–${Math.min(offset + PAGE, total)}` : '0'}</span>
            <button className="btn-secondary px-2 py-1" disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Siguiente</button>
          </div>
        </div>
      </div>

      {editando !== undefined && (
        <EntityForm meta={meta} row={editando} onClose={() => setEditando(undefined)} onSaved={() => { setEditando(undefined); void cargar(); }} />
      )}
      {borrando && (
        <ConfirmDialog
          title="Eliminar registro"
          message={`¿Seguro que deseas eliminar «${String(borrando.__label ?? rowId(meta, borrando))}»? Esta acción no se puede deshacer.`}
          busy={borrandoEstado.busy}
          error={borrandoEstado.error}
          onCancel={() => { setBorrando(null); setBorrandoEstado({ busy: false, error: '' }); }}
          onConfirm={eliminar}
        />
      )}
    </section>
  );
}
