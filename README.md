# Funeraria · Gestión integral

Aplicación web para administrar una funeraria: afiliados y pólizas exequiales (individuales o colectivas, hasta 7 beneficiarios), reporte de fallecimientos con su documentación legal (certificado, necropsia, restricción de cremación, registro civil), servicios y recursos asignados (personal, carrozas, buses, salas, cementerios), inventario de cofres, urnas, elementos prestables e insumos, compras a proveedores, facturación (lo que cubre la póliza y lo que paga el cliente) y bitácora de auditoría.

**Tecnología:** un solo Cloudflare Worker con API REST en TypeScript ([Hono](https://hono.dev)) sobre **Cloudflare D1** (SQLite). El frontend en React + Vite + Tailwind CSS se sirve desde el mismo Worker.

## Inicio rápido (local)

```bash
npm install
npm run db:local     # crea la base local y carga los datos de prueba
npm run dev          # http://localhost:8787
```

Usuarios de prueba (clave `Funeraria2026!`): `lvelez` (Administrador), `shernandez` (Asesor) y `rlopez` (Facturación). En la cabecera eliges el usuario que firma los cambios en la bitácora.

## Despliegue

Los pasos detallados para crear la base D1, configurar el `database_id`, cargar los datos y desplegar están en **[AGENTS.md](./AGENTS.md)**, sección 3. En resumen:

```bash
npx wrangler login
npx wrangler d1 create funeraria-db
npm run db:configure   # escribe el database_id en wrangler.toml
npm run db:remote      # esquema + datos de prueba en producción
npm run deploy
```

## Estructura

```
db/        schema.sql (63 tablas, reglas en triggers) y seed.sql
src/       Worker: API Hono, CRUD genérico, métricas, metadatos del modelo
web/       Frontend React (dashboard + pantallas CRUD por entidad)
scripts/   configurar-d1.mjs (database_id en wrangler.toml)
tools/     generador del esquema y metadatos a partir del modelo
```

## Scripts

| Script | Acción |
|---|---|
| `npm run dev` | Compila y levanta el Worker local con D1 local |
| `npm run dev:web` | Frontend con recarga en caliente (usar junto con `wrangler dev`) |
| `npm run build` | Verificación de tipos y compilación del frontend en `dist/` |
| `npm run db:local` / `db:remote` | Crea el esquema y carga los datos (local / producción). **Borra los datos existentes.** |
| `npm run db:configure` | Escribe el `database_id` real en `wrangler.toml` |
| `npm run gen:model` | Regenera `db/schema.sql` y `src/meta.ts` desde `tools/generar_modelo.py` |
| `npm run deploy` | Compila y despliega en Cloudflare |
