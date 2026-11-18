import { useEffect, useState } from 'react';
import type { OptionItem } from '../../../src/types';
import { api, getUsuarioActivo, setUsuarioActivo } from '../api';

/** Usuario que se registra en la bitácora de auditoría (cabecera X-Usuario-Id). */
export default function UserSelect() {
  const [opciones, setOpciones] = useState<OptionItem[]>([]);
  const [valor, setValor] = useState(getUsuarioActivo());

  useEffect(() => {
    api.options('usuario').then(setOpciones).catch(() => setOpciones([]));
  }, []);

  return (
    <label className="flex items-center gap-2 text-xs text-slate-500">
      <span className="hidden md:inline">Usuario</span>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
        value={valor}
        onChange={(e) => {
          setValor(e.target.value);
          setUsuarioActivo(e.target.value);
        }}
        title="Usuario que firma los cambios en la bitácora"
      >
        <option value="">— sin usuario —</option>
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
