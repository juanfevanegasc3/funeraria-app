import { useMemo, useState } from 'react';
import type { PublicTableMeta } from '../../../src/types';

const ORDEN = ['Afiliación', 'Eventos y documentos', 'Servicios y recursos', 'Inventario y compras', 'Facturación', 'Seguridad', 'Catálogos'];

interface Props {
  meta: PublicTableMeta[];
  active: string;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ meta, active, open, onClose }: Props) {
  const [filtro, setFiltro] = useState('');
  const [cerrados, setCerrados] = useState<Record<string, boolean>>({ Catálogos: true });

  const grupos = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    return ORDEN.map((m) => ({
      modulo: m,
      tablas: meta.filter((t) => t.module === m && (!f || t.title.toLowerCase().includes(f))),
    })).filter((g) => g.tablas.length);
  }, [meta, filtro]);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-900 text-slate-200 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <a href="#/" className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-lg text-white">✝</span>
          <span>
            <span className="block text-sm font-semibold text-white">Funeraria</span>
            <span className="block text-xs text-slate-400">Gestión integral</span>
          </span>
        </a>
        <div className="px-4 pb-3">
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            placeholder="Buscar entidad…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 text-sm">
          <a href="#/" className={`mb-2 block rounded-md px-3 py-2 ${!active ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'}`}>
            Panel general
          </a>
          {grupos.map((g) => {
            const cerrado = cerrados[g.modulo] && !filtro;
            return (
              <div key={g.modulo} className="mt-3">
                <button
                  className="flex w-full items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-200"
                  onClick={() => setCerrados((s) => ({ ...s, [g.modulo]: !s[g.modulo] }))}
                >
                  {g.modulo}
                  <span>{cerrado ? '+' : '−'}</span>
                </button>
                {!cerrado && (
                  <ul className="mt-1 space-y-0.5">
                    {g.tablas.map((t) => (
                      <li key={t.name}>
                        <a
                          href={`#/t/${t.name}`}
                          className={`block rounded-md px-3 py-1.5 ${active === t.name ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                        >
                          {t.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
