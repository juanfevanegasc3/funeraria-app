import { useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import { formatMoney, formatNumber, MESES } from '../format';

interface Stats {
  kpi: Record<string, number>;
  polizasPorEstado: { estado: string; total: number }[];
  eventosPorMes: { mes: string; total: number }[];
  topServicios: { servicio: string; total: number }[];
  stockBajo: { codigo: string; nombre_articulo: string; cantidad_disponible: number; categoria: string }[];
  recursos: Record<string, number>;
  facturas: { estado: string; total: number; valor_total: number; valor_cubierto: number; valor_cliente: number; saldo: number }[];
  actividadReciente: { id_bitacora: number; fecha_hora: string; tabla_afectada: string; id_registro_afectado: string; operacion: string; usuario: string }[];
}

function Kpi({ label, value, hint, href }: { label: string; value: string; hint?: string; href?: string }) {
  const body = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </>
  );
  return href ? <a href={href} className="card block p-4 transition hover:border-slate-300 hover:shadow">{body}</a> : <div className="card p-4">{body}</div>;
}

function Panel({ title, children, href }: { title: string; children: ReactNode; href?: string }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {href && <a href={href} className="text-xs text-slate-500 hover:text-slate-800">Ver todo →</a>}
      </div>
      {children}
    </div>
  );
}

/** Barras horizontales: una sola serie, valor rotulado al final de cada barra. */
function Bars({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label} className="grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] items-center gap-3 text-sm">
          <span className="truncate text-slate-600" title={i.label}>{i.label}</span>
          <span className="h-2.5 rounded-full bg-slate-100">
            <span className="block h-2.5 rounded-full bg-slate-700" style={{ width: `${(i.value / max) * 100}%` }} />
          </span>
          <span className="text-right tabular-nums text-slate-900">{i.value}</span>
        </li>
      ))}
    </ul>
  );
}

/** Columnas por mes para los últimos 12 meses (los meses sin eventos se muestran en cero). */
function MonthColumns({ data }: { data: { mes: string; total: number }[] }) {
  const now = new Date();
  const meses = Array.from({ length: 12 }, (_, k) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + k, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { key, label: MESES[d.getMonth()], value: data.find((x) => x.mes === key)?.total ?? 0 };
  });
  const max = Math.max(1, ...meses.map((m) => m.value));
  return (
    <div className="flex h-40 items-end gap-1.5">
      {meses.map((m) => (
        <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${m.key}: ${m.value}`}>
          <span className="text-xs tabular-nums text-slate-600">{m.value || ''}</span>
          <span className="w-full max-w-6 rounded-t bg-slate-700" style={{ height: `${(m.value / max) * 100}%`, minHeight: m.value ? 4 : 1 }} />
          <span className="text-[11px] text-slate-500">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.stats<Stats>().then(setS).catch((e: Error) => setError(e.message));
  }, []);

  if (error) return <div className="card border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>;
  if (!s) return <p className="text-sm text-slate-500">Cargando métricas…</p>;

  const k = s.kpi;
  const r = s.recursos;
  const saldo = s.facturas.find((f) => f.estado === 'Pendiente')?.saldo ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Pólizas activas" value={formatNumber(k.polizas_activas)} hint={`${k.titulares} titulares · ${k.beneficiarios} beneficiarios`} href="#/t/poliza" />
        <Kpi label="Eventos este mes" value={formatNumber(k.eventos_mes)} hint={`${k.eventos_total} en total · ${k.eventos_particulares} particulares`} href="#/t/evento_fallecimiento" />
        <Kpi label="Saldo por cobrar" value={formatMoney(saldo)} hint="Facturas pendientes, valor a cargo del cliente" href="#/t/factura" />
        <Kpi label="Recaudo de primas (12 meses)" value={formatMoney(k.recaudo_primas_12m)} href="#/t/pago_prima" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Servicios en proceso" value={formatNumber(k.servicios_en_proceso)} hint="Programados o en curso" href="#/t/servicio_prestado" />
        <Kpi label="Préstamos sin devolver" value={formatNumber(k.prestamos_pendientes)} hint="Cofres y elementos prestables" href="#/t/articulo_entregado" />
        <Kpi label="Vehículos disponibles" value={`${r.vehiculos_disponibles} / ${r.vehiculos_total}`} href="#/t/vehiculo" />
        <Kpi label="Instalaciones disponibles" value={`${r.instalaciones_disponibles} / ${r.instalaciones_total}`} href="#/t/instalacion" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Fallecimientos atendidos por mes" href="#/t/evento_fallecimiento">
          <MonthColumns data={s.eventosPorMes} />
        </Panel>
        <Panel title="Pólizas por estado" href="#/t/poliza">
          <Bars items={s.polizasPorEstado.map((p) => ({ label: p.estado, value: p.total }))} />
        </Panel>
        <Panel title="Servicios más prestados" href="#/t/servicio_prestado">
          <Bars items={s.topServicios.map((p) => ({ label: p.servicio, value: p.total }))} />
        </Panel>
        <Panel title="Facturación por estado" href="#/t/factura">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-1.5 pr-3 font-medium">Estado</th>
                  <th className="py-1.5 pr-3 text-right font-medium">Facturas</th>
                  <th className="py-1.5 pr-3 text-right font-medium">Cubierto póliza</th>
                  <th className="py-1.5 pr-3 text-right font-medium">A cargo cliente</th>
                  <th className="py-1.5 text-right font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {s.facturas.map((f) => (
                  <tr key={f.estado}>
                    <td className="py-2 pr-3 text-slate-700">{f.estado}</td>
                    <td className="py-2 pr-3 text-right">{f.total}</td>
                    <td className="py-2 pr-3 text-right">{formatMoney(f.valor_cubierto)}</td>
                    <td className="py-2 pr-3 text-right">{formatMoney(f.valor_cliente)}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{formatMoney(f.estado === 'Anulada' ? 0 : f.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Inventario con existencias bajas (≤ 3)" href="#/t/articulo">
          {s.stockBajo.length === 0 ? (
            <p className="text-sm text-slate-500">Todo el inventario tiene existencias suficientes.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {s.stockBajo.map((a) => (
                <li key={a.codigo} className="flex items-center justify-between py-2">
                  <span><span className="font-medium text-slate-900">{a.nombre_articulo}</span> <span className="text-xs text-slate-500">{a.codigo} · {a.categoria}</span></span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${a.cantidad_disponible === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{a.cantidad_disponible} und.</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Actividad reciente (bitácora)" href="#/t/bitacora_auditoria">
          <ul className="divide-y divide-slate-100 text-sm">
            {s.actividadReciente.map((a) => (
              <li key={a.id_bitacora} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate">
                  <span className="font-medium text-slate-900">{a.operacion}</span> en <span className="text-slate-700">{a.tabla_afectada}</span> #{a.id_registro_afectado}
                </span>
                <span className="shrink-0 text-xs text-slate-500">{a.usuario} · {a.fecha_hora.slice(0, 16)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
