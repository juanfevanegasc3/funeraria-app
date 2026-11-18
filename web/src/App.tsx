import { useEffect, useState } from 'react';
import type { PublicTableMeta } from '../../src/types';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EntityView from './components/EntityView';
import UserSelect from './components/UserSelect';

/** Ruta basada en hash: #/ (dashboard) o #/t/<tabla> */
function useHashRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export default function App() {
  const route = useHashRoute();
  const [meta, setMeta] = useState<PublicTableMeta[] | null>(null);
  const [error, setError] = useState('');
  const [health, setHealth] = useState<'ok' | 'error' | 'cargando'>('cargando');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.meta().then(setMeta).catch((e: Error) => setError(e.message));
    api.health().then(() => setHealth('ok')).catch(() => setHealth('error'));
  }, []);

  useEffect(() => setMenuOpen(false), [route]);

  const tabla = route.startsWith('t/') ? route.slice(2) : '';
  const current = meta?.find((t) => t.name === tabla);

  return (
    <div className="flex min-h-screen">
      <Sidebar meta={meta ?? []} active={tabla} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <button className="btn-secondary lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button>
          <h1 className="truncate text-base font-semibold text-slate-900">{current ? current.module : 'Panel general'}</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden items-center gap-2 text-xs text-slate-500 sm:flex" title="Estado de la conexión con D1">
              <span className={`h-2 w-2 rounded-full ${health === 'ok' ? 'bg-emerald-500' : health === 'error' ? 'bg-rose-500' : 'bg-amber-400'}`} />
              {health === 'ok' ? 'Base de datos conectada' : health === 'error' ? 'Sin conexión a la base' : 'Verificando…'}
            </span>
            <UserSelect />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8">
          {error && <div className="card border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">No se pudo cargar la aplicación: {error}</div>}
          {!meta && !error && <p className="text-sm text-slate-500">Cargando…</p>}
          {meta && !tabla && <Dashboard />}
          {meta && tabla && !current && <p className="text-sm text-slate-500">La entidad «{tabla}» no existe.</p>}
          {meta && current && <EntityView key={current.name} meta={current} />}
        </main>
      </div>
    </div>
  );
}
