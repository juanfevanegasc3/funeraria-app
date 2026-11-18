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
