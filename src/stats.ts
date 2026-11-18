// Métricas agregadas para el Dashboard (GET /api/stats).
import type { Row } from './types';

export async function getStats(db: D1Database) {
  const q = (sql: string) => db.prepare(sql);
  const [kpi, polizas, eventosMes, topServicios, stockBajo, recursos, facturas, actividad] = await db.batch<Row>([
    q(`SELECT
         (SELECT COUNT(*) FROM persona) AS personas,
         (SELECT COUNT(*) FROM titular) AS titulares,
         (SELECT COUNT(*) FROM beneficiario) AS beneficiarios,
         (SELECT COUNT(*) FROM poliza p JOIN estado_poliza e ON e.id_estado_poliza = p.id_estado_poliza WHERE e.nombre = 'Activa') AS polizas_activas,
         (SELECT COUNT(*) FROM evento_fallecimiento) AS eventos_total,
         (SELECT COUNT(*) FROM evento_fallecimiento WHERE strftime('%Y-%m', fecha_fallecimiento) = strftime('%Y-%m', 'now')) AS eventos_mes,
         (SELECT COUNT(*) FROM evento_fallecimiento WHERE es_servicio_particular = 1) AS eventos_particulares,
         (SELECT COALESCE(SUM(valor_pagado), 0) FROM pago_prima WHERE fecha_pago >= date('now', '-12 months')) AS recaudo_primas_12m,
         (SELECT COUNT(*) FROM servicio_prestado s JOIN estado_servicio e ON e.id_estado_servicio = s.id_estado_servicio
            WHERE e.nombre IN ('Programado', 'En curso')) AS servicios_en_proceso,
         (SELECT COUNT(*) FROM articulo_entregado a JOIN modalidad_entrega m ON m.id_modalidad_entrega = a.id_modalidad_entrega
            WHERE m.nombre = 'Préstamo' AND a.fecha_devolucion IS NULL) AS prestamos_pendientes`),
    q(`SELECT e.nombre AS estado, COUNT(p.id_poliza) AS total FROM estado_poliza e
         LEFT JOIN poliza p ON p.id_estado_poliza = e.id_estado_poliza GROUP BY e.id_estado_poliza ORDER BY e.id_estado_poliza`),
    q(`SELECT strftime('%Y-%m', fecha_fallecimiento) AS mes, COUNT(*) AS total FROM evento_fallecimiento
         WHERE fecha_fallecimiento >= date('now', 'start of month', '-11 months') GROUP BY mes ORDER BY mes`),
    q(`SELECT sf.nombre_servicio AS servicio, COUNT(*) AS total FROM servicio_prestado sp
         JOIN servicio_funerario sf ON sf.id_servicio_funerario = sp.id_servicio_funerario
         GROUP BY sp.id_servicio_funerario ORDER BY total DESC, servicio LIMIT 6`),
    q(`SELECT a.codigo, a.nombre_articulo, a.cantidad_disponible, c.nombre AS categoria FROM articulo a
         JOIN categoria_articulo c ON c.id_categoria_articulo = a.id_categoria_articulo
         WHERE a.cantidad_disponible <= 3 ORDER BY a.cantidad_disponible, a.nombre_articulo LIMIT 10`),
    q(`SELECT
         (SELECT COUNT(*) FROM vehiculo WHERE esta_disponible = 1) AS vehiculos_disponibles,
         (SELECT COUNT(*) FROM vehiculo) AS vehiculos_total,
         (SELECT COUNT(*) FROM instalacion WHERE esta_disponible = 1) AS instalaciones_disponibles,
         (SELECT COUNT(*) FROM instalacion) AS instalaciones_total,
         (SELECT COUNT(*) FROM empleado) AS empleados`),
    q(`SELECT ef.nombre AS estado, COUNT(f.id_factura) AS total,
         COALESCE(SUM(f.valor_total), 0) AS valor_total,
         COALESCE(SUM(f.valor_cubierto_poliza), 0) AS valor_cubierto,
         COALESCE(SUM(f.valor_a_cargo_cliente), 0) AS valor_cliente,
         COALESCE(SUM(f.valor_a_cargo_cliente - (SELECT COALESCE(SUM(pf.valor_pagado), 0) FROM pago_factura pf WHERE pf.id_factura = f.id_factura)), 0) AS saldo
       FROM estado_factura ef LEFT JOIN factura f ON f.id_estado_factura = ef.id_estado_factura
       GROUP BY ef.id_estado_factura ORDER BY ef.id_estado_factura`),
    q(`SELECT b.id_bitacora, b.fecha_hora, b.tabla_afectada, b.id_registro_afectado, o.nombre AS operacion,
         COALESCE(u.nombre_usuario, 'sistema') AS usuario
       FROM bitacora_auditoria b JOIN tipo_operacion o ON o.id_tipo_operacion = b.id_tipo_operacion
       LEFT JOIN usuario u ON u.id_usuario = b.id_usuario ORDER BY b.fecha_hora DESC, b.id_bitacora DESC LIMIT 8`),
  ]);
  return {
    kpi: kpi.results[0],
    polizasPorEstado: polizas.results,
    eventosPorMes: eventosMes.results,
    topServicios: topServicios.results,
    stockBajo: stockBajo.results,
    recursos: recursos.results[0],
    facturas: facturas.results,
    actividadReciente: actividad.results,
  };
}

export type Stats = Awaited<ReturnType<typeof getStats>>;
