// CRUD genérico dirigido por metadatos (src/meta.ts).
// Todos los identificadores SQL (tablas/columnas) salen de la lista blanca de metadatos;
// todos los valores del usuario viajan como parámetros con .bind().
import { TABLE_MAP } from './meta';
import { HttpError, translateDbError } from './errors';
import type { ColumnMeta, ListResponse, OptionItem, Row, TableMeta } from './types';

const MAX_LIMIT = 200;

export function getTable(name: string): TableMeta {
  const t = TABLE_MAP[name];
  if (!t) throw new HttpError(404, `Entidad desconocida: ${name}`);
  return t;
}

const labelOf = (t: TableMeta, alias: string) => `(${t.label.replaceAll('{a}', alias)})`;
const fkColumns = (t: TableMeta) => t.columns.filter((c) => c.fk);

function joinsFor(t: TableMeta) {
  const joins: string[] = [];
  const selects: string[] = [];
  const labelExprs: string[] = [];
  fkColumns(t).forEach((c, i) => {
    const target = getTable(c.fk!);
    const alias = `j${i}`;
    joins.push(`LEFT JOIN ${target.name} ${alias} ON ${alias}.${target.pk[0]} = t.${c.name}`);
    const expr = labelOf(target, alias);
    selects.push(`${expr} AS ${c.name}__label`);
    labelExprs.push(expr);
  });
  return { joins, selects, labelExprs };
}

/** Convierte un valor recibido por JSON al tipo de la columna. */
function coerce(c: ColumnMeta, v: unknown): unknown {
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  switch (c.type) {
    case 'integer': {
      const n = Number(v);
      if (!Number.isInteger(n)) throw new HttpError(400, `${c.label}: debe ser un número entero.`);
      return n;
    }
    case 'real': {
      const n = Number(v);
      if (!Number.isFinite(n)) throw new HttpError(400, `${c.label}: debe ser un número.`);
      return n;
    }
    case 'boolean':
      return v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
    case 'date': {
      const s = String(v).slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new HttpError(400, `${c.label}: fecha no válida (AAAA-MM-DD).`);
      return s;
    }
    case 'time': {
      const s = String(v).slice(0, 5);
      if (!/^\d{2}:\d{2}$/.test(s)) throw new HttpError(400, `${c.label}: hora no válida (HH:MM).`);
      return s;
    }
    case 'datetime': {
      let s = String(v).replace('T', ' ').slice(0, 19);
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) s += ':00';
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) throw new HttpError(400, `${c.label}: fecha y hora no válidas.`);
      return s;
    }
    default:
      return String(v).trim();
  }
}

/** Interpreta el id de la URL; las PK compuestas se envían separadas por "~" (p. ej. 1~3). */
export function parseId(t: TableMeta, raw: string): number[] {
  const parts = decodeURIComponent(raw).split('~');
  if (parts.length !== t.pk.length) throw new HttpError(400, `Identificador inválido para ${t.name}.`);
  return parts.map((p) => {
    const n = Number(p);
    if (!Number.isInteger(n)) throw new HttpError(400, 'El identificador debe ser numérico.');
    return n;
  });
}

const pkWhere = (t: TableMeta, alias = '') => t.pk.map((k) => `${alias}${k} = ?`).join(' AND ');
const jsonOf = (t: TableMeta, alias: string) =>
  `json_object(${t.columns.map((c) => `'${c.name}', ${alias}.${c.name}`).join(', ')})`;

export async function list(db: D1Database, t: TableMeta, params: URLSearchParams): Promise<ListResponse> {
  const { joins, selects, labelExprs } = joinsFor(t);
  const where: string[] = [];
  const binds: unknown[] = [];

  const q = params.get('q')?.trim();
  if (q) {
    const exprs = [...t.columns.filter((c) => c.search).map((c) => `t.${c.name}`), ...labelExprs, labelOf(t, 't')];
    where.push('(' + exprs.map((e) => `${e} LIKE ?`).join(' OR ') + ')');
    exprs.forEach(() => binds.push(`%${q}%`));
  }
  for (const c of t.columns) {
    const v = params.get(c.name);
    if (v !== null && v !== '') {
      where.push(`t.${c.name} = ?`);
      binds.push(coerce(c, v));
    }
  }

  const sortCol = t.columns.find((c) => c.name === params.get('sort'));
  const dir = params.get('dir') === 'asc' ? 'ASC' : 'DESC';
  const order = sortCol ? `t.${sortCol.name} ${dir}` : t.pk.map((k) => `t.${k} DESC`).join(', ');
  const limit = Math.min(Math.max(Number(params.get('limit')) || 50, 1), MAX_LIMIT);
  const offset = Math.max(Number(params.get('offset')) || 0, 0);

  const from = `FROM ${t.name} t ${joins.join(' ')} ${where.length ? 'WHERE ' + where.join(' AND ') : ''}`;
  const sql = `SELECT t.*, ${labelOf(t, 't')} AS __label${selects.length ? ', ' + selects.join(', ') : ''} ${from} ORDER BY ${order} LIMIT ? OFFSET ?`;
  try {
    const [rows, count] = await db.batch<Row>([
      db.prepare(sql).bind(...binds, limit, offset),
      db.prepare(`SELECT COUNT(*) AS total ${from}`).bind(...binds),
    ]);
    return { data: rows.results, total: Number((count.results[0] as Row).total), limit, offset };
  } catch (e) {
    throw translateDbError(e);
  }
}

export async function getOne(db: D1Database, t: TableMeta, id: number[]): Promise<Row> {
  const { joins, selects } = joinsFor(t);
  const sql = `SELECT t.*, ${labelOf(t, 't')} AS __label${selects.length ? ', ' + selects.join(', ') : ''}
    FROM ${t.name} t ${joins.join(' ')} WHERE ${pkWhere(t, 't.')}`;
  const row = await db.prepare(sql).bind(...id).first<Row>();
  if (!row) throw new HttpError(404, 'Registro no encontrado.');
  return row;
}

export async function options(db: D1Database, t: TableMeta, q: string | null): Promise<OptionItem[]> {
  const value = t.pk.length === 1 ? `t.${t.pk[0]}` : t.pk.map((k) => `t.${k}`).join(` || '~' || `);
  const lbl = labelOf(t, 't');
  const sql = `SELECT CAST(${value} AS TEXT) AS value, ${lbl} AS label FROM ${t.name} t
    ${q ? `WHERE ${lbl} LIKE ?` : ''} ORDER BY label LIMIT 500`;
  const stmt = q ? db.prepare(sql).bind(`%${q}%`) : db.prepare(sql);
  const { results } = await stmt.all<OptionItem>();
  return results;
}

function writableColumns(t: TableMeta, body: Row, mode: 'create' | 'update') {
  const cols: ColumnMeta[] = [];
  const vals: unknown[] = [];
  for (const c of t.columns) {
    if (c.computed || (c.pk && c.auto) || (mode === 'update' && c.pk)) continue;
    const v = coerce(c, body[c.name]);
    if (mode === 'create' && c.required && (v === undefined || v === null)) {
      throw new HttpError(400, `El campo «${c.label}» es obligatorio.`);
    }
    if (v === undefined) continue;
    if (mode === 'update' && c.required && v === null) throw new HttpError(400, `El campo «${c.label}» es obligatorio.`);
    cols.push(c);
    vals.push(v);
  }
  return { cols, vals };
}

function auditStmt(db: D1Database, t: TableMeta, userId: number | null, op: 'Inserción' | 'Actualización' | 'Eliminación', id: number[] | 'last', when: 'before' | 'after') {
  const idExpr = id === 'last' ? 'last_insert_rowid()' : '?';
  const idBinds = id === 'last' ? [] : id;
  const snap = `(SELECT ${jsonOf(t, 'x')} FROM ${t.name} x WHERE x.${t.pk[0]} = ${idExpr})`;
  return db.prepare(
    `INSERT INTO bitacora_auditoria (id_usuario, id_tipo_operacion, tabla_afectada, id_registro_afectado, valor_anterior, valor_nuevo)
     VALUES (?, (SELECT id_tipo_operacion FROM tipo_operacion WHERE nombre = ?), ?, CAST(CAST(${idExpr} AS INTEGER) AS TEXT), ${when === 'before' ? snap : 'NULL'}, ${when === 'after' ? snap : 'NULL'})`,
  ).bind(userId, op, t.name, ...idBinds, ...idBinds);
}

export async function create(db: D1Database, t: TableMeta, body: Row, userId: number | null): Promise<Row> {
  const { cols, vals } = writableColumns(t, body, 'create');
  if (!cols.length) throw new HttpError(400, 'No se enviaron datos.');
  const insert = db
    .prepare(`INSERT INTO ${t.name} (${cols.map((c) => c.name).join(', ')}) VALUES (${cols.map(() => '?').join(', ')}) RETURNING *`)
    .bind(...vals);
  try {
    const stmts = [insert];
    if (t.audit) stmts.push(auditStmt(db, t, userId, 'Inserción', 'last', 'after'));
    const [res] = await db.batch<Row>(stmts);
    const row = res.results[0];
    return getOne(db, t, t.pk.map((k) => Number(row[k])));
  } catch (e) {
    throw translateDbError(e);
  }
}

export async function update(db: D1Database, t: TableMeta, id: number[], body: Row, userId: number | null): Promise<Row> {
  const { cols, vals } = writableColumns(t, body, 'update');
  if (!cols.length) return getOne(db, t, id);
  const upd = db.prepare(`UPDATE ${t.name} SET ${cols.map((c) => `${c.name} = ?`).join(', ')} WHERE ${pkWhere(t)}`).bind(...vals, ...id);
  try {
    await getOne(db, t, id);
    if (t.audit) {
      await db.batch([
        auditStmt(db, t, userId, 'Actualización', id, 'before'),
        upd,
        db.prepare(
          `UPDATE bitacora_auditoria SET valor_nuevo = (SELECT ${jsonOf(t, 'x')} FROM ${t.name} x WHERE x.${t.pk[0]} = ?)
           WHERE id_bitacora = (SELECT MAX(id_bitacora) FROM bitacora_auditoria WHERE tabla_afectada = ? AND id_registro_afectado = CAST(CAST(? AS INTEGER) AS TEXT))`,
        ).bind(id[0], t.name, id[0]),
      ]);
    } else {
      await upd.run();
    }
    return getOne(db, t, id);
  } catch (e) {
    throw translateDbError(e);
  }
}

export async function remove(db: D1Database, t: TableMeta, id: number[], userId: number | null): Promise<void> {
  await getOne(db, t, id);
  const del = db.prepare(`DELETE FROM ${t.name} WHERE ${pkWhere(t)}`).bind(...id);
  try {
    if (t.audit) await db.batch([auditStmt(db, t, userId, 'Eliminación', id, 'before'), del]);
    else await del.run();
  } catch (e) {
    throw translateDbError(e);
  }
}
