# Especificación física del modelo funeraria -> genera db/schema.sql y src/meta.ts
import json, re, sys, os

TABLES = []          # en orden de dependencias
BY = {}

def C(name, type='text', req=True, fk=None, on_delete='RESTRICT', unique=False, check=None, default=None, pk=False, auto=False, search=None):
    return dict(name=name, type=type, required=req, fk=fk, on_delete=on_delete, unique=unique, check=check,
                default=default, pk=pk, auto=auto, search=search if search is not None else (type == 'text' and not fk))

def table(name, title, module, cols, label, uniques=(), checks=(), static=False, audit=False, pk=None, desc=''):
    pkc = pk or [c['name'] for c in cols if c['pk']]
    t = dict(name=name, title=title, module=module, columns=cols, label=label, uniques=list(uniques), checks=list(checks),
             static=static, audit=audit, pk=pkc, description=desc)
    TABLES.append(t); BY[name] = t

def ID(n): return C(n, 'integer', pk=True, auto=True, req=False)
def FK(n, tbl, req=True, on_delete=None):
    return C(n, 'integer', req=req, fk=tbl, on_delete=on_delete or ('RESTRICT' if req else 'SET NULL'))

# ---------------- Catálogos (tablas estáticas) ----------------
def catalog(name, title, values=None, extra=(), desc=''):
    cols = [ID('id_' + name), C('nombre', unique=True,
            check=("nombre IN (%s)" % ', '.join("'%s'" % v for v in values)) if values else None)] + list(extra)
    table(name, title, 'Catálogos', cols, '{a}.nombre', static=True, desc=desc)

catalog('tipo_documento', 'Tipos de documento', extra=[C('sigla', unique=True)])
catalog('parentesco', 'Parentescos')
catalog('tipo_poliza', 'Tipos de póliza', ['Individual', 'Colectiva'])
catalog('estado_poliza', 'Estados de póliza', ['Activa', 'Vencida', 'Suspendida', 'Cancelada'])
catalog('periodicidad_cobro', 'Periodicidades de cobro', extra=[C('meses_por_ciclo', 'integer', check='meses_por_ciclo > 0')])
catalog('metodo_pago', 'Métodos de pago')
catalog('tipo_muerte', 'Tipos de muerte', ['Natural', 'Violenta', 'En estudio'])
catalog('tipo_institucion', 'Tipos de institución')
catalog('motivo_restriccion', 'Motivos de restricción de cremación')
catalog('tipo_oficina', 'Tipos de oficina de registro', ['Notaría', 'Registraduría'])
catalog('categoria_servicio', 'Categorías de servicio', ['Básico', 'Complementario'])
catalog('religion', 'Religiones')
catalog('region_atencion', 'Regiones de atención', extra=[C('departamento')])
catalog('estado_servicio', 'Estados de servicio', ['Programado', 'En curso', 'Prestado', 'Cancelado'])
catalog('responsabilidad', 'Responsabilidades', extra=[C('descripcion', req=False)])
catalog('cargo', 'Cargos')
catalog('tipo_vehiculo', 'Tipos de vehículo')
catalog('tipo_instalacion', 'Tipos de instalación')
catalog('tipo_sede', 'Tipos de sede', ['Administrativa', 'Cementerio'])
catalog('categoria_articulo', 'Categorías de artículo')
catalog('material', 'Materiales')
catalog('modalidad_entrega', 'Modalidades de entrega', ['Venta', 'Préstamo', 'Consumo'])
catalog('estado_devolucion', 'Estados de devolución')
catalog('estado_factura', 'Estados de factura', ['Pendiente', 'Pagada', 'Anulada'])
catalog('rol', 'Roles', ['Administrador', 'Asesor', 'Facturación'])
catalog('permiso', 'Permisos', extra=[C('descripcion', req=False)])
catalog('tipo_operacion', 'Tipos de operación', ['Inserción', 'Actualización', 'Eliminación'])

PERSONA_NAME = "(SELECT p.nombres || ' ' || p.apellidos FROM persona p WHERE p.id_persona = {a}.id_persona)"

# ---------------- Afiliación ----------------
table('persona', 'Personas', 'Afiliación', [
    ID('id_persona'), FK('id_tipo_documento', 'tipo_documento'), C('numero_documento'), C('nombres'), C('apellidos'),
    C('fecha_nacimiento', 'date', req=False), C('telefono', req=False), C('direccion', req=False),
    C('correo_electronico', req=False, check="correo_electronico IS NULL OR correo_electronico LIKE '%_@_%._%'")],
    "{a}.nombres || ' ' || {a}.apellidos || ' (' || {a}.numero_documento || ')'",
    uniques=[('id_tipo_documento', 'numero_documento')],
    desc='Supertipo: datos personales comunes a titulares, beneficiarios, fallecidos y reportantes.')
table('titular', 'Titulares', 'Afiliación', [
    C('id_persona', 'integer', pk=True, fk='persona', on_delete='CASCADE'),
    C('fecha_afiliacion', 'date', default='CURRENT_DATE', req=False)], PERSONA_NAME,
    desc='Subtipo de PERSONA (herencia): quien contrata la póliza.')
table('plan_exequial', 'Planes exequiales', 'Afiliación', [
    ID('id_plan_exequial'), C('nombre_plan', unique=True), C('descripcion', req=False),
    C('valor_base_prima', 'real', check='valor_base_prima >= 0')], '{a}.nombre_plan')
table('poliza', 'Pólizas', 'Afiliación', [
    ID('id_poliza'), FK('id_persona_titular', 'titular'), FK('id_plan_exequial', 'plan_exequial'),
    FK('id_tipo_poliza', 'tipo_poliza'), FK('id_estado_poliza', 'estado_poliza'), FK('id_periodicidad_cobro', 'periodicidad_cobro'),
    C('numero_poliza', unique=True), C('fecha_inicio', 'date'), C('fecha_fin_vigencia', 'date'),
    C('valor_prima', 'real', check='valor_prima >= 0')], '{a}.numero_poliza',
    checks=['fecha_fin_vigencia >= fecha_inicio'], audit=True)
table('beneficiario', 'Beneficiarios', 'Afiliación', [
    C('id_persona', 'integer', pk=True, fk='persona', on_delete='CASCADE'), FK('id_poliza', 'poliza', on_delete='CASCADE'),
    FK('id_parentesco', 'parentesco'),
    C('tarifa_diferenciada', 'real', req=False, check='tarifa_diferenciada IS NULL OR tarifa_diferenciada >= 0'),
    C('fecha_inclusion', 'date', default='CURRENT_DATE', req=False)], PERSONA_NAME,
    desc='Subtipo de PERSONA (herencia). Máximo 7 por póliza (trigger).')
table('anio_cobro_poliza', 'Años de cobro', 'Afiliación', [
    ID('id_anio_cobro'), FK('id_poliza', 'poliza', on_delete='CASCADE'),
    C('anio', 'integer', check='anio BETWEEN 1900 AND 2200'), C('es_anio_cobrable', 'boolean', default='1', req=False)],
    "CAST({a}.anio AS TEXT)", uniques=[('id_poliza', 'anio')])
table('pago_prima', 'Pagos de prima', 'Afiliación', [
    ID('id_pago_prima'), FK('id_poliza', 'poliza'), FK('id_metodo_pago', 'metodo_pago'), C('fecha_pago', 'date'),
    C('valor_pagado', 'real', check='valor_pagado > 0'), C('periodo_cubierto')],
    "'Pago #' || {a}.id_pago_prima || ' · ' || {a}.fecha_pago")

# ---------------- Servicios (catálogo comercial) ----------------
table('servicio_funerario', 'Servicios funerarios', 'Servicios y recursos', [
    ID('id_servicio_funerario'), FK('id_categoria_servicio', 'categoria_servicio'), FK('id_religion', 'religion', req=False),
    C('nombre_servicio', unique=True), C('valor_base', 'real', check='valor_base >= 0')], '{a}.nombre_servicio')
table('cobertura_plan', 'Coberturas por plan', 'Afiliación', [
    ID('id_cobertura_plan'), FK('id_plan_exequial', 'plan_exequial', on_delete='CASCADE'),
    FK('id_servicio_funerario', 'servicio_funerario'),
    C('porcentaje_cobertura', 'real', check='porcentaje_cobertura BETWEEN 0 AND 100'),
    C('tope_valor_cubierto', 'real', req=False, check='tope_valor_cubierto IS NULL OR tope_valor_cubierto >= 0')],
    "'Cobertura #' || {a}.id_cobertura_plan", uniques=[('id_plan_exequial', 'id_servicio_funerario')])
table('tarifa_servicio_region', 'Tarifas por región', 'Servicios y recursos', [
    ID('id_tarifa'), FK('id_servicio_funerario', 'servicio_funerario', on_delete='CASCADE'),
    FK('id_region_atencion', 'region_atencion', on_delete='CASCADE'),
    C('valor_tarifa', 'real', check='valor_tarifa >= 0'), C('vigente_desde', 'date')],
    "'Tarifa #' || {a}.id_tarifa", uniques=[('id_servicio_funerario', 'id_region_atencion', 'vigente_desde')])

# ---------------- Evento ----------------
table('evento_fallecimiento', 'Eventos de fallecimiento', 'Eventos y documentos', [
    ID('id_evento'), FK('id_persona_fallecida', 'persona'), FK('id_poliza', 'poliza', req=False, on_delete='RESTRICT'),
    FK('id_persona_reportante', 'persona'), FK('id_parentesco_reportante', 'parentesco', req=False),
    FK('id_region_atencion', 'region_atencion'), C('fecha_fallecimiento', 'date'), C('hora_fallecimiento', 'time', req=False),
    C('lugar_fallecimiento'), C('causa_fallecimiento', req=False),
    C('es_servicio_particular', 'boolean', default='0', req=False),
    C('fecha_hora_reporte', 'datetime', default='CURRENT_TIMESTAMP', req=False)],
    "'EV-' || printf('%04d', {a}.id_evento) || ' · ' || (SELECT p.nombres || ' ' || p.apellidos FROM persona p WHERE p.id_persona = {a}.id_persona_fallecida)",
    uniques=[('id_persona_fallecida',)],
    checks=['(es_servicio_particular = 1 AND id_poliza IS NULL) OR (es_servicio_particular = 0 AND id_poliza IS NOT NULL)'],
    audit=True, desc='La póliza debe estar Activa y cubrir al fallecido (titular o beneficiario); validado por trigger.')
table('institucion_emisora', 'Instituciones emisoras', 'Eventos y documentos', [
    ID('id_institucion'), FK('id_tipo_institucion', 'tipo_institucion'), C('nombre_institucion'), C('nit', req=False, unique=True)],
    '{a}.nombre_institucion')
table('medico', 'Médicos', 'Eventos y documentos', [
    ID('id_medico'), FK('id_institucion', 'institucion_emisora', req=False), C('nombre_completo'), C('registro_medico', unique=True)],
    '{a}.nombre_completo')
table('certificado_defuncion', 'Certificados de defunción', 'Eventos y documentos', [
    ID('id_certificado'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'), FK('id_medico', 'medico'),
    FK('id_institucion', 'institucion_emisora'), FK('id_tipo_muerte', 'tipo_muerte'), C('numero_certificado', unique=True),
    C('fecha_defuncion', 'date'), C('hora_defuncion', 'time', req=False), C('lugar_defuncion'), C('causa_muerte')],
    '{a}.numero_certificado', uniques=[('id_evento',)])
table('acta_necropsia', 'Actas de necropsia', 'Eventos y documentos', [
    ID('id_acta_necropsia'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'), FK('id_institucion', 'institucion_emisora'),
    C('numero_acta', unique=True), C('fecha_expedicion', 'date')], '{a}.numero_acta', uniques=[('id_evento',)])
table('restriccion_cremacion', 'Restricciones de cremación', 'Eventos y documentos', [
    ID('id_restriccion'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'), FK('id_motivo_restriccion', 'motivo_restriccion'),
    C('numero_autorizacion_judicial', req=False), C('juzgado_autorizador', req=False), C('fecha_autorizacion', 'date', req=False)],
    "'Restricción #' || {a}.id_restriccion", uniques=[('id_evento',)],
    checks=['(numero_autorizacion_judicial IS NULL) = (fecha_autorizacion IS NULL)'],
    desc='Mientras no tenga autorización judicial, el evento no admite servicios de cremación (trigger).')
table('oficina_registro_civil', 'Oficinas de registro civil', 'Eventos y documentos', [
    ID('id_oficina_registro'), FK('id_tipo_oficina', 'tipo_oficina'), C('nombre_oficina'), C('ciudad')],
    "{a}.nombre_oficina || ' (' || {a}.ciudad || ')'")

# ---------------- Recursos ----------------
table('sede', 'Sedes', 'Servicios y recursos', [
    ID('id_sede'), FK('id_tipo_sede', 'tipo_sede'), C('nombre_sede', unique=True), C('direccion')], '{a}.nombre_sede')
table('empleado', 'Empleados', 'Servicios y recursos', [
    ID('id_empleado'), FK('id_sede', 'sede'), FK('id_cargo', 'cargo'), C('numero_documento', unique=True),
    C('nombres'), C('apellidos'), C('telefono', req=False)], "{a}.nombres || ' ' || {a}.apellidos")
table('registro_civil_defuncion', 'Registros civiles de defunción', 'Eventos y documentos', [
    ID('id_registro_civil'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'),
    FK('id_oficina_registro', 'oficina_registro_civil'), FK('id_empleado_gestor', 'empleado', req=False),
    C('numero_serial', unique=True), C('fecha_registro', 'date')], '{a}.numero_serial', uniques=[('id_evento',)])
table('instalacion', 'Instalaciones', 'Servicios y recursos', [
    ID('id_instalacion'), FK('id_sede', 'sede', on_delete='CASCADE'), FK('id_tipo_instalacion', 'tipo_instalacion'),
    C('nombre_instalacion'), C('capacidad_personas', 'integer', req=False, check='capacidad_personas IS NULL OR capacidad_personas > 0'),
    C('esta_disponible', 'boolean', default='1', req=False)], '{a}.nombre_instalacion')
table('servicio_prestado', 'Servicios prestados', 'Servicios y recursos', [
    ID('id_servicio_prestado'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'),
    FK('id_servicio_funerario', 'servicio_funerario'), FK('id_instalacion', 'instalacion', req=False),
    FK('id_estado_servicio', 'estado_servicio'), C('fecha_hora_prestacion', 'datetime'),
    C('es_cubierto_poliza', 'boolean', default='0', req=False), C('valor_aplicado', 'real', check='valor_aplicado >= 0')],
    "(SELECT s.nombre_servicio FROM servicio_funerario s WHERE s.id_servicio_funerario = {a}.id_servicio_funerario) || ' · EV-' || printf('%04d', {a}.id_evento)")
table('asignacion_empleado', 'Asignación de empleados', 'Servicios y recursos', [
    ID('id_asignacion_empleado'), FK('id_servicio_prestado', 'servicio_prestado', on_delete='CASCADE'), FK('id_empleado', 'empleado'),
    FK('id_responsabilidad', 'responsabilidad'), C('fecha_asignacion', 'date', default='CURRENT_DATE', req=False)],
    "'Asignación #' || {a}.id_asignacion_empleado", uniques=[('id_servicio_prestado', 'id_empleado', 'id_responsabilidad')])
table('vehiculo', 'Vehículos', 'Servicios y recursos', [
    ID('id_vehiculo'), FK('id_tipo_vehiculo', 'tipo_vehiculo'), C('placa', unique=True),
    C('capacidad_pasajeros', 'integer', check='capacidad_pasajeros > 0'), C('esta_disponible', 'boolean', default='1', req=False)],
    '{a}.placa')
table('asignacion_vehiculo', 'Asignación de vehículos', 'Servicios y recursos', [
    ID('id_asignacion_vehiculo'), FK('id_servicio_prestado', 'servicio_prestado', on_delete='CASCADE'), FK('id_vehiculo', 'vehiculo'),
    C('fecha_hora_salida', 'datetime'), C('fecha_hora_regreso', 'datetime', req=False)],
    "'Asignación #' || {a}.id_asignacion_vehiculo",
    checks=['fecha_hora_regreso IS NULL OR fecha_hora_regreso >= fecha_hora_salida'])

# ---------------- Inventario ----------------
table('articulo', 'Artículos (inventario)', 'Inventario y compras', [
    ID('id_articulo'), FK('id_categoria_articulo', 'categoria_articulo'), FK('id_material', 'material', req=False),
    C('codigo', unique=True), C('nombre_articulo'), C('precio_venta', 'real', check='precio_venta >= 0'),
    C('cantidad_disponible', 'integer', default='0', req=False, check='cantidad_disponible >= 0')],
    "{a}.codigo || ' - ' || {a}.nombre_articulo",
    desc='La existencia se actualiza sola con compras, entregas y devoluciones (triggers).')
table('articulo_entregado', 'Artículos entregados', 'Inventario y compras', [
    ID('id_articulo_entregado'), FK('id_evento', 'evento_fallecimiento', on_delete='CASCADE'), FK('id_articulo', 'articulo'),
    FK('id_modalidad_entrega', 'modalidad_entrega'), FK('id_estado_devolucion', 'estado_devolucion', req=False),
    C('cantidad', 'integer', check='cantidad > 0'), C('fecha_entrega', 'date'), C('fecha_devolucion', 'date', req=False)],
    "(SELECT a.nombre_articulo FROM articulo a WHERE a.id_articulo = {a}.id_articulo) || ' x' || {a}.cantidad || ' · EV-' || printf('%04d', {a}.id_evento)",
    checks=['fecha_devolucion IS NULL OR fecha_devolucion >= fecha_entrega'])
table('proveedor', 'Proveedores', 'Inventario y compras', [
    ID('id_proveedor'), C('nit', unique=True), C('razon_social'), C('telefono', req=False),
    C('correo_electronico', req=False, check="correo_electronico IS NULL OR correo_electronico LIKE '%_@_%._%'")],
    '{a}.razon_social')
table('compra', 'Compras', 'Inventario y compras', [
    ID('id_compra'), FK('id_proveedor', 'proveedor'), C('fecha_compra', 'date'),
    C('valor_total', 'real', default='0', req=False, check='valor_total >= 0')],
    "'Compra #' || {a}.id_compra || ' · ' || {a}.fecha_compra", desc='valor_total se recalcula desde el detalle (trigger).')
table('detalle_compra', 'Detalle de compras', 'Inventario y compras', [
    ID('id_detalle_compra'), FK('id_compra', 'compra', on_delete='CASCADE'), FK('id_articulo', 'articulo'),
    C('cantidad', 'integer', check='cantidad > 0'), C('costo_unitario', 'real', check='costo_unitario >= 0')],
    "'Detalle #' || {a}.id_detalle_compra")

# ---------------- Facturación ----------------
table('factura', 'Facturas', 'Facturación', [
    ID('id_factura'), FK('id_evento', 'evento_fallecimiento'), FK('id_estado_factura', 'estado_factura'),
    C('numero_factura', unique=True), C('fecha_emision', 'date', default='CURRENT_DATE', req=False),
    C('valor_total', 'real', default='0', req=False, check='valor_total >= 0'),
    C('valor_cubierto_poliza', 'real', default='0', req=False, check='valor_cubierto_poliza >= 0'),
    C('valor_a_cargo_cliente', 'real', default='0', req=False, check='valor_a_cargo_cliente >= 0')],
    '{a}.numero_factura', uniques=[('id_evento',)],
    checks=['abs(valor_total - (valor_cubierto_poliza + valor_a_cargo_cliente)) < 0.01'], audit=True,
    desc='Totales recalculados desde el detalle (trigger). Si todo lo cubre la póliza, valor_a_cargo_cliente = 0.')
table('detalle_factura', 'Detalle de facturas', 'Facturación', [
    ID('id_detalle_factura'), FK('id_factura', 'factura', on_delete='CASCADE'),
    FK('id_servicio_prestado', 'servicio_prestado', req=False, on_delete='RESTRICT'),
    FK('id_articulo_entregado', 'articulo_entregado', req=False, on_delete='RESTRICT'),
    C('concepto'), C('valor_concepto', 'real', check='valor_concepto >= 0'),
    C('valor_cubierto', 'real', default='0', req=False, check='valor_cubierto >= 0'),
    C('valor_cliente', 'real', default='0', req=False, check='valor_cliente >= 0')],
    '{a}.concepto',
    checks=['id_servicio_prestado IS NOT NULL OR id_articulo_entregado IS NOT NULL',
            'abs(valor_concepto - (valor_cubierto + valor_cliente)) < 0.01'], audit=True)
table('pago_factura', 'Pagos de factura', 'Facturación', [
    ID('id_pago_factura'), FK('id_factura', 'factura'), FK('id_metodo_pago', 'metodo_pago'), C('fecha_pago', 'date'),
    C('valor_pagado', 'real', check='valor_pagado > 0')], "'Pago #' || {a}.id_pago_factura || ' · ' || {a}.fecha_pago",
    audit=True, desc='Cuando lo pagado cubre el valor a cargo del cliente, la factura pasa a Pagada (trigger).')

# ---------------- Seguridad ----------------
table('usuario', 'Usuarios', 'Seguridad', [
    ID('id_usuario'), FK('id_rol', 'rol'), FK('id_empleado', 'empleado', on_delete='CASCADE'), C('nombre_usuario', unique=True),
    C('clave_hash', search=False), C('esta_activo', 'boolean', default='1', req=False)], '{a}.nombre_usuario',
    uniques=[('id_empleado',)])
table('rol_permiso', 'Permisos por rol', 'Seguridad', [
    C('id_rol', 'integer', pk=True, fk='rol', on_delete='CASCADE'), C('id_permiso', 'integer', pk=True, fk='permiso', on_delete='CASCADE')],
    "(SELECT r.nombre FROM rol r WHERE r.id_rol = {a}.id_rol) || ' → ' || (SELECT p.nombre FROM permiso p WHERE p.id_permiso = {a}.id_permiso)")
table('bitacora_auditoria', 'Bitácora de auditoría', 'Seguridad', [
    ID('id_bitacora'), FK('id_usuario', 'usuario', req=False), FK('id_tipo_operacion', 'tipo_operacion'),
    C('fecha_hora', 'datetime', default='CURRENT_TIMESTAMP', req=False), C('tabla_afectada'), C('id_registro_afectado'),
    C('valor_anterior', req=False, search=False), C('valor_nuevo', req=False, search=False)],
    "'#' || {a}.id_bitacora || ' · ' || {a}.tabla_afectada",
    desc='Se llena automáticamente desde la API al modificar pólizas, eventos y facturación.')

# ------------------------------------------------------------------
ACC = {'poliza': 'póliza', 'polizas': 'pólizas', 'anio': 'año', 'region': 'región', 'atencion': 'atención', 'institucion': 'institución',
       'defuncion': 'defunción', 'codigo': 'código', 'telefono': 'teléfono', 'direccion': 'dirección', 'electronico': 'electrónico',
       'numero': 'número', 'cremacion': 'cremación', 'restriccion': 'restricción', 'operacion': 'operación', 'vehiculo': 'vehículo',
       'articulo': 'artículo', 'medico': 'médico', 'religion': 'religión', 'devolucion': 'devolución', 'expedicion': 'expedición',
       'autorizacion': 'autorización', 'inclusion': 'inclusión', 'afiliacion': 'afiliación', 'asignacion': 'asignación',
       'instalacion': 'instalación', 'prestacion': 'prestación', 'emision': 'emisión', 'categoria': 'categoría', 'medico': 'médico',
       'pasajeros': 'pasajeros', 'descripcion': 'descripción', 'razon': 'razón', 'periodo': 'período', 'muerte': 'muerte',
       'nit': 'NIT', 'clave': 'clave', 'bitacora': 'bitácora', 'cobrable': 'cobrable', 'judicial': 'judicial'}
def label(col):
    n = col
    if n.startswith('id_') and len(n) > 3: n = n[3:]
    boolq = n.startswith('es_') or n.startswith('esta_')
    if n.startswith('es_'): n = n[3:]
    words = [ACC.get(w, w) for w in n.split('_')]
    s = ' '.join(words); s = s[0].upper() + s[1:]
    if col.startswith('esta_'): s = '¿' + s.replace('Esta', 'Está') + '?'
    elif boolq: s = '¿Es ' + s[0].lower() + s[1:] + '?'
    return s

SQLT = {'integer': 'INTEGER', 'real': 'REAL', 'text': 'TEXT', 'boolean': 'INTEGER', 'date': 'TEXT', 'time': 'TEXT', 'datetime': 'TEXT'}

def col_sql(t, c):
    parts = [c['name'], SQLT[c['type']]]
    if c['pk'] and len(t['pk']) == 1:
        parts.append('PRIMARY KEY' + (' AUTOINCREMENT' if c['auto'] else ''))
    elif c['pk'] or c['required'] or c['default'] is not None:
        parts.append('NOT NULL')
    if c['unique']: parts.append('UNIQUE')
    if c['default'] is not None:
        parts.append('DEFAULT ' + c['default'])
    chk = []
    if c['type'] == 'boolean': chk.append(f"{c['name']} IN (0, 1)")
    if c['type'] == 'date': chk.append(f"{c['name']} IS NULL OR date({c['name']}) = {c['name']}")
    if c['type'] == 'time': chk.append(f"{c['name']} IS NULL OR {c['name']} GLOB '[0-2][0-9]:[0-5][0-9]*'")
    if c['type'] == 'datetime': chk.append(f"{c['name']} IS NULL OR datetime({c['name']}) IS NOT NULL")
    if c['check']: chk.append(c['check'])
    for k in chk: parts.append(f'CHECK ({k})')
    return '  ' + ' '.join(parts)

def build_schema():
    o = ['-- =====================================================================',
         '-- Esquema D1 (SQLite) - Sistema de gestión funeraria',
         '-- Generado desde Modelo_funeraria_corregido.drawio (63 tablas)',
         '-- =====================================================================',
         'PRAGMA foreign_keys = ON;', '']
    o.append('-- Limpieza en orden inverso a las dependencias')
    for t in reversed(TABLES): o.append(f"DROP TABLE IF EXISTS {t['name']};")
    o.append('')
    for t in TABLES:
        o.append(f"-- {t['title']}" + (' [tabla estática]' if t['static'] else '') + (f" - {t['description']}" if t['description'] else ''))
        lines = [col_sql(t, c) for c in t['columns']]
        if len(t['pk']) > 1: lines.append(f"  PRIMARY KEY ({', '.join(t['pk'])})")
        for u in t['uniques']:
            if len(u) == 1 and any(c['name'] == u[0] and c['unique'] for c in t['columns']): continue
            lines.append(f"  UNIQUE ({', '.join(u)})")
        for k in t['checks']: lines.append(f'  CHECK ({k})')
        for c in t['columns']:
            if c['fk']:
                tp = BY[c['fk']]['pk'][0]
                lines.append(f"  FOREIGN KEY ({c['name']}) REFERENCES {c['fk']}({tp}) ON DELETE {c['on_delete']} ON UPDATE CASCADE")
        o.append(f"CREATE TABLE {t['name']} (\n" + ',\n'.join(lines) + '\n);\n')
    o.append('-- ---------------------------------------------------------------------')
    o.append('-- Índices: llaves foráneas y columnas de búsqueda')
    o.append('-- ---------------------------------------------------------------------')
    seen = set()
    for t in TABLES:
        for i, c in enumerate(t['columns']):
            if c['fk'] and not (c['pk'] and i == 0):
                ix = f"idx_{t['name']}_{c['name']}"
                if ix not in seen: seen.add(ix); o.append(f"CREATE INDEX {ix} ON {t['name']}({c['name']});")
    for t, cols in [('persona', 'apellidos, nombres'), ('persona', 'numero_documento'), ('poliza', 'fecha_fin_vigencia'),
                    ('evento_fallecimiento', 'fecha_fallecimiento'), ('factura', 'fecha_emision'), ('pago_prima', 'fecha_pago'),
                    ('pago_factura', 'fecha_pago'), ('servicio_prestado', 'fecha_hora_prestacion'), ('articulo', 'nombre_articulo'),
                    ('empleado', 'apellidos, nombres'), ('bitacora_auditoria', 'tabla_afectada, id_registro_afectado'),
                    ('bitacora_auditoria', 'fecha_hora')]:
        o.append(f"CREATE INDEX idx_{t}_{re.sub(r'[^a-z]+', '_', cols)} ON {t}({cols});")
    o.append('')
    o.append(open(os.path.join(os.path.dirname(__file__), 'triggers.sql'), encoding='utf-8').read())
    return '\n'.join(o)

COMPUTED = {('factura', 'valor_total'), ('factura', 'valor_cubierto_poliza'), ('factura', 'valor_a_cargo_cliente'),
            ('compra', 'valor_total')}

def build_meta():
    out = []
    for t in TABLES:
        cols = []
        for c in t['columns']:
            m = dict(name=c['name'], label=label(c['name']), type=c['type'], required=bool(c['required'] and c['default'] is None),
                     pk=c['pk'], auto=c['auto'], search=bool(c['search']))
            if c['fk']: m['fk'] = c['fk']
            if (t['name'], c['name']) in COMPUTED: m['computed'] = True
            if c['default'] is not None: m['hasDefault'] = True
            if c['check'] and ' IN (' in c['check'] and c['name'] == 'nombre':
                m['options'] = re.findall(r"'([^']*)'", c['check'])
            cols.append(m)
        out.append(dict(name=t['name'], title=t['title'], module=t['module'], static=t['static'], audit=t['audit'],
                        pk=t['pk'], label=t['label'], description=t['description'], columns=cols))
    return ('// ARCHIVO GENERADO desde el modelo de datos. Describe tablas, columnas y relaciones.\n'
            '// La API y el frontend se construyen a partir de estos metadatos (ver AGENTS.md > Reglas de extensión).\n'
            "import type { TableMeta } from './types';\n\n"
            'export const TABLES: TableMeta[] = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n\n'
            'export const TABLE_MAP: Record<string, TableMeta> = Object.fromEntries(TABLES.map((t) => [t.name, t]));\n')

if __name__ == '__main__':
    root = sys.argv[1]
    assert len(TABLES) == 63, len(TABLES)
    open(os.path.join(root, 'db/schema.sql'), 'w', encoding='utf-8').write(build_schema())
    open(os.path.join(root, 'src/meta.ts'), 'w', encoding='utf-8').write(build_meta())
    print('ok', len(TABLES))
