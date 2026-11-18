# AGENTS.md — Guía de ejecución para OpenCode

Proyecto: **Sistema de gestión funeraria** (pólizas exequiales, eventos de fallecimiento, documentos legales,
servicios, inventario, facturación y auditoría). Un **único Cloudflare Worker** sirve la API REST (Hono + D1)
y el frontend React compilado (assets estáticos).

> Este proyecto se generó en otra máquina. **Nada está desplegado todavía**: no hay base D1 creada ni
> `database_id` real. Tu trabajo en esta computadora es ejecutar el protocolo de la sección 3.

---

## 1. Arquitectura y mapa de archivos

```
navegador ──► Worker "funeraria-app"
                ├─ /api/*  → Hono (src/index.ts) ──► D1 (binding DB, base "funeraria-db")
                └─ resto   → assets estáticos ./dist (SPA React, fallback a index.html)
```

| Ruta | Propósito |
|---|---|
| `wrangler.toml` | Worker, `[assets]` (./dist, SPA, `run_worker_first = ["/api/*"]`) y binding D1 `DB`. Contiene el marcador `<REEMPLAZAR_CON_DATABASE_ID>`. |
| `package.json` | Scripts: `dev`, `dev:web`, `build`, `typecheck`, `db:local`, `db:remote`, `db:configure`, `gen:model`, `deploy`. |
| `tsconfig.json` | TypeScript del Worker (`src/`). `web/tsconfig.json` es el del frontend. |
| `db/schema.sql` | Esquema completo SQLite/D1: `PRAGMA foreign_keys = ON`, `DROP TABLE IF EXISTS` en orden inverso, 63 tablas, CHECK, FK con `ON DELETE`, índices y 25 triggers de reglas de negocio. **Es idempotente: re-ejecutarlo borra todos los datos.** |
| `db/seed.sql` | Datos de prueba coherentes (catálogos, 15 personas, 4 pólizas, 4 eventos, facturas, inventario, usuarios). |
| `src/index.ts` | Rutas Hono: `/api/health`, `/api/stats`, `/api/meta`, CRUD genérico `/api/:tabla`, manejo de errores y entrega de assets. |
| `src/crud.ts` | CRUD dirigido por metadatos: listados con `LEFT JOIN` a cada FK (`<fk>__label`), búsqueda, filtros, orden, paginación, auditoría en lote transaccional (`db.batch`). Solo identificadores de la lista blanca; valores siempre con `.bind()`. |
| `src/meta.ts` | **Generado.** Metadatos de las 63 tablas (columnas, tipos, PK, FK, etiquetas en español, expresión SQL de nombre legible). La API y el frontend se construyen a partir de él. |
| `src/stats.ts` | Consultas del dashboard (`/api/stats`). |
| `src/errors.ts` | Traduce errores de SQLite (UNIQUE, FK, CHECK, NOT NULL, `RAISE` de triggers) a HTTP 400/409 con mensaje en español. |
| `src/types.ts`, `src/env.ts` | Tipos compartidos con el frontend / bindings del Worker. |
| `web/` | Frontend React 19 + Vite + Tailwind CSS v4 (español). `web/vite.config.ts` compila a `../dist`. |
| `web/src/App.tsx` | Layout, enrutado por hash (`#/` dashboard, `#/t/<tabla>` CRUD), indicador de salud. |
| `web/src/components/Dashboard.tsx` | KPIs y paneles de métricas. |
| `web/src/components/EntityView.tsx` | Vista CRUD genérica: tabla, búsqueda, filtros por FK, orden, paginación, eliminar con confirmación. |
| `web/src/components/EntityForm.tsx`, `FieldInput.tsx` | Formulario crear/editar con `<select>` dinámicos para FK (`/api/<tabla>/options`). |
| `web/src/api.ts` | Cliente HTTP; envía `X-Usuario-Id` (usuario elegido en la cabecera) para la bitácora. |
| `scripts/configurar-d1.mjs` | Escribe el `database_id` real en `wrangler.toml` (desde `wrangler d1 list --json` o argumento). |
| `tools/generar_modelo.py`, `tools/triggers.sql` | Fuente del modelo: regenera `db/schema.sql` y `src/meta.ts` (`npm run gen:model`, requiere Python 3). |

## 2. Esquema D1 y endpoints de la API

- **Binding:** `DB` → base `funeraria-db` (ver `[[d1_databases]]` en `wrangler.toml`).
- **Assets:** binding `ASSETS`, directorio `./dist`.
- 63 tablas = 36 de negocio + 27 **tablas estáticas** (catálogos con valores precargados).
- **Herencia:** `persona` es el supertipo; `titular` y `beneficiario` son subtipos (su PK `id_persona` es FK a `persona`, `ON DELETE CASCADE`).
- Tablas auditadas (cada POST/PUT/DELETE inserta en `bitacora_auditoria` con JSON antes/después): `poliza`, `evento_fallecimiento`, `factura`, `detalle_factura`, `pago_factura`.

### Reglas de negocio en triggers (`db/schema.sql`)
- Máximo **7 beneficiarios** por póliza; el titular no puede ser beneficiario de su propia póliza.
- Un evento con póliza exige póliza **Activa**, vigente en la fecha del fallecimiento y que el fallecido sea su titular o beneficiario. Sin póliza ⇒ `es_servicio_particular = 1` (CHECK).
- Servicio marcado como cubierto solo si el evento tiene póliza. **Cremación** bloqueada si hay restricción sin autorización judicial.
- Inventario: compras suman existencias y recalculan `compra.valor_total`; entregas restan (con validación de stock); devoluciones de **préstamos** reponen.
- Factura: totales (`valor_total`, `valor_cubierto_poliza`, `valor_a_cargo_cliente`) se recalculan desde `detalle_factura`; estado pasa a **Pagada** cuando los pagos cubren lo que paga el cliente (o si el cliente paga 0); **Anulada** no admite pagos.

### Tablas por módulo

**Afiliación**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `persona` | id_persona | `id_tipo_documento`→tipo_documento |
| `titular` | id_persona | `id_persona`→persona |
| `plan_exequial` | id_plan_exequial | — |
| `poliza` (auditada) | id_poliza | `id_persona_titular`→titular, `id_plan_exequial`→plan_exequial, `id_tipo_poliza`→tipo_poliza, `id_estado_poliza`→estado_poliza, `id_periodicidad_cobro`→periodicidad_cobro |
| `beneficiario` | id_persona | `id_persona`→persona, `id_poliza`→poliza, `id_parentesco`→parentesco |
| `anio_cobro_poliza` | id_anio_cobro | `id_poliza`→poliza |
| `pago_prima` | id_pago_prima | `id_poliza`→poliza, `id_metodo_pago`→metodo_pago |
| `cobertura_plan` | id_cobertura_plan | `id_plan_exequial`→plan_exequial, `id_servicio_funerario`→servicio_funerario |

**Eventos y documentos**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `evento_fallecimiento` (auditada) | id_evento | `id_persona_fallecida`→persona, `id_poliza`→poliza, `id_persona_reportante`→persona, `id_parentesco_reportante`→parentesco, `id_region_atencion`→region_atencion |
| `institucion_emisora` | id_institucion | `id_tipo_institucion`→tipo_institucion |
| `medico` | id_medico | `id_institucion`→institucion_emisora |
| `certificado_defuncion` | id_certificado | `id_evento`→evento_fallecimiento, `id_medico`→medico, `id_institucion`→institucion_emisora, `id_tipo_muerte`→tipo_muerte |
| `acta_necropsia` | id_acta_necropsia | `id_evento`→evento_fallecimiento, `id_institucion`→institucion_emisora |
| `restriccion_cremacion` | id_restriccion | `id_evento`→evento_fallecimiento, `id_motivo_restriccion`→motivo_restriccion |
| `oficina_registro_civil` | id_oficina_registro | `id_tipo_oficina`→tipo_oficina |
| `registro_civil_defuncion` | id_registro_civil | `id_evento`→evento_fallecimiento, `id_oficina_registro`→oficina_registro_civil, `id_empleado_gestor`→empleado |

**Servicios y recursos**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `servicio_funerario` | id_servicio_funerario | `id_categoria_servicio`→categoria_servicio, `id_religion`→religion |
| `tarifa_servicio_region` | id_tarifa | `id_servicio_funerario`→servicio_funerario, `id_region_atencion`→region_atencion |
| `sede` | id_sede | `id_tipo_sede`→tipo_sede |
| `empleado` | id_empleado | `id_sede`→sede, `id_cargo`→cargo |
| `instalacion` | id_instalacion | `id_sede`→sede, `id_tipo_instalacion`→tipo_instalacion |
| `servicio_prestado` | id_servicio_prestado | `id_evento`→evento_fallecimiento, `id_servicio_funerario`→servicio_funerario, `id_instalacion`→instalacion, `id_estado_servicio`→estado_servicio |
| `asignacion_empleado` | id_asignacion_empleado | `id_servicio_prestado`→servicio_prestado, `id_empleado`→empleado, `id_responsabilidad`→responsabilidad |
| `vehiculo` | id_vehiculo | `id_tipo_vehiculo`→tipo_vehiculo |
| `asignacion_vehiculo` | id_asignacion_vehiculo | `id_servicio_prestado`→servicio_prestado, `id_vehiculo`→vehiculo |

**Inventario y compras**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `articulo` | id_articulo | `id_categoria_articulo`→categoria_articulo, `id_material`→material |
| `articulo_entregado` | id_articulo_entregado | `id_evento`→evento_fallecimiento, `id_articulo`→articulo, `id_modalidad_entrega`→modalidad_entrega, `id_estado_devolucion`→estado_devolucion |
| `proveedor` | id_proveedor | — |
| `compra` | id_compra | `id_proveedor`→proveedor |
| `detalle_compra` | id_detalle_compra | `id_compra`→compra, `id_articulo`→articulo |

**Facturación**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `factura` (auditada) | id_factura | `id_evento`→evento_fallecimiento, `id_estado_factura`→estado_factura |
| `detalle_factura` (auditada) | id_detalle_factura | `id_factura`→factura, `id_servicio_prestado`→servicio_prestado, `id_articulo_entregado`→articulo_entregado |
| `pago_factura` (auditada) | id_pago_factura | `id_factura`→factura, `id_metodo_pago`→metodo_pago |

**Seguridad**

| Tabla | PK | Llaves foráneas → tabla |
|---|---|---|
| `usuario` | id_usuario | `id_rol`→rol, `id_empleado`→empleado |
| `rol_permiso` | id_rol, id_permiso | `id_rol`→rol, `id_permiso`→permiso |
| `bitacora_auditoria` | id_bitacora | `id_usuario`→usuario, `id_tipo_operacion`→tipo_operacion |

**Catálogos / tablas estáticas (27)** — todas con `id_<tabla>` + `nombre` UNIQUE: `tipo_documento`, `parentesco`, `tipo_poliza`, `estado_poliza`, `periodicidad_cobro`, `metodo_pago`, `tipo_muerte`, `tipo_institucion`, `motivo_restriccion`, `tipo_oficina`, `categoria_servicio`, `religion`, `region_atencion`, `estado_servicio`, `responsabilidad`, `cargo`, `tipo_vehiculo`, `tipo_instalacion`, `tipo_sede`, `categoria_articulo`, `material`, `modalidad_entrega`, `estado_devolucion`, `estado_factura`, `rol`, `permiso`, `tipo_operacion`.

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Prueba de conexión a D1. Respuesta: `{"status":"ok","database":"D1","tablas":63,"esperadas":63,"latencia_ms":n}` |
| GET | `/api/stats` | Métricas del dashboard (KPIs, pólizas por estado, eventos por mes, top servicios, stock bajo, facturación, actividad). |
| GET | `/api/meta` | Metadatos de todas las tablas (lo usa el frontend para construir formularios). |
| GET | `/api/<tabla>` | Listado con JOIN a FKs. Query: `q` (texto), `<columna>=<valor>` (filtro exacto), `sort`, `dir=asc\|desc`, `limit` (≤200, def. 50), `offset`. Respuesta `{data,total,limit,offset}`; cada fila trae `__label` y `<fk>__label`. |
| GET | `/api/<tabla>/options` | `[{value,label}]` para `<select>` (opcional `q`). |
| GET | `/api/<tabla>/<id>` | Un registro. PK compuesta (`rol_permiso`): `<id_rol>~<id_permiso>`. |
| POST | `/api/<tabla>` | Crear (JSON). 201 + registro con etiquetas. |
| PUT | `/api/<tabla>/<id>` | Actualizar parcial (no cambia PK ni columnas calculadas). |
| DELETE | `/api/<tabla>/<id>` | Eliminar. |

`<tabla>` es cualquier nombre de tabla de la lista anterior. Cabecera opcional `X-Usuario-Id: <id_usuario>` para la bitácora.
Errores: `{"error": "mensaje en español"}` con 400 (validación/regla de negocio), 404, 409 (UNIQUE/FK).

---

## 3. Protocolo de configuración y despliegue en destino (paso a paso)

Ejecuta los pasos **en orden**, desde la raíz del proyecto. Detente y reporta al usuario si un paso falla.
Requisitos: Node.js ≥ 20 y una cuenta de Cloudflare.

**Paso 1 — Instalar y validar compilación**
```bash
npm install
npm run build          # typecheck del Worker y del frontend + vite build → ./dist
```
Éxito: termina sin errores y existe `dist/index.html`.

**Paso 2 — Verificar sesión de Cloudflare**
```bash
npx wrangler whoami
```
Si indica que no hay sesión, ejecuta `npx wrangler login` (abre el navegador; **pide al usuario** que autorice) y repite `whoami`.
Si la cuenta tiene varias organizaciones, pregunta al usuario cuál usar y exporta `CLOUDFLARE_ACCOUNT_ID=<id>`.

**Paso 3 — Crear la base D1 y escribir su `database_id`**
```bash
npx wrangler d1 create funeraria-db
```
- La salida muestra un bloque con `database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`. **No** aceptes añadir un bloque nuevo a la configuración si wrangler lo ofrece (el bloque ya existe con binding `DB`).
- Si la base ya existe (error "already exists"), continúa: el script la encuentra igual.

Reemplaza el marcador automáticamente (lee el id con `wrangler d1 list --json`):
```bash
npm run db:configure
# alternativa con el id copiado de la consola:
node scripts/configurar-d1.mjs <database_id>
```
Verifica: `wrangler.toml` debe contener `database_id = "<uuid real>"` y **ya no** `database_id = "<REEMPLAZAR_CON_DATABASE_ID>"`. Debe haber un solo bloque `[[d1_databases]]` con `binding = "DB"`.

**Paso 4 — Inicializar y poblar la base de producción**
```bash
npx wrangler d1 execute funeraria-db --remote --yes --file=./db/schema.sql
npx wrangler d1 execute funeraria-db --remote --yes --file=./db/seed.sql
# equivalente: npm run db:remote
```
Verifica:
```bash
npx wrangler d1 execute funeraria-db --remote --command "SELECT COUNT(*) AS tablas FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'"
```
Debe devolver **63**. ⚠️ `schema.sql` empieza con `DROP TABLE IF EXISTS`: **no lo re-ejecutes en una base con datos reales** sin confirmación explícita del usuario.

**Paso 5 — Desplegar y validar**
```bash
npm run deploy         # build + wrangler deploy
```
Toma la URL `https://funeraria-app.<subdominio>.workers.dev` que imprime wrangler y valida:
```bash
curl -s https://funeraria-app.<subdominio>.workers.dev/api/health
# esperado: {"status":"ok","database":"D1","tablas":63,"esperadas":63,...}
curl -s "https://funeraria-app.<subdominio>.workers.dev/api/poliza?limit=1"
```
Abre la URL raíz en el navegador: debe verse el Panel general con datos. Reporta la URL al usuario.

**Desarrollo local (opcional, sin cuenta):**
```bash
npm run db:local       # crea y llena la base local en .wrangler/
npm run dev            # build + wrangler dev → http://localhost:8787
# frontend con recarga en caliente: en otra terminal `npm run dev:web` (http://localhost:5173, proxifica /api a :8787)
```

**Problemas frecuentes**
| Síntoma | Causa / solución |
|---|---|
| `/api/health` responde 500 o "no such table" | Falta el Paso 4 o se ejecutó contra otra base. Revisa `database_id`. |
| `tablas` < 63 | `schema.sql` se interrumpió; vuelve a ejecutarlo (base nueva). |
| La raíz devuelve 404 | No existe `./dist`: ejecuta `npm run build` antes de `wrangler deploy`. |
| `Authentication error` / `10000` | Sesión vencida: `npx wrangler login`. |
| Error de `compatibility_date` futura | Usa una fecha que soporte la versión instalada de wrangler. |

---

## 4. Reglas de extensión

1. **El modelo es la fuente de verdad.** Para agregar o cambiar tablas, edita `tools/generar_modelo.py` (y `tools/triggers.sql` para reglas) y ejecuta `npm run gen:model`. Esto regenera `db/schema.sql` y `src/meta.ts`. No edites esos dos archivos a mano salvo que abandones el generador (entonces mantenlos sincronizados).
2. **Convenciones de nombres:** tablas y columnas en `snake_case` español, singular (`servicio_prestado`). PK `id_<tabla>` `INTEGER PRIMARY KEY AUTOINCREMENT`. FK con el nombre de la PK referenciada, o con sufijo de rol si hay varias (`id_persona_fallecida`, `id_persona_reportante`). Booleanos `es_*` / `esta_*` (INTEGER 0/1 con CHECK). Fechas `TEXT` ISO (`AAAA-MM-DD`, `AAAA-MM-DD HH:MM:SS`, `HH:MM`). Dinero `REAL` en pesos colombianos.
3. **Estados y tipos van en tablas estáticas** (`catalog(...)` en el generador), nunca como texto libre. Si el conjunto de valores lo fija un requisito, pásalo en `values=[...]` para que se genere el `CHECK`.
4. **Cada FK** necesita `ON DELETE` explícito (RESTRICT por defecto; CASCADE para detalles que pertenecen al padre; SET NULL solo si la columna es opcional y ningún CHECK lo impide) y recibe índice automático.
5. **Nueva tabla = API y UI automáticas.** Al estar en `src/meta.ts` aparece en `/api/<tabla>`, en `/api/meta` y en el menú (agrupada por `module`). Define `label` (expresión SQL con `{a}` como alias) para que las FK hacia ella muestren un nombre legible.
6. **Seguridad SQL:** nunca concatenes valores del usuario; usa `.bind()`. Los identificadores solo pueden venir de `TABLE_MAP`.
7. **Endpoints a medida** (reportes, procesos): créalos en un archivo nuevo de `src/` y regístralos en `src/index.ts` **antes** de las rutas genéricas `/api/:tabla`.
8. **Vistas de frontend a medida:** crea un componente en `web/src/components/` y enrútalo en `App.tsx` con un hash propio (p. ej. `#/r/<reporte>`); reutiliza `api.ts` y las utilidades `input`, `btn-*`, `card` de `index.css`.
9. **Auditoría:** para auditar otra tabla pasa `audit=True` en el generador (debe tener PK entera simple).
10. **Cambios de esquema en producción:** no re-ejecutes `schema.sql` sobre datos reales. Escribe un script incremental (`ALTER TABLE` / tabla nueva) en `db/migraciones/AAAAMMDD_descripcion.sql` y aplícalo con `npx wrangler d1 execute funeraria-db --remote --file=<archivo>`.
11. Antes de desplegar: `npm run build` sin errores y prueba local con `npm run db:local && npm run dev`.
12. **Pendiente conocido:** el sistema identifica al usuario con un selector en la cabecera (`X-Usuario-Id`), sin inicio de sesión. Para producción real, protege el Worker con **Cloudflare Access** o implementa login (la tabla `usuario` guarda `clave_hash` SHA-256 y `rol_permiso` define los permisos).
