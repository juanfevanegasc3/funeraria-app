# Sistema de Gestión Funeraria

Plataforma web para la operación integral de una funeraria: administra el ciclo completo que va desde la
afiliación de un titular y su póliza exequial hasta la prestación del servicio por fallecimiento, la
documentación legal, el consumo de inventario y la facturación al cliente.

El sistema está construido como una **aplicación única**: un Cloudflare Worker en TypeScript expone una API
REST (Hono) sobre **Cloudflare D1** (SQLite) y sirve, desde el mismo origen, el frontend en React.

---

## Funcionalidades

### Afiliación y pólizas exequiales
- Registro de **personas** y **titulares** con tipo y número de documento.
- Gestión de **planes exequiales**, sus coberturas y las tarifas por región de atención.
- Emisión de **pólizas** individuales o colectivas, con estado, periodicidad de cobro y vigencia.
- Hasta **7 beneficiarios** por póliza, con parentesco y validación de que el titular no sea su propio beneficiario.
- Control de **años de cobro** y **pagos de prima** por póliza y método de pago.

### Eventos de fallecimiento y documentación legal
- Reporte del **evento de fallecimiento** con fallecido, reportante y región de atención.
- Asociación del evento a una póliza cuando el servicio está cubierto; en caso contrario se marca como
  **servicio particular**.
- Registro y seguimiento de la documentación legal: **certificado de defunción**, **acta de necropsia**,
  **restricción de cremación** y **registro civil de defunción**, con instituciones emisoras, médicos y
  oficinas de registro involucradas.

### Servicios y recursos
- Catálogo de **servicios funerarios** por categoría y religión, con tarifas por región.
- Programación de **servicios prestados** por evento, con estado y sede/instalación asignada.
- Asignación de **empleados** (con su responsabilidad) y **vehículos** (carrozas, buses, etc.) a cada servicio.
- Administración de **sedes**, **instalaciones** y personal por cargo.

### Inventario, compras y préstamos
- Inventario de **artículos** (cofres, urnas, elementos prestables e insumos) por categoría y material.
- **Compras a proveedores** con detalle por artículo; cada compra suma existencias y recalcula su valor total.
- **Entregas por evento** con dos modalidades: consumo definitivo o **préstamo** con estado de devolución.
- Validación de stock y reposición automática al registrar devoluciones de préstamos.

### Facturación
- **Facturas** por evento con detalle de servicios prestados y artículos entregados.
- Cálculo automático del valor total, lo **cubierto por la póliza** y lo **a cargo del cliente**.
- Registro de **pagos** y cambio automático de estado a *Pagada* cuando se cubre el saldo del cliente.

### Auditoría y seguridad
- **Bitácora de auditoría** con el antes y después (JSON) de cada operación sobre las entidades sensibles.
- Usuarios, roles, permisos y operaciones tipificadas como catálogos del modelo.
- Panel general con indicadores: pólizas por estado, eventos por mes, servicios más solicitados, stock bajo,
  recaudación y actividad reciente.

---

## Diseño de datos

El corazón del sistema es un **modelo relacional normalizado de 63 tablas** (36 de negocio y 27 catálogos)
definido en `db/schema.sql`. El modelo es la fuente de verdad: los metadatos que consume la API y el frontend
(`src/meta.ts`) se **generan** a partir de él, por lo que las pantallas CRUD y los endpoints existen
automáticamente para cada tabla.

### Principios del modelo

| Principio | Implementación |
|---|---|
| **Herencia de personas** | `persona` es el supertipo; `titular` y `beneficiario` son subtipos cuya PK (`id_persona`) es a la vez FK a `persona` con `ON DELETE CASCADE`. |
| **Catálogos en tablas, no texto libre** | Todo estado, tipo o clasificación vive en una tabla estática (`estado_poliza`, `tipo_muerte`, `cargo`, …) con `nombre` único y, cuando el requisito lo exige, `CHECK` sobre los valores válidos. |
| **Integridad declarativa** | Claves foráneas con `ON DELETE` explícito, restricciones `CHECK` y `UNIQUE`, e índices automáticos sobre cada FK. |
| **Reglas de negocio en la base** | 25 *triggers* garantizan consistencia incluso ante escrituras directas (ver abajo). |
| **Auditoría por triggers de aplicación** | Las tablas auditadas registran en `bitacora_auditoria` el estado anterior y posterior de cada alta, modificación o baja. |
| **Convenciones** | `snake_case` en español y singular; PK `id_<tabla>`; booleanos `es_*`/`esta_*` (0/1); fechas `TEXT` ISO; dinero `REAL`. |

### Módulos del dominio

| Módulo | Tablas principales | Propósito |
|---|---|---|
| **Afiliación** | `persona`, `titular`, `plan_exequial`, `poliza`, `beneficiario`, `anio_cobro_poliza`, `pago_prima`, `cobertura_plan` | Titulares, planes y pólizas con sus beneficiarios y recaudo de primas. |
| **Eventos y documentos** | `evento_fallecimiento`, `certificado_defuncion`, `acta_necropsia`, `restriccion_cremacion`, `registro_civil_defuncion`, `medico`, `institucion_emisora`, `oficina_registro_civil` | Reporte del fallecimiento y su soporte legal. |
| **Servicios y recursos** | `servicio_funerario`, `tarifa_servicio_region`, `servicio_prestado`, `asignacion_empleado`, `asignacion_vehiculo`, `sede`, `instalacion`, `empleado`, `vehiculo` | Prestación del servicio y asignación de personal, sedes y flota. |
| **Inventario y compras** | `articulo`, `articulo_entregado`, `proveedor`, `compra`, `detalle_compra` | Existencias, abastecimiento, entregas y préstamos. |
| **Facturación** | `factura`, `detalle_factura`, `pago_factura` | Liquidación del servicio y pagos del cliente. |
| **Seguridad** | `usuario`, `rol`, `permiso`, `rol_permiso`, `bitacora_auditoria` | Identidad operativa, permisos y trazabilidad. |

**Catálogos (27):** `tipo_documento`, `parentesco`, `tipo_poliza`, `estado_poliza`, `periodicidad_cobro`,
`metodo_pago`, `tipo_muerte`, `tipo_institucion`, `motivo_restriccion`, `tipo_oficina`, `categoria_servicio`,
`religion`, `region_atencion`, `estado_servicio`, `responsabilidad`, `cargo`, `tipo_vehiculo`,
`tipo_instalacion`, `tipo_sede`, `categoria_articulo`, `material`, `modalidad_entrega`, `estado_devolucion`,
`estado_factura`, `rol`, `permiso`, `tipo_operacion`.

### Reglas de negocio garantizadas en la base

| Regla | Efecto |
|---|---|
| Tope de beneficiarios | Una póliza admite como máximo **7 beneficiarios**. |
| Titular ≠ beneficiario | El titular no puede figurar como beneficiario de su propia póliza. |
| Evento con póliza | Solo se vincula una póliza **activa**, vigente en la fecha del fallecimiento, y el fallecido debe ser su titular o beneficiario. |
| Evento sin póliza | Se registra como **servicio particular** (`es_servicio_particular = 1`). |
| Servicio cubierto | Un servicio solo puede marcarse como cubierto si el evento tiene póliza. |
| Cremación | Se bloquea si existe una restricción de cremación sin autorización judicial. |
| Inventario | Las compras suman existencias, las entregas las restan validando stock y las devoluciones de préstamos las reponen. |
| Facturación | Los totales se recalculan desde el detalle; la factura pasa a **Pagada** al cubrirse el saldo del cliente y **Anulada** no admite pagos. |

### Trazabilidad

Cinco entidades están auditadas (`poliza`, `evento_fallecimiento`, `factura`, `detalle_factura` y
`pago_factura`). Cada operación registra usuario, tipo de operación, fecha y el par **antes/después** en
`bitacora_auditoria`, lo que permite reconstruir la historia de los cambios.

---

## API

La API es genérica y dirigida por metadatos: cualquier tabla del modelo queda expuesta automáticamente.

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado de la conexión y conteo de tablas esperadas. |
| `GET` | `/api/stats` | Indicadores del panel general. |
| `GET` | `/api/meta` | Metadatos del modelo (columnas, tipos, FKs, etiquetas). |
| `GET` | `/api/:tabla` | Listado con `JOIN` a las FKs, búsqueda (`q`), filtros, orden y paginación. |
| `GET` | `/api/:tabla/options` | Opciones `{value,label}` para los selectores de FK. |
| `GET` | `/api/:tabla/:id` | Detalle de un registro (PK compuesta separada por `~`). |
| `POST` | `/api/:tabla` | Crear registro. |
| `PUT` | `/api/:tabla/:id` | Actualización parcial (no modifica PK ni columnas calculadas). |
| `DELETE` | `/api/:tabla/:id` | Eliminar registro. |

Los errores de negocio se traducen a HTTP 400/409 con un mensaje en español. La cabecera opcional
`X-Usuario-Id` identifica al usuario que firma la operación en la bitácora.

### Diseño de la capa de acceso
- **Identificadores** de tabla/columna se validan contra una lista blanca (`TABLE_MAP`); los valores siempre
  viajan con parámetros enlazados (`.bind()`), nunca concatenados.
- **Escrituras con auditoría** se ejecutan en lote transaccional (`db.batch`), de modo que el registro y su
  entrada de bitácora se confirman o revierten juntos.

---

## Estructura del proyecto

```
db/            schema.sql (63 tablas, CHECK, FK, índices y 25 triggers) y seed.sql
src/           Worker: rutas Hono, CRUD genérico, métricas, metadatos y manejo de errores
web/           Frontend React (panel general y vistas CRUD generadas por entidad)
scripts/       Utilidad de configuración de la base D1
tools/         Generador del esquema y de los metadatos a partir del modelo
```

| Componente | Tecnología |
|---|---|
| Backend | Cloudflare Workers · Hono · TypeScript |
| Base de datos | Cloudflare D1 (SQLite) |
| Frontend | React 19 · Vite · Tailwind CSS v4 |
| Modelo | Generado desde `tools/generar_modelo.py` + `tools/triggers.sql` |

---

## Puesta en marcha local

Requiere **Node.js ≥ 20**. La base local se crea en `.wrangler/` y se carga con datos de demostración.

```bash
npm install
npm run db:local    # esquema + datos de ejemplo
npm run dev         # http://localhost:8787
```

Usuarios de demostración (clave `Funeraria2026!`): `lvelez` (Administrador), `shernandez` (Asesor) y
`rlopez` (Facturación). El usuario activo se elige en la cabecera y queda registrado en la auditoría.

| Script | Acción |
|---|---|
| `npm run dev` | Compila y levanta la aplicación local con D1 local. |
| `npm run dev:web` | Frontend con recarga en caliente (junto a `wrangler dev`). |
| `npm run build` | Verificación de tipos y compilación del frontend. |
| `npm run db:local` | Recrea la base local con el esquema y los datos de ejemplo. |
| `npm run gen:model` | Regenera `db/schema.sql` y `src/meta.ts` (requiere Python 3). |

> `npm run db:local` parte de `db/schema.sql`, que elimina las tablas existentes antes de recrearlas: úsalo
> solo sobre la base local.

---

## Estado del proyecto

El modelo de datos, la API y la interfaz CRUD están completos. La identificación de usuario se resuelve por
selector en la cabecera; para un entorno productivo se recomienda añadir autenticación y protección de acceso.
