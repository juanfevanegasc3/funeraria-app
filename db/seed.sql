-- =====================================================================
-- Datos de prueba - Sistema de gestión funeraria
-- Ejecutar DESPUÉS de db/schema.sql. Los IDs son explícitos para que
-- las llaves foráneas sean legibles. Las existencias de inventario, los
-- totales de compras/facturas y el estado de las facturas los calculan
-- los triggers del esquema.
-- Usuarios de prueba (clave para todos: Funeraria2026!  -> SHA-256)
-- =====================================================================
PRAGMA foreign_keys = ON;

-- ---------------- Tablas estáticas (catálogos) ----------------
INSERT INTO tipo_documento (id_tipo_documento, nombre, sigla) VALUES
 (1, 'Cédula de ciudadanía', 'CC'), (2, 'Tarjeta de identidad', 'TI'), (3, 'Cédula de extranjería', 'CE'),
 (4, 'Registro civil', 'RC'), (5, 'Pasaporte', 'PA');

INSERT INTO parentesco (id_parentesco, nombre) VALUES
 (1, 'Cónyuge / compañero(a)'), (2, 'Hijo(a)'), (3, 'Padre'), (4, 'Madre'), (5, 'Hermano(a)'),
 (6, 'Abuelo(a)'), (7, 'Nieto(a)'), (8, 'Suegro(a)'), (9, 'Otro');

INSERT INTO tipo_poliza (id_tipo_poliza, nombre) VALUES (1, 'Individual'), (2, 'Colectiva');
INSERT INTO estado_poliza (id_estado_poliza, nombre) VALUES (1, 'Activa'), (2, 'Vencida'), (3, 'Suspendida'), (4, 'Cancelada');
INSERT INTO periodicidad_cobro (id_periodicidad_cobro, nombre, meses_por_ciclo) VALUES
 (1, 'Mensual', 1), (2, 'Trimestral', 3), (3, 'Semestral', 6), (4, 'Anual', 12), (5, 'Bianual', 24);
INSERT INTO metodo_pago (id_metodo_pago, nombre) VALUES
 (1, 'Efectivo'), (2, 'Transferencia'), (3, 'Tarjeta débito'), (4, 'Tarjeta crédito'), (5, 'PSE'), (6, 'Descuento por nómina');
INSERT INTO tipo_muerte (id_tipo_muerte, nombre) VALUES (1, 'Natural'), (2, 'Violenta'), (3, 'En estudio');
INSERT INTO tipo_institucion (id_tipo_institucion, nombre) VALUES
 (1, 'Hospital / clínica'), (2, 'Medicina Legal'), (3, 'Morgue'), (4, 'Otra IPS');
INSERT INTO motivo_restriccion (id_motivo_restriccion, nombre) VALUES
 (1, 'Muerte violenta'), (2, 'Riña'), (3, 'Investigación judicial'), (4, 'Muerte en estudio');
INSERT INTO tipo_oficina (id_tipo_oficina, nombre) VALUES (1, 'Notaría'), (2, 'Registraduría');
INSERT INTO categoria_servicio (id_categoria_servicio, nombre) VALUES (1, 'Básico'), (2, 'Complementario');
INSERT INTO religion (id_religion, nombre) VALUES
 (1, 'Católica'), (2, 'Cristiana evangélica'), (3, 'Testigo de Jehová'), (4, 'Judía'), (5, 'Otra / ninguna');
INSERT INTO region_atencion (id_region_atencion, nombre, departamento) VALUES
 (1, 'Zona urbana', 'Antioquia'), (2, 'Zona metropolitana', 'Antioquia'), (3, 'Zona rural', 'Antioquia'), (4, 'Otro municipio', 'Antioquia');
INSERT INTO estado_servicio (id_estado_servicio, nombre) VALUES (1, 'Programado'), (2, 'En curso'), (3, 'Prestado'), (4, 'Cancelado');
INSERT INTO responsabilidad (id_responsabilidad, nombre, descripcion) VALUES
 (1, 'Conductor', 'Conduce la carroza o el bus asignado'),
 (2, 'Ayudante', 'Apoya traslados y montaje de salas'),
 (3, 'Tanatopraxia', 'Preparación y conservación del cuerpo'),
 (4, 'Administrativo', 'Coordinación y atención a la familia'),
 (5, 'Operario de cementerio', 'Apertura de fosa, inhumación y cierre'),
 (6, 'Trámites legales', 'Gestión de registro civil y permisos');
INSERT INTO cargo (id_cargo, nombre) VALUES
 (1, 'Conductor'), (2, 'Ayudante'), (3, 'Administrativo'), (4, 'Asesor'), (5, 'Facturador'), (6, 'Operario de cementerio');
INSERT INTO tipo_vehiculo (id_tipo_vehiculo, nombre) VALUES (1, 'Carroza normal'), (2, 'Carroza de lujo'), (3, 'Bus de acompañantes');
INSERT INTO tipo_instalacion (id_tipo_instalacion, nombre) VALUES (1, 'Sala de velación'), (2, 'Cementerio'), (3, 'Horno crematorio'), (4, 'Capilla');
INSERT INTO tipo_sede (id_tipo_sede, nombre) VALUES (1, 'Administrativa'), (2, 'Cementerio');
INSERT INTO categoria_articulo (id_categoria_articulo, nombre) VALUES
 (1, 'Ataúd / cofre'), (2, 'Urna'), (3, 'Elemento prestable'), (4, 'Insumo de preparación del cuerpo');
INSERT INTO material (id_material, nombre) VALUES (1, 'Madera'), (2, 'MDF'), (3, 'Metal'), (4, 'Cerámica'), (5, 'Biodegradable');
INSERT INTO modalidad_entrega (id_modalidad_entrega, nombre) VALUES (1, 'Venta'), (2, 'Préstamo'), (3, 'Consumo');
INSERT INTO estado_devolucion (id_estado_devolucion, nombre) VALUES
 (1, 'Pendiente'), (2, 'Devuelto en buen estado'), (3, 'Devuelto con daños'), (4, 'No devuelto');
INSERT INTO estado_factura (id_estado_factura, nombre) VALUES (1, 'Pendiente'), (2, 'Pagada'), (3, 'Anulada');
INSERT INTO rol (id_rol, nombre) VALUES (1, 'Administrador'), (2, 'Asesor'), (3, 'Facturación');
INSERT INTO permiso (id_permiso, nombre, descripcion) VALUES
 (1, 'gestionar_polizas', 'Crear y modificar titulares, pólizas y beneficiarios'),
 (2, 'registrar_eventos', 'Registrar fallecimientos, documentos y servicios'),
 (3, 'gestionar_inventario', 'Compras, existencias y entregas de artículos'),
 (4, 'facturar', 'Emitir facturas y registrar pagos'),
 (5, 'administrar_usuarios', 'Usuarios, roles y permisos'),
 (6, 'consultar_auditoria', 'Consultar la bitácora de cambios');
INSERT INTO tipo_operacion (id_tipo_operacion, nombre) VALUES (1, 'Inserción'), (2, 'Actualización'), (3, 'Eliminación');

-- ---------------- Personas (supertipo) ----------------
INSERT INTO persona (id_persona, id_tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, telefono, direccion, correo_electronico) VALUES
 (1, 1, '1020304050', 'Carlos Andrés', 'Restrepo Gómez', '1968-03-12', '3104567890', 'Cra 45 # 52-30, Medellín', 'carlos.restrepo@correo.com'),
 (2, 1, '43555666', 'María Elena', 'Cardona de Restrepo', '1970-07-21', '3112223344', 'Cra 45 # 52-30, Medellín', 'maria.cardona@correo.com'),
 (3, 2, '1001234567', 'Juan Pablo', 'Restrepo Cardona', '2010-01-15', NULL, 'Cra 45 # 52-30, Medellín', NULL),
 (4, 1, '21444555', 'Rosa Amelia', 'Gómez de Restrepo', '1941-11-02', '6044441122', 'Calle 50 # 40-12, Medellín', NULL),
 (5, 1, '71888999', 'Luis Fernando', 'Ospina Vélez', '1965-05-30', '3001112233', 'Calle 10 Sur # 43-80, Envigado', 'lospina@empresa.co'),
 (6, 1, '32111222', 'Gloria Patricia', 'Arango de Ospina', '1967-09-09', '3009998877', 'Calle 10 Sur # 43-80, Envigado', 'gloria.arango@correo.com'),
 (7, 1, '8123456', 'Jorge Emilio', 'Ospina Arango', '1938-02-18', NULL, 'Calle 10 Sur # 43-80, Envigado', NULL),
 (8, 1, '98765432', 'Ana Lucía', 'Martínez Ríos', '1980-12-01', '3157778899', 'Diagonal 55 # 30-21, Bello', 'ana.martinez@correo.com'),
 (9, 1, '15333444', 'Pedro Nel', 'Martínez Ruiz', '1950-04-27', '3123334455', 'Diagonal 55 # 30-21, Bello', NULL),
 (10, 1, '70111222', 'Hernán Darío', 'Zapata Cano', '1985-08-14', NULL, 'Vereda La Esperanza, Guarne', NULL),
 (11, 1, '1037888999', 'Sandra Milena', 'Zapata Cano', '1990-03-03', '3205556677', 'Vereda La Esperanza, Guarne', 'sandra.zapata@correo.com'),
 (12, 1, '39444555', 'Beatriz Elena', 'Ospina Arango', '1962-06-25', '3016665544', 'Calle 37 Sur # 27-15, Envigado', NULL),
 (13, 1, '1152000111', 'Camila', 'Restrepo Cardona', '2001-10-10', '3049990011', 'Cra 45 # 52-30, Medellín', 'camila.restrepo@correo.com'),
 (14, 3, '456789', 'Diego', 'Fernández Paredes', '1975-01-19', '3189990000', 'Cra 70 # 1-45, Medellín', 'diego.fernandez@correo.com'),
 (15, 1, '42777888', 'Lucía', 'Torres de Fernández', '1977-04-04', '3189990001', 'Cra 70 # 1-45, Medellín', NULL);

-- ---------------- Titulares (subtipo) ----------------
INSERT INTO titular (id_persona, fecha_afiliacion) VALUES
 (1, '2021-01-20'), (5, '2022-06-01'), (8, '2023-01-05'), (14, '2019-04-22');

-- ---------------- Planes, servicios y coberturas ----------------
INSERT INTO plan_exequial (id_plan_exequial, nombre_plan, descripcion, valor_base_prima) VALUES
 (1, 'Plan Básico', 'Velación, traslado, inhumación, trámites y preparación del cuerpo', 45000),
 (2, 'Plan Familiar Plus', 'Cobertura completa incluida cremación, flores y apoyo psicológico (50%)', 75000),
 (3, 'Plan Empresarial Colectivo', 'Plan colectivo con tarifa diferenciada por integrante', 60000);

INSERT INTO servicio_funerario (id_servicio_funerario, id_categoria_servicio, id_religion, nombre_servicio, valor_base) VALUES
 (1, 1, NULL, 'Sala de velación (24 horas)', 1200000),
 (2, 1, NULL, 'Traslado del cuerpo', 450000),
 (3, 1, NULL, 'Cremación', 2500000),
 (4, 1, NULL, 'Inhumación', 1800000),
 (5, 1, NULL, 'Apertura de fosa o bóveda', 600000),
 (6, 1, NULL, 'Trámites legales', 300000),
 (7, 1, NULL, 'Arreglo floral', 250000),
 (8, 1, NULL, 'Tanatopraxia (preparación del cuerpo)', 700000),
 (9, 2, NULL, 'Atención psicológica en duelo', 350000),
 (10, 2, 1, 'Misa exequial', 400000),
 (11, 2, 2, 'Culto cristiano de despedida', 380000),
 (12, 1, NULL, 'Transporte de acompañantes (bus)', 500000);

INSERT INTO cobertura_plan (id_plan_exequial, id_servicio_funerario, porcentaje_cobertura, tope_valor_cubierto) VALUES
 (1, 1, 100, NULL), (1, 2, 100, NULL), (1, 4, 100, 1800000), (1, 6, 100, NULL), (1, 8, 100, NULL),
 (2, 1, 100, NULL), (2, 2, 100, NULL), (2, 3, 100, NULL), (2, 4, 100, NULL), (2, 5, 100, NULL),
 (2, 6, 100, NULL), (2, 7, 100, NULL), (2, 8, 100, NULL), (2, 9, 50, 175000), (2, 12, 100, NULL),
 (3, 1, 100, NULL), (3, 2, 100, NULL), (3, 3, 100, NULL), (3, 4, 100, NULL), (3, 6, 100, NULL),
 (3, 8, 100, NULL), (3, 7, 50, 125000), (3, 10, 100, NULL);

INSERT INTO tarifa_servicio_region (id_servicio_funerario, id_region_atencion, valor_tarifa, vigente_desde) VALUES
 (1, 1, 1200000, '2026-01-01'), (1, 2, 1250000, '2026-01-01'), (1, 3, 1100000, '2026-01-01'),
 (2, 1, 450000, '2026-01-01'), (2, 2, 480000, '2026-01-01'), (2, 3, 520000, '2026-01-01'),
 (3, 1, 2500000, '2026-01-01'), (3, 2, 2500000, '2026-01-01'),
 (4, 1, 1800000, '2026-01-01'), (4, 2, 1850000, '2026-01-01'), (4, 3, 1800000, '2026-01-01'),
 (6, 1, 300000, '2026-01-01'), (6, 3, 300000, '2026-01-01');

-- ---------------- Pólizas y grupo familiar ----------------
INSERT INTO poliza (id_poliza, id_persona_titular, id_plan_exequial, id_tipo_poliza, id_estado_poliza, id_periodicidad_cobro, numero_poliza, fecha_inicio, fecha_fin_vigencia, valor_prima) VALUES
 (1, 1, 2, 1, 1, 1, 'POL-2021-0001', '2021-02-01', '2027-01-31', 75000),
 (2, 5, 3, 2, 1, 4, 'POL-2022-0002', '2022-06-15', '2027-06-14', 820000),
 (3, 8, 1, 1, 3, 1, 'POL-2023-0003', '2023-01-10', '2026-12-31', 45000),
 (4, 14, 1, 1, 2, 5, 'POL-2019-0004', '2019-05-01', '2025-04-30', 980000);

INSERT INTO beneficiario (id_persona, id_poliza, id_parentesco, tarifa_diferenciada, fecha_inclusion) VALUES
 (2, 1, 1, NULL, '2021-02-01'), (3, 1, 2, NULL, '2021-02-01'), (4, 1, 4, NULL, '2021-02-01'), (13, 1, 2, NULL, '2022-03-15'),
 (6, 2, 1, 180000, '2022-06-15'), (7, 2, 3, 240000, '2022-06-15'), (12, 2, 5, 160000, '2023-02-01'),
 (9, 3, 3, NULL, '2023-01-10'), (15, 4, 1, NULL, '2019-05-01');

INSERT INTO anio_cobro_poliza (id_poliza, anio, es_anio_cobrable) VALUES
 (1, 2021, 1), (1, 2022, 1), (1, 2023, 1), (1, 2024, 1), (1, 2025, 1), (1, 2026, 1),
 (2, 2022, 1), (2, 2023, 1), (2, 2024, 1), (2, 2025, 1), (2, 2026, 1),
 (3, 2023, 1), (3, 2024, 1), (3, 2025, 1), (3, 2026, 1),
 (4, 2019, 1), (4, 2020, 0), (4, 2021, 1), (4, 2022, 0), (4, 2023, 1), (4, 2024, 0);

INSERT INTO pago_prima (id_poliza, id_metodo_pago, fecha_pago, valor_pagado, periodo_cubierto) VALUES
 (1, 5, '2026-08-03', 75000, '2026-08'), (1, 5, '2026-09-02', 75000, '2026-09'),
 (1, 5, '2026-10-01', 75000, '2026-10'), (1, 5, '2026-11-03', 75000, '2026-11'),
 (2, 6, '2025-06-10', 780000, '2025'), (2, 6, '2026-06-12', 820000, '2026'),
 (3, 1, '2026-05-06', 45000, '2026-05'), (3, 1, '2026-06-04', 45000, '2026-06'),
 (4, 2, '2023-04-28', 950000, '2023-2024');

-- ---------------- Sedes, personal, recursos ----------------
INSERT INTO sede (id_sede, id_tipo_sede, nombre_sede, direccion) VALUES
 (1, 1, 'Sede Principal Centro', 'Calle 52 # 47-28, Medellín'),
 (2, 1, 'Sede Norte', 'Diagonal 50 # 38-10, Bello'),
 (3, 2, 'Cementerio Jardines de la Paz', 'Km 4 vía Las Palmas, Envigado');

INSERT INTO instalacion (id_instalacion, id_sede, id_tipo_instalacion, nombre_instalacion, capacidad_personas, esta_disponible) VALUES
 (1, 1, 1, 'Sala de velación 1', 80, 1), (2, 1, 1, 'Sala de velación 2', 60, 0),
 (3, 2, 1, 'Sala VIP Norte', 120, 1), (4, 1, 4, 'Capilla San José', 100, 1),
 (5, 3, 2, 'Lote de bóvedas A', NULL, 1), (6, 3, 3, 'Horno crematorio 1', NULL, 1);

INSERT INTO empleado (id_empleado, id_sede, id_cargo, numero_documento, nombres, apellidos, telefono) VALUES
 (1, 1, 1, '71222333', 'Andrés', 'Gil Patiño', '3101230001'),
 (2, 2, 1, '71444555', 'Felipe', 'Ruiz Mesa', '3101230002'),
 (3, 1, 2, '43888777', 'Natalia', 'Gómez Úsuga', '3101230003'),
 (4, 1, 3, '43222111', 'Marcela', 'Torres Henao', '3101230004'),
 (5, 1, 4, '1036111222', 'Sofía', 'Hernández Lopera', '3101230005'),
 (6, 1, 5, '98111000', 'Ricardo', 'López Arboleda', '3101230006'),
 (7, 3, 6, '70999888', 'Óscar', 'Muñoz Rendón', '3101230007'),
 (8, 1, 3, '43000999', 'Laura', 'Vélez Correa', '3101230008');

INSERT INTO vehiculo (id_vehiculo, id_tipo_vehiculo, placa, capacidad_pasajeros, esta_disponible) VALUES
 (1, 1, 'FUN-101', 2, 1), (2, 2, 'FUN-202', 2, 1), (3, 3, 'BUS-303', 30, 1), (4, 1, 'FUN-104', 2, 0);

INSERT INTO usuario (id_usuario, id_rol, id_empleado, nombre_usuario, clave_hash, esta_activo) VALUES
 (1, 1, 8, 'lvelez', '19b5d5d5d0b4d368d9ddc3bc20db1fef11b908d63b08c1380fbe344a9dbb59dd', 1),
 (2, 2, 5, 'shernandez', '19b5d5d5d0b4d368d9ddc3bc20db1fef11b908d63b08c1380fbe344a9dbb59dd', 1),
 (3, 3, 6, 'rlopez', '19b5d5d5d0b4d368d9ddc3bc20db1fef11b908d63b08c1380fbe344a9dbb59dd', 1);

INSERT INTO rol_permiso (id_rol, id_permiso) VALUES
 (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (2, 1), (2, 2), (3, 4), (3, 6);

-- ---------------- Documentación legal: entidades ----------------
INSERT INTO institucion_emisora (id_institucion, id_tipo_institucion, nombre_institucion, nit) VALUES
 (1, 1, 'Hospital San Rafael de Medellín', '890900001-1'),
 (2, 2, 'Medicina Legal - Seccional Valle de Aburrá', '899999002-2'),
 (3, 1, 'Clínica Santa María del Rosario', '890900003-3');

INSERT INTO medico (id_medico, id_institucion, nombre_completo, registro_medico) VALUES
 (1, 1, 'Juliana Mejía Toro', 'RM-05-12345'),
 (2, 3, 'Andrés Felipe Cárdenas Ríos', 'RM-05-67890'),
 (3, 2, 'Mauricio Salazar Quintero', 'RM-05-24680');

INSERT INTO oficina_registro_civil (id_oficina_registro, id_tipo_oficina, nombre_oficina, ciudad) VALUES
 (1, 1, 'Notaría 15', 'Medellín'), (2, 2, 'Registraduría Auxiliar', 'Envigado'), (3, 1, 'Notaría Única', 'Guarne');

-- ---------------- Inventario: proveedores y compras ----------------
INSERT INTO proveedor (id_proveedor, nit, razon_social, telefono, correo_electronico) VALUES
 (1, '900111222-1', 'Maderas y Cofres del Valle S.A.S.', '6043210001', 'ventas@cofresdelvalle.co'),
 (2, '900333444-2', 'Insumos Tanatológicos de Colombia S.A.S.', '6043210002', 'pedidos@insumostanato.co'),
 (3, '900555666-3', 'Floristería y Decoración El Edén', '6043210003', 'contacto@eleden.co');

INSERT INTO articulo (id_articulo, id_categoria_articulo, id_material, codigo, nombre_articulo, precio_venta, cantidad_disponible) VALUES
 (1, 1, 1, 'ATA-001', 'Cofre en roble tallado', 3800000, 0),
 (2, 1, 2, 'ATA-002', 'Cofre estándar MDF', 1500000, 0),
 (3, 1, 3, 'ATA-003', 'Cofre de lujo metálico', 6500000, 0),
 (4, 2, 4, 'URN-001', 'Urna en cerámica', 650000, 0),
 (5, 2, 5, 'URN-002', 'Urna biodegradable', 420000, 0),
 (6, 3, 1, 'PRE-001', 'Reclinatorio en madera', 0, 0),
 (7, 3, 3, 'PRE-002', 'Florero de pedestal', 0, 0),
 (8, 3, 4, 'PRE-003', 'Imagen religiosa', 0, 0),
 (9, 4, NULL, 'INS-001', 'Kit de tanatopraxia', 180000, 0),
 (10, 4, NULL, 'INS-002', 'Fluido conservante (litro)', 45000, 0);

INSERT INTO compra (id_compra, id_proveedor, fecha_compra) VALUES
 (1, 1, '2026-09-02'), (2, 2, '2026-09-15'), (3, 1, '2026-10-01');

INSERT INTO detalle_compra (id_compra, id_articulo, cantidad, costo_unitario) VALUES
 (1, 1, 4, 2400000), (1, 2, 10, 900000), (1, 3, 2, 4200000),
 (2, 9, 20, 95000), (2, 10, 40, 22000),
 (3, 4, 6, 380000), (3, 5, 8, 230000), (3, 6, 10, 150000), (3, 7, 12, 90000), (3, 8, 6, 120000);

-- ---------------- Eventos de fallecimiento ----------------
-- 1: beneficiaria de la póliza 1 (cubierta). 2: beneficiario de la póliza colectiva 2, muerte violenta con
-- autorización judicial para cremar. 3: servicio particular, riña, cremación restringida sin autorización.
-- 4: beneficiaria de la póliza 2, todo cubierto (factura en cero para el cliente).
INSERT INTO evento_fallecimiento (id_evento, id_persona_fallecida, id_poliza, id_persona_reportante, id_parentesco_reportante, id_region_atencion, fecha_fallecimiento, hora_fallecimiento, lugar_fallecimiento, causa_fallecimiento, es_servicio_particular, fecha_hora_reporte) VALUES
 (1, 4, 1, 1, 2, 1, '2026-10-05', '03:40', 'Hospital San Rafael de Medellín', 'Insuficiencia cardiaca', 0, '2026-10-05 04:10:00'),
 (2, 7, 2, 5, 2, 2, '2026-11-02', '22:15', 'Vía Las Palmas km 12', 'Politraumatismo por accidente de tránsito', 0, '2026-11-03 06:30:00'),
 (3, 10, NULL, 11, 5, 3, '2026-11-14', '23:50', 'Vereda La Esperanza, Guarne', 'Lesiones en riña (en investigación)', 1, '2026-11-15 07:05:00'),
 (4, 12, 2, 6, 5, 1, '2026-11-10', '14:20', 'Domicilio, Envigado', 'Neumonía', 0, '2026-11-10 15:00:00');

INSERT INTO certificado_defuncion (id_evento, id_medico, id_institucion, id_tipo_muerte, numero_certificado, fecha_defuncion, hora_defuncion, lugar_defuncion, causa_muerte) VALUES
 (1, 1, 1, 1, 'CD-2026-0101', '2026-10-05', '03:40', 'Hospital San Rafael de Medellín', 'Insuficiencia cardiaca congestiva'),
 (2, 3, 2, 2, 'CD-2026-0145', '2026-11-02', '22:15', 'Vía Las Palmas km 12', 'Politraumatismo'),
 (3, 3, 2, 2, 'CD-2026-0160', '2026-11-14', '23:50', 'Vereda La Esperanza, Guarne', 'Lesiones por arma cortopunzante'),
 (4, 2, 3, 1, 'CD-2026-0152', '2026-11-10', '14:20', 'Domicilio, Envigado', 'Neumonía adquirida en comunidad');

INSERT INTO acta_necropsia (id_evento, id_institucion, numero_acta, fecha_expedicion) VALUES
 (2, 2, 'AN-2026-0312', '2026-11-03'), (3, 2, 'AN-2026-0330', '2026-11-15');

INSERT INTO restriccion_cremacion (id_evento, id_motivo_restriccion, numero_autorizacion_judicial, juzgado_autorizador, fecha_autorizacion) VALUES
 (2, 1, 'AJ-2026-0778', 'Juzgado 3 Penal Municipal de Medellín', '2026-11-04'),
 (3, 2, NULL, NULL, NULL);

INSERT INTO registro_civil_defuncion (id_evento, id_oficina_registro, id_empleado_gestor, numero_serial, fecha_registro) VALUES
 (1, 1, 4, '09876543', '2026-10-06'), (2, 2, 4, '09876789', '2026-11-04'), (4, 1, 4, '09877001', '2026-11-11');

-- ---------------- Servicios prestados ----------------
INSERT INTO servicio_prestado (id_servicio_prestado, id_evento, id_servicio_funerario, id_instalacion, id_estado_servicio, fecha_hora_prestacion, es_cubierto_poliza, valor_aplicado) VALUES
 (1, 1, 2, NULL, 3, '2026-10-05 05:00:00', 1, 450000),
 (2, 1, 8, NULL, 3, '2026-10-05 07:00:00', 1, 700000),
 (3, 1, 1, 1, 3, '2026-10-05 10:00:00', 1, 1200000),
 (4, 1, 4, 5, 3, '2026-10-06 15:00:00', 1, 1800000),
 (5, 1, 6, NULL, 3, '2026-10-06 09:00:00', 1, 300000),
 (6, 1, 7, NULL, 3, '2026-10-05 09:00:00', 1, 250000),
 (7, 1, 9, NULL, 3, '2026-10-20 16:00:00', 1, 350000),
 (8, 2, 2, NULL, 3, '2026-11-03 18:00:00', 1, 480000),
 (9, 2, 8, NULL, 3, '2026-11-04 08:00:00', 1, 700000),
 (10, 2, 1, 3, 3, '2026-11-04 12:00:00', 1, 1250000),
 (11, 2, 10, 4, 3, '2026-11-05 10:00:00', 1, 400000),
 (12, 2, 3, 6, 3, '2026-11-05 14:00:00', 1, 2500000),
 (13, 2, 12, NULL, 3, '2026-11-05 09:30:00', 0, 500000),
 (14, 3, 2, NULL, 3, '2026-11-15 10:00:00', 0, 520000),
 (15, 3, 1, 2, 2, '2026-11-16 08:00:00', 0, 1100000),
 (16, 3, 4, 5, 1, '2026-11-18 11:00:00', 0, 1800000),
 (17, 3, 6, NULL, 1, '2026-11-17 09:00:00', 0, 300000),
 (18, 4, 2, NULL, 3, '2026-11-10 16:00:00', 1, 450000),
 (19, 4, 8, NULL, 3, '2026-11-10 18:00:00', 1, 700000),
 (20, 4, 1, 1, 3, '2026-11-11 08:00:00', 1, 1200000),
 (21, 4, 4, 5, 3, '2026-11-12 11:00:00', 1, 1800000);

INSERT INTO asignacion_empleado (id_servicio_prestado, id_empleado, id_responsabilidad, fecha_asignacion) VALUES
 (1, 1, 1, '2026-10-05'), (1, 3, 2, '2026-10-05'), (2, 3, 3, '2026-10-05'), (4, 7, 5, '2026-10-06'),
 (5, 4, 6, '2026-10-05'), (8, 2, 1, '2026-11-03'), (9, 3, 3, '2026-11-04'), (12, 7, 5, '2026-11-05'),
 (13, 1, 1, '2026-11-05'), (14, 2, 1, '2026-11-15'), (17, 4, 6, '2026-11-15'), (18, 1, 1, '2026-11-10'),
 (19, 3, 3, '2026-11-10'), (21, 7, 5, '2026-11-12');

INSERT INTO asignacion_vehiculo (id_servicio_prestado, id_vehiculo, fecha_hora_salida, fecha_hora_regreso) VALUES
 (1, 1, '2026-10-05 04:30:00', '2026-10-05 06:00:00'),
 (4, 2, '2026-10-06 14:00:00', '2026-10-06 16:30:00'),
 (8, 2, '2026-11-03 17:00:00', '2026-11-03 19:30:00'),
 (13, 3, '2026-11-05 09:00:00', '2026-11-05 13:00:00'),
 (14, 1, '2026-11-15 09:30:00', NULL),
 (18, 1, '2026-11-10 15:30:00', '2026-11-10 17:00:00'),
 (21, 2, '2026-11-12 10:00:00', '2026-11-12 12:30:00');

-- ---------------- Artículos entregados (venta / préstamo / consumo) ----------------
INSERT INTO articulo_entregado (id_articulo_entregado, id_evento, id_articulo, id_modalidad_entrega, id_estado_devolucion, cantidad, fecha_entrega, fecha_devolucion) VALUES
 (1, 1, 1, 1, NULL, 1, '2026-10-05', NULL),
 (2, 1, 6, 2, 2, 4, '2026-10-05', '2026-10-08'),
 (3, 1, 7, 2, 2, 2, '2026-10-05', '2026-10-08'),
 (4, 1, 9, 3, NULL, 1, '2026-10-05', NULL),
 (5, 1, 10, 3, NULL, 3, '2026-10-05', NULL),
 (6, 2, 5, 1, NULL, 1, '2026-11-05', NULL),
 (7, 2, 3, 2, 2, 1, '2026-11-04', '2026-11-05'),
 (8, 2, 9, 3, NULL, 1, '2026-11-04', NULL),
 (9, 2, 8, 2, 1, 1, '2026-11-04', NULL),
 (10, 3, 2, 1, NULL, 1, '2026-11-15', NULL),
 (11, 3, 10, 3, NULL, 2, '2026-11-15', NULL),
 (12, 3, 6, 2, 1, 2, '2026-11-16', NULL),
 (13, 4, 2, 1, NULL, 1, '2026-11-10', NULL);

-- ---------------- Facturación (totales y estado por trigger) ----------------
INSERT INTO factura (id_factura, id_evento, id_estado_factura, numero_factura, fecha_emision) VALUES
 (1, 1, 1, 'FAC-2026-000101', '2026-10-07'),
 (2, 2, 1, 'FAC-2026-000102', '2026-11-06'),
 (3, 3, 1, 'FAC-2026-000103', '2026-11-16'),
 (4, 4, 1, 'FAC-2026-000104', '2026-11-12');

INSERT INTO detalle_factura (id_factura, id_servicio_prestado, id_articulo_entregado, concepto, valor_concepto, valor_cubierto, valor_cliente) VALUES
 (1, 1, NULL, 'Traslado del cuerpo', 450000, 450000, 0),
 (1, 2, NULL, 'Tanatopraxia', 700000, 700000, 0),
 (1, 3, NULL, 'Sala de velación 1 (24 h)', 1200000, 1200000, 0),
 (1, 4, NULL, 'Inhumación - Lote de bóvedas A', 1800000, 1800000, 0),
 (1, 5, NULL, 'Trámites legales', 300000, 300000, 0),
 (1, 6, NULL, 'Arreglo floral', 250000, 250000, 0),
 (1, 7, NULL, 'Atención psicológica en duelo (50%)', 350000, 175000, 175000),
 (1, NULL, 1, 'Cofre en roble tallado (excedente sobre cofre estándar)', 3800000, 1500000, 2300000),
 (1, NULL, 4, 'Kit de tanatopraxia', 180000, 180000, 0),
 (1, NULL, 5, 'Fluido conservante x3', 135000, 135000, 0),
 (2, 8, NULL, 'Traslado del cuerpo', 480000, 480000, 0),
 (2, 9, NULL, 'Tanatopraxia', 700000, 700000, 0),
 (2, 10, NULL, 'Sala VIP Norte (24 h)', 1250000, 1250000, 0),
 (2, 11, NULL, 'Misa exequial', 400000, 400000, 0),
 (2, 12, NULL, 'Cremación', 2500000, 2500000, 0),
 (2, 13, NULL, 'Transporte de acompañantes (no cubierto)', 500000, 0, 500000),
 (2, NULL, 6, 'Urna biodegradable', 420000, 420000, 0),
 (2, NULL, 8, 'Kit de tanatopraxia', 180000, 180000, 0),
 (3, 14, NULL, 'Traslado del cuerpo (zona rural)', 520000, 0, 520000),
 (3, 15, NULL, 'Sala de velación 2', 1100000, 0, 1100000),
 (3, 17, NULL, 'Trámites legales', 300000, 0, 300000),
 (3, NULL, 10, 'Cofre estándar MDF', 1500000, 0, 1500000),
 (3, NULL, 11, 'Fluido conservante x2', 90000, 0, 90000),
 (4, 18, NULL, 'Traslado del cuerpo', 450000, 450000, 0),
 (4, 19, NULL, 'Tanatopraxia', 700000, 700000, 0),
 (4, 20, NULL, 'Sala de velación 1 (24 h)', 1200000, 1200000, 0),
 (4, 21, NULL, 'Inhumación', 1800000, 1800000, 0),
 (4, NULL, 13, 'Cofre estándar MDF', 1500000, 1500000, 0);

INSERT INTO pago_factura (id_factura, id_metodo_pago, fecha_pago, valor_pagado) VALUES
 (1, 2, '2026-10-07', 1000000), (1, 4, '2026-10-20', 1475000), (2, 1, '2026-11-06', 200000);

-- ---------------- Bitácora de auditoría (histórico de ejemplo) ----------------
INSERT INTO bitacora_auditoria (id_usuario, id_tipo_operacion, fecha_hora, tabla_afectada, id_registro_afectado, valor_anterior, valor_nuevo) VALUES
 (2, 1, '2021-01-20 10:15:00', 'poliza', '1', NULL, '{"numero_poliza":"POL-2021-0001","id_estado_poliza":1}'),
 (2, 2, '2026-06-01 09:00:00', 'poliza', '3', '{"id_estado_poliza":1}', '{"id_estado_poliza":3}'),
 (2, 1, '2026-10-05 04:12:00', 'evento_fallecimiento', '1', NULL, '{"id_persona_fallecida":4,"id_poliza":1}'),
 (3, 1, '2026-10-07 11:30:00', 'factura', '1', NULL, '{"numero_factura":"FAC-2026-000101"}'),
 (3, 1, '2026-10-20 16:40:00', 'pago_factura', '2', NULL, '{"id_factura":1,"valor_pagado":1475000}'),
 (2, 1, '2026-11-15 07:10:00', 'evento_fallecimiento', '3', NULL, '{"id_persona_fallecida":10,"es_servicio_particular":1}');
