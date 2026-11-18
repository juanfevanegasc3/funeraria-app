// Punto de entrada del Worker: API REST (Hono + D1) y entrega del frontend compilado (assets).
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { TABLES } from './meta';
import { create, getOne, getTable, list, options, parseId, remove, update } from './crud';
import { HttpError } from './errors';
import { getStats } from './stats';
import type { Env } from './env';
import type { PublicTableMeta, Row } from './types';

const app = new Hono<{ Bindings: Env }>();

app.use('/api/*', cors());

/** Usuario que realiza el cambio (para la bitácora). Lo envía el frontend en X-Usuario-Id. */
const userIdOf = (h: string | undefined) => {
  const n = Number(h);
  return Number.isInteger(n) && n > 0 ? n : null;
};

app.get('/api/health', async (c) => {
  const started = Date.now();
  const row = await c.env.DB.prepare(
    "SELECT COUNT(*) AS tablas FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'",
  ).first<{ tablas: number }>();
  return c.json({ status: 'ok', database: 'D1', tablas: row?.tablas ?? 0, esperadas: TABLES.length, latencia_ms: Date.now() - started });
});

app.get('/api/stats', async (c) => c.json(await getStats(c.env.DB)));

app.get('/api/meta', (c) => {
  const pub: PublicTableMeta[] = TABLES.map(({ label: _label, ...rest }) => rest);
  return c.json(pub);
});

app.get('/api/:tabla', async (c) => {
  const t = getTable(c.req.param('tabla'));
  return c.json(await list(c.env.DB, t, new URL(c.req.url).searchParams));
});

app.get('/api/:tabla/options', async (c) => {
  const t = getTable(c.req.param('tabla'));
  return c.json(await options(c.env.DB, t, c.req.query('q') ?? null));
});

app.get('/api/:tabla/:id', async (c) => {
  const t = getTable(c.req.param('tabla'));
  return c.json(await getOne(c.env.DB, t, parseId(t, c.req.param('id'))));
});

app.post('/api/:tabla', async (c) => {
  const t = getTable(c.req.param('tabla'));
  const body = await c.req.json<Row>().catch(() => {
    throw new HttpError(400, 'El cuerpo debe ser JSON.');
  });
  return c.json(await create(c.env.DB, t, body, userIdOf(c.req.header('X-Usuario-Id'))), 201);
});

app.put('/api/:tabla/:id', async (c) => {
  const t = getTable(c.req.param('tabla'));
  const body = await c.req.json<Row>().catch(() => {
    throw new HttpError(400, 'El cuerpo debe ser JSON.');
  });
  return c.json(await update(c.env.DB, t, parseId(t, c.req.param('id')), body, userIdOf(c.req.header('X-Usuario-Id'))));
});

app.delete('/api/:tabla/:id', async (c) => {
  const t = getTable(c.req.param('tabla'));
  await remove(c.env.DB, t, parseId(t, c.req.param('id')), userIdOf(c.req.header('X-Usuario-Id')));
  return c.json({ ok: true });
});

app.all('/api/*', (c) => c.json({ error: 'Ruta no encontrada' }, 404));

// Cualquier otra ruta la resuelven los assets estáticos (SPA).
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw));

app.onError((err, c) => {
  if (err instanceof HttpError) return c.json({ error: err.message }, err.status);
  console.error(err);
  return c.json({ error: 'Error interno del servidor.' }, 500);
});

export default app;
