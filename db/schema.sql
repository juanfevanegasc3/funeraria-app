-- =====================================================================
-- Esquema D1 (SQLite) - Sistema de gestión funeraria
-- Generado desde Modelo_funeraria_corregido.drawio (63 tablas)
-- =====================================================================
PRAGMA foreign_keys = ON;

-- Limpieza en orden inverso a las dependencias
DROP TABLE IF EXISTS bitacora_auditoria;
DROP TABLE IF EXISTS rol_permiso;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS pago_factura;
DROP TABLE IF EXISTS detalle_factura;
DROP TABLE IF EXISTS factura;
DROP TABLE IF EXISTS detalle_compra;
DROP TABLE IF EXISTS compra;
DROP TABLE IF EXISTS proveedor;
DROP TABLE IF EXISTS articulo_entregado;
DROP TABLE IF EXISTS articulo;
DROP TABLE IF EXISTS asignacion_vehiculo;
DROP TABLE IF EXISTS vehiculo;
DROP TABLE IF EXISTS asignacion_empleado;
DROP TABLE IF EXISTS servicio_prestado;
DROP TABLE IF EXISTS instalacion;
DROP TABLE IF EXISTS registro_civil_defuncion;
DROP TABLE IF EXISTS empleado;
DROP TABLE IF EXISTS sede;
DROP TABLE IF EXISTS oficina_registro_civil;
DROP TABLE IF EXISTS restriccion_cremacion;
DROP TABLE IF EXISTS acta_necropsia;
DROP TABLE IF EXISTS certificado_defuncion;
DROP TABLE IF EXISTS medico;
DROP TABLE IF EXISTS institucion_emisora;
DROP TABLE IF EXISTS evento_fallecimiento;
DROP TABLE IF EXISTS tarifa_servicio_region;
DROP TABLE IF EXISTS cobertura_plan;
DROP TABLE IF EXISTS servicio_funerario;
DROP TABLE IF EXISTS pago_prima;
DROP TABLE IF EXISTS anio_cobro_poliza;
DROP TABLE IF EXISTS beneficiario;
DROP TABLE IF EXISTS poliza;
DROP TABLE IF EXISTS plan_exequial;
DROP TABLE IF EXISTS titular;
DROP TABLE IF EXISTS persona;
DROP TABLE IF EXISTS tipo_operacion;
DROP TABLE IF EXISTS permiso;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS estado_factura;
DROP TABLE IF EXISTS estado_devolucion;
DROP TABLE IF EXISTS modalidad_entrega;
DROP TABLE IF EXISTS material;
DROP TABLE IF EXISTS categoria_articulo;
DROP TABLE IF EXISTS tipo_sede;
DROP TABLE IF EXISTS tipo_instalacion;
DROP TABLE IF EXISTS tipo_vehiculo;
DROP TABLE IF EXISTS cargo;
DROP TABLE IF EXISTS responsabilidad;
DROP TABLE IF EXISTS estado_servicio;
DROP TABLE IF EXISTS region_atencion;
DROP TABLE IF EXISTS religion;
DROP TABLE IF EXISTS categoria_servicio;
DROP TABLE IF EXISTS tipo_oficina;
DROP TABLE IF EXISTS motivo_restriccion;
DROP TABLE IF EXISTS tipo_institucion;
DROP TABLE IF EXISTS tipo_muerte;
DROP TABLE IF EXISTS metodo_pago;
DROP TABLE IF EXISTS periodicidad_cobro;
DROP TABLE IF EXISTS estado_poliza;
DROP TABLE IF EXISTS tipo_poliza;
DROP TABLE IF EXISTS parentesco;
DROP TABLE IF EXISTS tipo_documento;

-- Tipos de documento [tabla estática]
CREATE TABLE tipo_documento (
  id_tipo_documento INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  sigla TEXT NOT NULL UNIQUE
);

-- Parentescos [tabla estática]
CREATE TABLE parentesco (
  id_parentesco INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de póliza [tabla estática]
CREATE TABLE tipo_poliza (
  id_tipo_poliza INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Individual', 'Colectiva'))
);

-- Estados de póliza [tabla estática]
CREATE TABLE estado_poliza (
  id_estado_poliza INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Activa', 'Vencida', 'Suspendida', 'Cancelada'))
);

-- Periodicidades de cobro [tabla estática]
CREATE TABLE periodicidad_cobro (
  id_periodicidad_cobro INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  meses_por_ciclo INTEGER NOT NULL CHECK (meses_por_ciclo > 0)
);

-- Métodos de pago [tabla estática]
CREATE TABLE metodo_pago (
  id_metodo_pago INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de muerte [tabla estática]
CREATE TABLE tipo_muerte (
  id_tipo_muerte INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Natural', 'Violenta', 'En estudio'))
);

-- Tipos de institución [tabla estática]
CREATE TABLE tipo_institucion (
  id_tipo_institucion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Motivos de restricción de cremación [tabla estática]
CREATE TABLE motivo_restriccion (
  id_motivo_restriccion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de oficina de registro [tabla estática]
CREATE TABLE tipo_oficina (
  id_tipo_oficina INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Notaría', 'Registraduría'))
);

-- Categorías de servicio [tabla estática]
CREATE TABLE categoria_servicio (
  id_categoria_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Básico', 'Complementario'))
);

-- Religiones [tabla estática]
CREATE TABLE religion (
  id_religion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Regiones de atención [tabla estática]
CREATE TABLE region_atencion (
  id_region_atencion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  departamento TEXT NOT NULL
);

-- Estados de servicio [tabla estática]
CREATE TABLE estado_servicio (
  id_estado_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Programado', 'En curso', 'Prestado', 'Cancelado'))
);

-- Responsabilidades [tabla estática]
CREATE TABLE responsabilidad (
  id_responsabilidad INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

-- Cargos [tabla estática]
CREATE TABLE cargo (
  id_cargo INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de vehículo [tabla estática]
CREATE TABLE tipo_vehiculo (
  id_tipo_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de instalación [tabla estática]
CREATE TABLE tipo_instalacion (
  id_tipo_instalacion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Tipos de sede [tabla estática]
CREATE TABLE tipo_sede (
  id_tipo_sede INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Administrativa', 'Cementerio'))
);

-- Categorías de artículo [tabla estática]
CREATE TABLE categoria_articulo (
  id_categoria_articulo INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Materiales [tabla estática]
CREATE TABLE material (
  id_material INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Modalidades de entrega [tabla estática]
CREATE TABLE modalidad_entrega (
  id_modalidad_entrega INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Venta', 'Préstamo', 'Consumo'))
);

-- Estados de devolución [tabla estática]
CREATE TABLE estado_devolucion (
  id_estado_devolucion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- Estados de factura [tabla estática]
CREATE TABLE estado_factura (
  id_estado_factura INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Pendiente', 'Pagada', 'Anulada'))
);

-- Roles [tabla estática]
CREATE TABLE rol (
  id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Administrador', 'Asesor', 'Facturación'))
);

-- Permisos [tabla estática]
CREATE TABLE permiso (
  id_permiso INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT
);

-- Tipos de operación [tabla estática]
CREATE TABLE tipo_operacion (
  id_tipo_operacion INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE CHECK (nombre IN ('Inserción', 'Actualización', 'Eliminación'))
);

-- Personas - Supertipo: datos personales comunes a titulares, beneficiarios, fallecidos y reportantes.
CREATE TABLE persona (
  id_persona INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tipo_documento INTEGER NOT NULL,
  numero_documento TEXT NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  fecha_nacimiento TEXT CHECK (fecha_nacimiento IS NULL OR date(fecha_nacimiento) = fecha_nacimiento),
  telefono TEXT,
  direccion TEXT,
  correo_electronico TEXT CHECK (correo_electronico IS NULL OR correo_electronico LIKE '%_@_%._%'),
  UNIQUE (id_tipo_documento, numero_documento),
  FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo_documento) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Titulares - Subtipo de PERSONA (herencia): quien contrata la póliza.
CREATE TABLE titular (
  id_persona INTEGER PRIMARY KEY,
  fecha_afiliacion TEXT NOT NULL DEFAULT CURRENT_DATE CHECK (fecha_afiliacion IS NULL OR date(fecha_afiliacion) = fecha_afiliacion),
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Planes exequiales
CREATE TABLE plan_exequial (
  id_plan_exequial INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_plan TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  valor_base_prima REAL NOT NULL CHECK (valor_base_prima >= 0)
);

-- Pólizas
CREATE TABLE poliza (
  id_poliza INTEGER PRIMARY KEY AUTOINCREMENT,
  id_persona_titular INTEGER NOT NULL,
  id_plan_exequial INTEGER NOT NULL,
  id_tipo_poliza INTEGER NOT NULL,
  id_estado_poliza INTEGER NOT NULL,
  id_periodicidad_cobro INTEGER NOT NULL,
  numero_poliza TEXT NOT NULL UNIQUE,
  fecha_inicio TEXT NOT NULL CHECK (fecha_inicio IS NULL OR date(fecha_inicio) = fecha_inicio),
  fecha_fin_vigencia TEXT NOT NULL CHECK (fecha_fin_vigencia IS NULL OR date(fecha_fin_vigencia) = fecha_fin_vigencia),
  valor_prima REAL NOT NULL CHECK (valor_prima >= 0),
  CHECK (fecha_fin_vigencia >= fecha_inicio),
  FOREIGN KEY (id_persona_titular) REFERENCES titular(id_persona) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_plan_exequial) REFERENCES plan_exequial(id_plan_exequial) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_tipo_poliza) REFERENCES tipo_poliza(id_tipo_poliza) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_estado_poliza) REFERENCES estado_poliza(id_estado_poliza) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_periodicidad_cobro) REFERENCES periodicidad_cobro(id_periodicidad_cobro) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Beneficiarios - Subtipo de PERSONA (herencia). Máximo 7 por póliza (trigger).
CREATE TABLE beneficiario (
  id_persona INTEGER PRIMARY KEY,
  id_poliza INTEGER NOT NULL,
  id_parentesco INTEGER NOT NULL,
  tarifa_diferenciada REAL CHECK (tarifa_diferenciada IS NULL OR tarifa_diferenciada >= 0),
  fecha_inclusion TEXT NOT NULL DEFAULT CURRENT_DATE CHECK (fecha_inclusion IS NULL OR date(fecha_inclusion) = fecha_inclusion),
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_parentesco) REFERENCES parentesco(id_parentesco) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Años de cobro
CREATE TABLE anio_cobro_poliza (
  id_anio_cobro INTEGER PRIMARY KEY AUTOINCREMENT,
  id_poliza INTEGER NOT NULL,
  anio INTEGER NOT NULL CHECK (anio BETWEEN 1900 AND 2200),
  es_anio_cobrable INTEGER NOT NULL DEFAULT 1 CHECK (es_anio_cobrable IN (0, 1)),
  UNIQUE (id_poliza, anio),
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Pagos de prima
CREATE TABLE pago_prima (
  id_pago_prima INTEGER PRIMARY KEY AUTOINCREMENT,
  id_poliza INTEGER NOT NULL,
  id_metodo_pago INTEGER NOT NULL,
  fecha_pago TEXT NOT NULL CHECK (fecha_pago IS NULL OR date(fecha_pago) = fecha_pago),
  valor_pagado REAL NOT NULL CHECK (valor_pagado > 0),
  periodo_cubierto TEXT NOT NULL,
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Servicios funerarios
CREATE TABLE servicio_funerario (
  id_servicio_funerario INTEGER PRIMARY KEY AUTOINCREMENT,
  id_categoria_servicio INTEGER NOT NULL,
  id_religion INTEGER,
  nombre_servicio TEXT NOT NULL UNIQUE,
  valor_base REAL NOT NULL CHECK (valor_base >= 0),
  FOREIGN KEY (id_categoria_servicio) REFERENCES categoria_servicio(id_categoria_servicio) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_religion) REFERENCES religion(id_religion) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Coberturas por plan
CREATE TABLE cobertura_plan (
  id_cobertura_plan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_plan_exequial INTEGER NOT NULL,
  id_servicio_funerario INTEGER NOT NULL,
  porcentaje_cobertura REAL NOT NULL CHECK (porcentaje_cobertura BETWEEN 0 AND 100),
  tope_valor_cubierto REAL CHECK (tope_valor_cubierto IS NULL OR tope_valor_cubierto >= 0),
  UNIQUE (id_plan_exequial, id_servicio_funerario),
  FOREIGN KEY (id_plan_exequial) REFERENCES plan_exequial(id_plan_exequial) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_servicio_funerario) REFERENCES servicio_funerario(id_servicio_funerario) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tarifas por región
CREATE TABLE tarifa_servicio_region (
  id_tarifa INTEGER PRIMARY KEY AUTOINCREMENT,
  id_servicio_funerario INTEGER NOT NULL,
  id_region_atencion INTEGER NOT NULL,
  valor_tarifa REAL NOT NULL CHECK (valor_tarifa >= 0),
  vigente_desde TEXT NOT NULL CHECK (vigente_desde IS NULL OR date(vigente_desde) = vigente_desde),
  UNIQUE (id_servicio_funerario, id_region_atencion, vigente_desde),
  FOREIGN KEY (id_servicio_funerario) REFERENCES servicio_funerario(id_servicio_funerario) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_region_atencion) REFERENCES region_atencion(id_region_atencion) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Eventos de fallecimiento - La póliza debe estar Activa y cubrir al fallecido (titular o beneficiario); validado por trigger.
CREATE TABLE evento_fallecimiento (
  id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
  id_persona_fallecida INTEGER NOT NULL,
  id_poliza INTEGER,
  id_persona_reportante INTEGER NOT NULL,
  id_parentesco_reportante INTEGER,
  id_region_atencion INTEGER NOT NULL,
  fecha_fallecimiento TEXT NOT NULL CHECK (fecha_fallecimiento IS NULL OR date(fecha_fallecimiento) = fecha_fallecimiento),
  hora_fallecimiento TEXT CHECK (hora_fallecimiento IS NULL OR hora_fallecimiento GLOB '[0-2][0-9]:[0-5][0-9]*'),
  lugar_fallecimiento TEXT NOT NULL,
  causa_fallecimiento TEXT,
  es_servicio_particular INTEGER NOT NULL DEFAULT 0 CHECK (es_servicio_particular IN (0, 1)),
  fecha_hora_reporte TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK (fecha_hora_reporte IS NULL OR datetime(fecha_hora_reporte) IS NOT NULL),
  UNIQUE (id_persona_fallecida),
  CHECK ((es_servicio_particular = 1 AND id_poliza IS NULL) OR (es_servicio_particular = 0 AND id_poliza IS NOT NULL)),
  FOREIGN KEY (id_persona_fallecida) REFERENCES persona(id_persona) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_persona_reportante) REFERENCES persona(id_persona) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_parentesco_reportante) REFERENCES parentesco(id_parentesco) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_region_atencion) REFERENCES region_atencion(id_region_atencion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Instituciones emisoras
CREATE TABLE institucion_emisora (
  id_institucion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tipo_institucion INTEGER NOT NULL,
  nombre_institucion TEXT NOT NULL,
  nit TEXT UNIQUE,
  FOREIGN KEY (id_tipo_institucion) REFERENCES tipo_institucion(id_tipo_institucion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Médicos
CREATE TABLE medico (
  id_medico INTEGER PRIMARY KEY AUTOINCREMENT,
  id_institucion INTEGER,
  nombre_completo TEXT NOT NULL,
  registro_medico TEXT NOT NULL UNIQUE,
  FOREIGN KEY (id_institucion) REFERENCES institucion_emisora(id_institucion) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Certificados de defunción
CREATE TABLE certificado_defuncion (
  id_certificado INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_medico INTEGER NOT NULL,
  id_institucion INTEGER NOT NULL,
  id_tipo_muerte INTEGER NOT NULL,
  numero_certificado TEXT NOT NULL UNIQUE,
  fecha_defuncion TEXT NOT NULL CHECK (fecha_defuncion IS NULL OR date(fecha_defuncion) = fecha_defuncion),
  hora_defuncion TEXT CHECK (hora_defuncion IS NULL OR hora_defuncion GLOB '[0-2][0-9]:[0-5][0-9]*'),
  lugar_defuncion TEXT NOT NULL,
  causa_muerte TEXT NOT NULL,
  UNIQUE (id_evento),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_medico) REFERENCES medico(id_medico) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_institucion) REFERENCES institucion_emisora(id_institucion) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_tipo_muerte) REFERENCES tipo_muerte(id_tipo_muerte) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Actas de necropsia
CREATE TABLE acta_necropsia (
  id_acta_necropsia INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_institucion INTEGER NOT NULL,
  numero_acta TEXT NOT NULL UNIQUE,
  fecha_expedicion TEXT NOT NULL CHECK (fecha_expedicion IS NULL OR date(fecha_expedicion) = fecha_expedicion),
  UNIQUE (id_evento),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_institucion) REFERENCES institucion_emisora(id_institucion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Restricciones de cremación - Mientras no tenga autorización judicial, el evento no admite servicios de cremación (trigger).
CREATE TABLE restriccion_cremacion (
  id_restriccion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_motivo_restriccion INTEGER NOT NULL,
  numero_autorizacion_judicial TEXT,
  juzgado_autorizador TEXT,
  fecha_autorizacion TEXT CHECK (fecha_autorizacion IS NULL OR date(fecha_autorizacion) = fecha_autorizacion),
  UNIQUE (id_evento),
  CHECK ((numero_autorizacion_judicial IS NULL) = (fecha_autorizacion IS NULL)),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_motivo_restriccion) REFERENCES motivo_restriccion(id_motivo_restriccion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Oficinas de registro civil
CREATE TABLE oficina_registro_civil (
  id_oficina_registro INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tipo_oficina INTEGER NOT NULL,
  nombre_oficina TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  FOREIGN KEY (id_tipo_oficina) REFERENCES tipo_oficina(id_tipo_oficina) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Sedes
CREATE TABLE sede (
  id_sede INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tipo_sede INTEGER NOT NULL,
  nombre_sede TEXT NOT NULL UNIQUE,
  direccion TEXT NOT NULL,
  FOREIGN KEY (id_tipo_sede) REFERENCES tipo_sede(id_tipo_sede) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Empleados
CREATE TABLE empleado (
  id_empleado INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sede INTEGER NOT NULL,
  id_cargo INTEGER NOT NULL,
  numero_documento TEXT NOT NULL UNIQUE,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  telefono TEXT,
  FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Registros civiles de defunción
CREATE TABLE registro_civil_defuncion (
  id_registro_civil INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_oficina_registro INTEGER NOT NULL,
  id_empleado_gestor INTEGER,
  numero_serial TEXT NOT NULL UNIQUE,
  fecha_registro TEXT NOT NULL CHECK (fecha_registro IS NULL OR date(fecha_registro) = fecha_registro),
  UNIQUE (id_evento),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_oficina_registro) REFERENCES oficina_registro_civil(id_oficina_registro) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_empleado_gestor) REFERENCES empleado(id_empleado) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Instalaciones
CREATE TABLE instalacion (
  id_instalacion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sede INTEGER NOT NULL,
  id_tipo_instalacion INTEGER NOT NULL,
  nombre_instalacion TEXT NOT NULL,
  capacidad_personas INTEGER CHECK (capacidad_personas IS NULL OR capacidad_personas > 0),
  esta_disponible INTEGER NOT NULL DEFAULT 1 CHECK (esta_disponible IN (0, 1)),
  FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_tipo_instalacion) REFERENCES tipo_instalacion(id_tipo_instalacion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Servicios prestados
CREATE TABLE servicio_prestado (
  id_servicio_prestado INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_servicio_funerario INTEGER NOT NULL,
  id_instalacion INTEGER,
  id_estado_servicio INTEGER NOT NULL,
  fecha_hora_prestacion TEXT NOT NULL CHECK (fecha_hora_prestacion IS NULL OR datetime(fecha_hora_prestacion) IS NOT NULL),
  es_cubierto_poliza INTEGER NOT NULL DEFAULT 0 CHECK (es_cubierto_poliza IN (0, 1)),
  valor_aplicado REAL NOT NULL CHECK (valor_aplicado >= 0),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_servicio_funerario) REFERENCES servicio_funerario(id_servicio_funerario) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_instalacion) REFERENCES instalacion(id_instalacion) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_estado_servicio) REFERENCES estado_servicio(id_estado_servicio) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Asignación de empleados
CREATE TABLE asignacion_empleado (
  id_asignacion_empleado INTEGER PRIMARY KEY AUTOINCREMENT,
  id_servicio_prestado INTEGER NOT NULL,
  id_empleado INTEGER NOT NULL,
  id_responsabilidad INTEGER NOT NULL,
  fecha_asignacion TEXT NOT NULL DEFAULT CURRENT_DATE CHECK (fecha_asignacion IS NULL OR date(fecha_asignacion) = fecha_asignacion),
  UNIQUE (id_servicio_prestado, id_empleado, id_responsabilidad),
  FOREIGN KEY (id_servicio_prestado) REFERENCES servicio_prestado(id_servicio_prestado) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_responsabilidad) REFERENCES responsabilidad(id_responsabilidad) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Vehículos
CREATE TABLE vehiculo (
  id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_tipo_vehiculo INTEGER NOT NULL,
  placa TEXT NOT NULL UNIQUE,
  capacidad_pasajeros INTEGER NOT NULL CHECK (capacidad_pasajeros > 0),
  esta_disponible INTEGER NOT NULL DEFAULT 1 CHECK (esta_disponible IN (0, 1)),
  FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipo_vehiculo(id_tipo_vehiculo) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Asignación de vehículos
CREATE TABLE asignacion_vehiculo (
  id_asignacion_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_servicio_prestado INTEGER NOT NULL,
  id_vehiculo INTEGER NOT NULL,
  fecha_hora_salida TEXT NOT NULL CHECK (fecha_hora_salida IS NULL OR datetime(fecha_hora_salida) IS NOT NULL),
  fecha_hora_regreso TEXT CHECK (fecha_hora_regreso IS NULL OR datetime(fecha_hora_regreso) IS NOT NULL),
  CHECK (fecha_hora_regreso IS NULL OR fecha_hora_regreso >= fecha_hora_salida),
  FOREIGN KEY (id_servicio_prestado) REFERENCES servicio_prestado(id_servicio_prestado) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Artículos (inventario) - La existencia se actualiza sola con compras, entregas y devoluciones (triggers).
CREATE TABLE articulo (
  id_articulo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_categoria_articulo INTEGER NOT NULL,
  id_material INTEGER,
  codigo TEXT NOT NULL UNIQUE,
  nombre_articulo TEXT NOT NULL,
  precio_venta REAL NOT NULL CHECK (precio_venta >= 0),
  cantidad_disponible INTEGER NOT NULL DEFAULT 0 CHECK (cantidad_disponible >= 0),
  FOREIGN KEY (id_categoria_articulo) REFERENCES categoria_articulo(id_categoria_articulo) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_material) REFERENCES material(id_material) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Artículos entregados
CREATE TABLE articulo_entregado (
  id_articulo_entregado INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_articulo INTEGER NOT NULL,
  id_modalidad_entrega INTEGER NOT NULL,
  id_estado_devolucion INTEGER,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  fecha_entrega TEXT NOT NULL CHECK (fecha_entrega IS NULL OR date(fecha_entrega) = fecha_entrega),
  fecha_devolucion TEXT CHECK (fecha_devolucion IS NULL OR date(fecha_devolucion) = fecha_devolucion),
  CHECK (fecha_devolucion IS NULL OR fecha_devolucion >= fecha_entrega),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_articulo) REFERENCES articulo(id_articulo) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_modalidad_entrega) REFERENCES modalidad_entrega(id_modalidad_entrega) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_estado_devolucion) REFERENCES estado_devolucion(id_estado_devolucion) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Proveedores
CREATE TABLE proveedor (
  id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
  nit TEXT NOT NULL UNIQUE,
  razon_social TEXT NOT NULL,
  telefono TEXT,
  correo_electronico TEXT CHECK (correo_electronico IS NULL OR correo_electronico LIKE '%_@_%._%')
);

-- Compras - valor_total se recalcula desde el detalle (trigger).
CREATE TABLE compra (
  id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
  id_proveedor INTEGER NOT NULL,
  fecha_compra TEXT NOT NULL CHECK (fecha_compra IS NULL OR date(fecha_compra) = fecha_compra),
  valor_total REAL NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Detalle de compras
CREATE TABLE detalle_compra (
  id_detalle_compra INTEGER PRIMARY KEY AUTOINCREMENT,
  id_compra INTEGER NOT NULL,
  id_articulo INTEGER NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  costo_unitario REAL NOT NULL CHECK (costo_unitario >= 0),
  FOREIGN KEY (id_compra) REFERENCES compra(id_compra) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_articulo) REFERENCES articulo(id_articulo) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Facturas - Totales recalculados desde el detalle (trigger). Si todo lo cubre la póliza, valor_a_cargo_cliente = 0.
CREATE TABLE factura (
  id_factura INTEGER PRIMARY KEY AUTOINCREMENT,
  id_evento INTEGER NOT NULL,
  id_estado_factura INTEGER NOT NULL,
  numero_factura TEXT NOT NULL UNIQUE,
  fecha_emision TEXT NOT NULL DEFAULT CURRENT_DATE CHECK (fecha_emision IS NULL OR date(fecha_emision) = fecha_emision),
  valor_total REAL NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  valor_cubierto_poliza REAL NOT NULL DEFAULT 0 CHECK (valor_cubierto_poliza >= 0),
  valor_a_cargo_cliente REAL NOT NULL DEFAULT 0 CHECK (valor_a_cargo_cliente >= 0),
  UNIQUE (id_evento),
  CHECK (abs(valor_total - (valor_cubierto_poliza + valor_a_cargo_cliente)) < 0.01),
  FOREIGN KEY (id_evento) REFERENCES evento_fallecimiento(id_evento) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_estado_factura) REFERENCES estado_factura(id_estado_factura) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Detalle de facturas
CREATE TABLE detalle_factura (
  id_detalle_factura INTEGER PRIMARY KEY AUTOINCREMENT,
  id_factura INTEGER NOT NULL,
  id_servicio_prestado INTEGER,
  id_articulo_entregado INTEGER,
  concepto TEXT NOT NULL,
  valor_concepto REAL NOT NULL CHECK (valor_concepto >= 0),
  valor_cubierto REAL NOT NULL DEFAULT 0 CHECK (valor_cubierto >= 0),
  valor_cliente REAL NOT NULL DEFAULT 0 CHECK (valor_cliente >= 0),
  CHECK (id_servicio_prestado IS NOT NULL OR id_articulo_entregado IS NOT NULL),
  CHECK (abs(valor_concepto - (valor_cubierto + valor_cliente)) < 0.01),
  FOREIGN KEY (id_factura) REFERENCES factura(id_factura) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_servicio_prestado) REFERENCES servicio_prestado(id_servicio_prestado) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_articulo_entregado) REFERENCES articulo_entregado(id_articulo_entregado) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Pagos de factura - Cuando lo pagado cubre el valor a cargo del cliente, la factura pasa a Pagada (trigger).
CREATE TABLE pago_factura (
  id_pago_factura INTEGER PRIMARY KEY AUTOINCREMENT,
  id_factura INTEGER NOT NULL,
  id_metodo_pago INTEGER NOT NULL,
  fecha_pago TEXT NOT NULL CHECK (fecha_pago IS NULL OR date(fecha_pago) = fecha_pago),
  valor_pagado REAL NOT NULL CHECK (valor_pagado > 0),
  FOREIGN KEY (id_factura) REFERENCES factura(id_factura) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Usuarios
CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  id_rol INTEGER NOT NULL,
  id_empleado INTEGER NOT NULL,
  nombre_usuario TEXT NOT NULL UNIQUE,
  clave_hash TEXT NOT NULL,
  esta_activo INTEGER NOT NULL DEFAULT 1 CHECK (esta_activo IN (0, 1)),
  UNIQUE (id_empleado),
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permisos por rol
CREATE TABLE rol_permiso (
  id_rol INTEGER NOT NULL,
  id_permiso INTEGER NOT NULL,
  PRIMARY KEY (id_rol, id_permiso),
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bitácora de auditoría - Se llena automáticamente desde la API al modificar pólizas, eventos y facturación.
CREATE TABLE bitacora_auditoria (
  id_bitacora INTEGER PRIMARY KEY AUTOINCREMENT,
  id_usuario INTEGER,
  id_tipo_operacion INTEGER NOT NULL,
  fecha_hora TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP CHECK (fecha_hora IS NULL OR datetime(fecha_hora) IS NOT NULL),
  tabla_afectada TEXT NOT NULL,
  id_registro_afectado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_nuevo TEXT,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_tipo_operacion) REFERENCES tipo_operacion(id_tipo_operacion) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ---------------------------------------------------------------------
-- Índices: llaves foráneas y columnas de búsqueda
-- ---------------------------------------------------------------------
CREATE INDEX idx_persona_id_tipo_documento ON persona(id_tipo_documento);
CREATE INDEX idx_poliza_id_persona_titular ON poliza(id_persona_titular);
CREATE INDEX idx_poliza_id_plan_exequial ON poliza(id_plan_exequial);
CREATE INDEX idx_poliza_id_tipo_poliza ON poliza(id_tipo_poliza);
CREATE INDEX idx_poliza_id_estado_poliza ON poliza(id_estado_poliza);
CREATE INDEX idx_poliza_id_periodicidad_cobro ON poliza(id_periodicidad_cobro);
CREATE INDEX idx_beneficiario_id_poliza ON beneficiario(id_poliza);
CREATE INDEX idx_beneficiario_id_parentesco ON beneficiario(id_parentesco);
CREATE INDEX idx_anio_cobro_poliza_id_poliza ON anio_cobro_poliza(id_poliza);
CREATE INDEX idx_pago_prima_id_poliza ON pago_prima(id_poliza);
CREATE INDEX idx_pago_prima_id_metodo_pago ON pago_prima(id_metodo_pago);
CREATE INDEX idx_servicio_funerario_id_categoria_servicio ON servicio_funerario(id_categoria_servicio);
CREATE INDEX idx_servicio_funerario_id_religion ON servicio_funerario(id_religion);
CREATE INDEX idx_cobertura_plan_id_plan_exequial ON cobertura_plan(id_plan_exequial);
CREATE INDEX idx_cobertura_plan_id_servicio_funerario ON cobertura_plan(id_servicio_funerario);
CREATE INDEX idx_tarifa_servicio_region_id_servicio_funerario ON tarifa_servicio_region(id_servicio_funerario);
CREATE INDEX idx_tarifa_servicio_region_id_region_atencion ON tarifa_servicio_region(id_region_atencion);
CREATE INDEX idx_evento_fallecimiento_id_persona_fallecida ON evento_fallecimiento(id_persona_fallecida);
CREATE INDEX idx_evento_fallecimiento_id_poliza ON evento_fallecimiento(id_poliza);
CREATE INDEX idx_evento_fallecimiento_id_persona_reportante ON evento_fallecimiento(id_persona_reportante);
CREATE INDEX idx_evento_fallecimiento_id_parentesco_reportante ON evento_fallecimiento(id_parentesco_reportante);
CREATE INDEX idx_evento_fallecimiento_id_region_atencion ON evento_fallecimiento(id_region_atencion);
CREATE INDEX idx_institucion_emisora_id_tipo_institucion ON institucion_emisora(id_tipo_institucion);
CREATE INDEX idx_medico_id_institucion ON medico(id_institucion);
CREATE INDEX idx_certificado_defuncion_id_evento ON certificado_defuncion(id_evento);
CREATE INDEX idx_certificado_defuncion_id_medico ON certificado_defuncion(id_medico);
CREATE INDEX idx_certificado_defuncion_id_institucion ON certificado_defuncion(id_institucion);
CREATE INDEX idx_certificado_defuncion_id_tipo_muerte ON certificado_defuncion(id_tipo_muerte);
CREATE INDEX idx_acta_necropsia_id_evento ON acta_necropsia(id_evento);
CREATE INDEX idx_acta_necropsia_id_institucion ON acta_necropsia(id_institucion);
CREATE INDEX idx_restriccion_cremacion_id_evento ON restriccion_cremacion(id_evento);
CREATE INDEX idx_restriccion_cremacion_id_motivo_restriccion ON restriccion_cremacion(id_motivo_restriccion);
CREATE INDEX idx_oficina_registro_civil_id_tipo_oficina ON oficina_registro_civil(id_tipo_oficina);
CREATE INDEX idx_sede_id_tipo_sede ON sede(id_tipo_sede);
CREATE INDEX idx_empleado_id_sede ON empleado(id_sede);
CREATE INDEX idx_empleado_id_cargo ON empleado(id_cargo);
CREATE INDEX idx_registro_civil_defuncion_id_evento ON registro_civil_defuncion(id_evento);
CREATE INDEX idx_registro_civil_defuncion_id_oficina_registro ON registro_civil_defuncion(id_oficina_registro);
CREATE INDEX idx_registro_civil_defuncion_id_empleado_gestor ON registro_civil_defuncion(id_empleado_gestor);
CREATE INDEX idx_instalacion_id_sede ON instalacion(id_sede);
CREATE INDEX idx_instalacion_id_tipo_instalacion ON instalacion(id_tipo_instalacion);
CREATE INDEX idx_servicio_prestado_id_evento ON servicio_prestado(id_evento);
CREATE INDEX idx_servicio_prestado_id_servicio_funerario ON servicio_prestado(id_servicio_funerario);
CREATE INDEX idx_servicio_prestado_id_instalacion ON servicio_prestado(id_instalacion);
CREATE INDEX idx_servicio_prestado_id_estado_servicio ON servicio_prestado(id_estado_servicio);
CREATE INDEX idx_asignacion_empleado_id_servicio_prestado ON asignacion_empleado(id_servicio_prestado);
CREATE INDEX idx_asignacion_empleado_id_empleado ON asignacion_empleado(id_empleado);
CREATE INDEX idx_asignacion_empleado_id_responsabilidad ON asignacion_empleado(id_responsabilidad);
CREATE INDEX idx_vehiculo_id_tipo_vehiculo ON vehiculo(id_tipo_vehiculo);
CREATE INDEX idx_asignacion_vehiculo_id_servicio_prestado ON asignacion_vehiculo(id_servicio_prestado);
CREATE INDEX idx_asignacion_vehiculo_id_vehiculo ON asignacion_vehiculo(id_vehiculo);
CREATE INDEX idx_articulo_id_categoria_articulo ON articulo(id_categoria_articulo);
CREATE INDEX idx_articulo_id_material ON articulo(id_material);
CREATE INDEX idx_articulo_entregado_id_evento ON articulo_entregado(id_evento);
CREATE INDEX idx_articulo_entregado_id_articulo ON articulo_entregado(id_articulo);
CREATE INDEX idx_articulo_entregado_id_modalidad_entrega ON articulo_entregado(id_modalidad_entrega);
CREATE INDEX idx_articulo_entregado_id_estado_devolucion ON articulo_entregado(id_estado_devolucion);
CREATE INDEX idx_compra_id_proveedor ON compra(id_proveedor);
CREATE INDEX idx_detalle_compra_id_compra ON detalle_compra(id_compra);
CREATE INDEX idx_detalle_compra_id_articulo ON detalle_compra(id_articulo);
CREATE INDEX idx_factura_id_evento ON factura(id_evento);
CREATE INDEX idx_factura_id_estado_factura ON factura(id_estado_factura);
CREATE INDEX idx_detalle_factura_id_factura ON detalle_factura(id_factura);
CREATE INDEX idx_detalle_factura_id_servicio_prestado ON detalle_factura(id_servicio_prestado);
CREATE INDEX idx_detalle_factura_id_articulo_entregado ON detalle_factura(id_articulo_entregado);
CREATE INDEX idx_pago_factura_id_factura ON pago_factura(id_factura);
CREATE INDEX idx_pago_factura_id_metodo_pago ON pago_factura(id_metodo_pago);
CREATE INDEX idx_usuario_id_rol ON usuario(id_rol);
CREATE INDEX idx_usuario_id_empleado ON usuario(id_empleado);
CREATE INDEX idx_rol_permiso_id_permiso ON rol_permiso(id_permiso);
CREATE INDEX idx_bitacora_auditoria_id_usuario ON bitacora_auditoria(id_usuario);
CREATE INDEX idx_bitacora_auditoria_id_tipo_operacion ON bitacora_auditoria(id_tipo_operacion);
CREATE INDEX idx_persona_apellidos_nombres ON persona(apellidos, nombres);
CREATE INDEX idx_persona_numero_documento ON persona(numero_documento);
CREATE INDEX idx_poliza_fecha_fin_vigencia ON poliza(fecha_fin_vigencia);
CREATE INDEX idx_evento_fallecimiento_fecha_fallecimiento ON evento_fallecimiento(fecha_fallecimiento);
CREATE INDEX idx_factura_fecha_emision ON factura(fecha_emision);
CREATE INDEX idx_pago_prima_fecha_pago ON pago_prima(fecha_pago);
CREATE INDEX idx_pago_factura_fecha_pago ON pago_factura(fecha_pago);
CREATE INDEX idx_servicio_prestado_fecha_hora_prestacion ON servicio_prestado(fecha_hora_prestacion);
CREATE INDEX idx_articulo_nombre_articulo ON articulo(nombre_articulo);
CREATE INDEX idx_empleado_apellidos_nombres ON empleado(apellidos, nombres);
CREATE INDEX idx_bitacora_auditoria_tabla_afectada_id_registro_afectado ON bitacora_auditoria(tabla_afectada, id_registro_afectado);
CREATE INDEX idx_bitacora_auditoria_fecha_hora ON bitacora_auditoria(fecha_hora);

-- ---------------------------------------------------------------------
-- Reglas de negocio (triggers)
-- ---------------------------------------------------------------------

-- R3/R5: máximo 7 beneficiarios por póliza
CREATE TRIGGER trg_beneficiario_max7_ins
BEFORE INSERT ON beneficiario
WHEN (SELECT COUNT(*) FROM beneficiario WHERE id_poliza = NEW.id_poliza) >= 7
BEGIN
  SELECT RAISE(ABORT, 'Una póliza no puede tener más de 7 beneficiarios');
END;

CREATE TRIGGER trg_beneficiario_max7_upd
BEFORE UPDATE OF id_poliza ON beneficiario
WHEN NEW.id_poliza <> OLD.id_poliza
 AND (SELECT COUNT(*) FROM beneficiario WHERE id_poliza = NEW.id_poliza) >= 7
BEGIN
  SELECT RAISE(ABORT, 'Una póliza no puede tener más de 7 beneficiarios');
END;

-- El titular no se registra como beneficiario de su propia póliza
CREATE TRIGGER trg_beneficiario_no_titular
BEFORE INSERT ON beneficiario
WHEN EXISTS (SELECT 1 FROM poliza WHERE id_poliza = NEW.id_poliza AND id_persona_titular = NEW.id_persona)
BEGIN
  SELECT RAISE(ABORT, 'El titular ya está cubierto por su póliza; no se registra como beneficiario');
END;

-- R11: la póliza del evento debe estar Activa y vigente en la fecha del fallecimiento
CREATE TRIGGER trg_evento_poliza_activa_ins
BEFORE INSERT ON evento_fallecimiento
WHEN NEW.id_poliza IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM poliza p JOIN estado_poliza e ON e.id_estado_poliza = p.id_estado_poliza
  WHERE p.id_poliza = NEW.id_poliza AND e.nombre = 'Activa'
    AND NEW.fecha_fallecimiento BETWEEN p.fecha_inicio AND p.fecha_fin_vigencia)
BEGIN
  SELECT RAISE(ABORT, 'La póliza no está activa o no estaba vigente en la fecha del fallecimiento');
END;

CREATE TRIGGER trg_evento_poliza_activa_upd
BEFORE UPDATE OF id_poliza, fecha_fallecimiento ON evento_fallecimiento
WHEN NEW.id_poliza IS NOT NULL AND NOT EXISTS (
  SELECT 1 FROM poliza p JOIN estado_poliza e ON e.id_estado_poliza = p.id_estado_poliza
  WHERE p.id_poliza = NEW.id_poliza AND e.nombre = 'Activa'
    AND NEW.fecha_fallecimiento BETWEEN p.fecha_inicio AND p.fecha_fin_vigencia)
BEGIN
  SELECT RAISE(ABORT, 'La póliza no está activa o no estaba vigente en la fecha del fallecimiento');
END;

-- R11: el fallecido debe ser el titular o un beneficiario de la póliza indicada
CREATE TRIGGER trg_evento_fallecido_cubierto_ins
BEFORE INSERT ON evento_fallecimiento
WHEN NEW.id_poliza IS NOT NULL
 AND NOT EXISTS (SELECT 1 FROM poliza WHERE id_poliza = NEW.id_poliza AND id_persona_titular = NEW.id_persona_fallecida)
 AND NOT EXISTS (SELECT 1 FROM beneficiario WHERE id_poliza = NEW.id_poliza AND id_persona = NEW.id_persona_fallecida)
BEGIN
  SELECT RAISE(ABORT, 'El fallecido no está cubierto por la póliza indicada (no es titular ni beneficiario)');
END;

CREATE TRIGGER trg_evento_fallecido_cubierto_upd
BEFORE UPDATE OF id_poliza, id_persona_fallecida ON evento_fallecimiento
WHEN NEW.id_poliza IS NOT NULL
 AND NOT EXISTS (SELECT 1 FROM poliza WHERE id_poliza = NEW.id_poliza AND id_persona_titular = NEW.id_persona_fallecida)
 AND NOT EXISTS (SELECT 1 FROM beneficiario WHERE id_poliza = NEW.id_poliza AND id_persona = NEW.id_persona_fallecida)
BEGIN
  SELECT RAISE(ABORT, 'El fallecido no está cubierto por la póliza indicada (no es titular ni beneficiario)');
END;

-- R13: un servicio particular (sin póliza) no puede marcarse como cubierto
CREATE TRIGGER trg_servicio_cubierto_requiere_poliza
BEFORE INSERT ON servicio_prestado
WHEN NEW.es_cubierto_poliza = 1
 AND (SELECT id_poliza FROM evento_fallecimiento WHERE id_evento = NEW.id_evento) IS NULL
BEGIN
  SELECT RAISE(ABORT, 'El evento es particular: el servicio no puede estar cubierto por póliza');
END;

-- R30: no se presta cremación si hay restricción sin autorización judicial
CREATE TRIGGER trg_cremacion_restringida
BEFORE INSERT ON servicio_prestado
WHEN (SELECT nombre_servicio FROM servicio_funerario WHERE id_servicio_funerario = NEW.id_servicio_funerario) LIKE 'Cremaci%'
 AND EXISTS (SELECT 1 FROM restriccion_cremacion
             WHERE id_evento = NEW.id_evento AND numero_autorizacion_judicial IS NULL)
BEGIN
  SELECT RAISE(ABORT, 'Cremación restringida para este evento: falta la autorización judicial');
END;

-- R14/R16: las compras aumentan existencias y recalculan el total de la compra
CREATE TRIGGER trg_detalle_compra_ins
AFTER INSERT ON detalle_compra
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + NEW.cantidad WHERE id_articulo = NEW.id_articulo;
  UPDATE compra SET valor_total = (SELECT COALESCE(SUM(cantidad * costo_unitario), 0) FROM detalle_compra WHERE id_compra = NEW.id_compra)
  WHERE id_compra = NEW.id_compra;
END;

CREATE TRIGGER trg_detalle_compra_upd
AFTER UPDATE ON detalle_compra
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible - OLD.cantidad WHERE id_articulo = OLD.id_articulo;
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + NEW.cantidad WHERE id_articulo = NEW.id_articulo;
  UPDATE compra SET valor_total = (SELECT COALESCE(SUM(cantidad * costo_unitario), 0) FROM detalle_compra WHERE id_compra = compra.id_compra)
  WHERE id_compra IN (OLD.id_compra, NEW.id_compra);
END;

CREATE TRIGGER trg_detalle_compra_del
AFTER DELETE ON detalle_compra
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible - OLD.cantidad WHERE id_articulo = OLD.id_articulo;
  UPDATE compra SET valor_total = (SELECT COALESCE(SUM(cantidad * costo_unitario), 0) FROM detalle_compra WHERE id_compra = OLD.id_compra)
  WHERE id_compra = OLD.id_compra;
END;

-- R15/R32/R34/R35: entregas descuentan existencias; devoluciones de préstamos las reponen
CREATE TRIGGER trg_entrega_stock_suficiente
BEFORE INSERT ON articulo_entregado
WHEN (SELECT cantidad_disponible FROM articulo WHERE id_articulo = NEW.id_articulo) < NEW.cantidad
BEGIN
  SELECT RAISE(ABORT, 'Existencias insuficientes del artículo');
END;

CREATE TRIGGER trg_entrega_devolucion_solo_prestamo
BEFORE INSERT ON articulo_entregado
WHEN (NEW.fecha_devolucion IS NOT NULL OR NEW.id_estado_devolucion IS NOT NULL)
 AND (SELECT nombre FROM modalidad_entrega WHERE id_modalidad_entrega = NEW.id_modalidad_entrega) <> 'Préstamo'
BEGIN
  SELECT RAISE(ABORT, 'Solo los artículos prestados registran devolución');
END;

CREATE TRIGGER trg_entrega_ins
AFTER INSERT ON articulo_entregado
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible - NEW.cantidad WHERE id_articulo = NEW.id_articulo;
END;

-- Préstamo registrado ya devuelto: se repone de inmediato
CREATE TRIGGER trg_entrega_ins_devuelto
AFTER INSERT ON articulo_entregado
WHEN NEW.fecha_devolucion IS NOT NULL
 AND COALESCE((SELECT nombre FROM estado_devolucion WHERE id_estado_devolucion = NEW.id_estado_devolucion), '') <> 'No devuelto'
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + NEW.cantidad WHERE id_articulo = NEW.id_articulo;
END;

CREATE TRIGGER trg_entrega_cambio_cantidad
AFTER UPDATE OF id_articulo, cantidad ON articulo_entregado
WHEN OLD.fecha_devolucion IS NULL AND NEW.fecha_devolucion IS NULL
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + OLD.cantidad WHERE id_articulo = OLD.id_articulo;
  UPDATE articulo SET cantidad_disponible = cantidad_disponible - NEW.cantidad WHERE id_articulo = NEW.id_articulo;
END;

CREATE TRIGGER trg_entrega_devolucion
AFTER UPDATE OF fecha_devolucion ON articulo_entregado
WHEN OLD.fecha_devolucion IS NULL AND NEW.fecha_devolucion IS NOT NULL
 AND (SELECT nombre FROM modalidad_entrega WHERE id_modalidad_entrega = NEW.id_modalidad_entrega) = 'Préstamo'
 AND COALESCE((SELECT nombre FROM estado_devolucion WHERE id_estado_devolucion = NEW.id_estado_devolucion), '') <> 'No devuelto'
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + NEW.cantidad WHERE id_articulo = NEW.id_articulo;
END;

CREATE TRIGGER trg_entrega_del
AFTER DELETE ON articulo_entregado
WHEN OLD.fecha_devolucion IS NULL
BEGIN
  UPDATE articulo SET cantidad_disponible = cantidad_disponible + OLD.cantidad WHERE id_articulo = OLD.id_articulo;
END;

-- R17/R18/R19: totales de la factura desde su detalle y estado según pagos
CREATE TRIGGER trg_detalle_factura_ins
AFTER INSERT ON detalle_factura
BEGIN
  UPDATE factura SET
    valor_total = (SELECT COALESCE(SUM(valor_concepto), 0) FROM detalle_factura WHERE id_factura = NEW.id_factura),
    valor_cubierto_poliza = (SELECT COALESCE(SUM(valor_cubierto), 0) FROM detalle_factura WHERE id_factura = NEW.id_factura),
    valor_a_cargo_cliente = (SELECT COALESCE(SUM(valor_cliente), 0) FROM detalle_factura WHERE id_factura = NEW.id_factura)
  WHERE id_factura = NEW.id_factura;
  UPDATE factura SET id_estado_factura = CASE
      WHEN id_estado_factura = (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Anulada') THEN id_estado_factura
      WHEN valor_total > 0 AND (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_factura WHERE id_factura = factura.id_factura) >= valor_a_cargo_cliente
        THEN (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pagada')
      ELSE (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pendiente') END
  WHERE id_factura = NEW.id_factura;
END;

CREATE TRIGGER trg_detalle_factura_upd
AFTER UPDATE ON detalle_factura
BEGIN
  UPDATE factura SET
    valor_total = (SELECT COALESCE(SUM(valor_concepto), 0) FROM detalle_factura WHERE id_factura = factura.id_factura),
    valor_cubierto_poliza = (SELECT COALESCE(SUM(valor_cubierto), 0) FROM detalle_factura WHERE id_factura = factura.id_factura),
    valor_a_cargo_cliente = (SELECT COALESCE(SUM(valor_cliente), 0) FROM detalle_factura WHERE id_factura = factura.id_factura)
  WHERE id_factura IN (OLD.id_factura, NEW.id_factura);
  UPDATE factura SET id_estado_factura = CASE
      WHEN id_estado_factura = (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Anulada') THEN id_estado_factura
      WHEN valor_total > 0 AND (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_factura WHERE id_factura = factura.id_factura) >= valor_a_cargo_cliente
        THEN (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pagada')
      ELSE (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pendiente') END
  WHERE id_factura IN (OLD.id_factura, NEW.id_factura);
END;

CREATE TRIGGER trg_detalle_factura_del
AFTER DELETE ON detalle_factura
BEGIN
  UPDATE factura SET
    valor_total = (SELECT COALESCE(SUM(valor_concepto), 0) FROM detalle_factura WHERE id_factura = OLD.id_factura),
    valor_cubierto_poliza = (SELECT COALESCE(SUM(valor_cubierto), 0) FROM detalle_factura WHERE id_factura = OLD.id_factura),
    valor_a_cargo_cliente = (SELECT COALESCE(SUM(valor_cliente), 0) FROM detalle_factura WHERE id_factura = OLD.id_factura)
  WHERE id_factura = OLD.id_factura;
  UPDATE factura SET id_estado_factura = CASE
      WHEN id_estado_factura = (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Anulada') THEN id_estado_factura
      WHEN valor_total > 0 AND (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_factura WHERE id_factura = factura.id_factura) >= valor_a_cargo_cliente
        THEN (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pagada')
      ELSE (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pendiente') END
  WHERE id_factura = OLD.id_factura;
END;

CREATE TRIGGER trg_pago_factura_anulada
BEFORE INSERT ON pago_factura
WHEN (SELECT e.nombre FROM factura f JOIN estado_factura e ON e.id_estado_factura = f.id_estado_factura
      WHERE f.id_factura = NEW.id_factura) = 'Anulada'
BEGIN
  SELECT RAISE(ABORT, 'No se pueden registrar pagos sobre una factura anulada');
END;

CREATE TRIGGER trg_pago_factura_ins
AFTER INSERT ON pago_factura
BEGIN
  UPDATE factura SET id_estado_factura = CASE
      WHEN id_estado_factura = (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Anulada') THEN id_estado_factura
      WHEN (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_factura WHERE id_factura = factura.id_factura) >= valor_a_cargo_cliente
        THEN (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pagada')
      ELSE (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pendiente') END
  WHERE id_factura = NEW.id_factura;
END;

CREATE TRIGGER trg_pago_factura_del
AFTER DELETE ON pago_factura
BEGIN
  UPDATE factura SET id_estado_factura = CASE
      WHEN id_estado_factura = (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Anulada') THEN id_estado_factura
      WHEN valor_total > 0 AND (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_factura WHERE id_factura = factura.id_factura) >= valor_a_cargo_cliente
        THEN (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pagada')
      ELSE (SELECT id_estado_factura FROM estado_factura WHERE nombre = 'Pendiente') END
  WHERE id_factura = OLD.id_factura;
END;
