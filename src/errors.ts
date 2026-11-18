// Traduce errores de SQLite/D1 a respuestas HTTP con mensajes en español.

export class HttpError extends Error {
  constructor(public status: 400 | 404 | 409 | 500, message: string) {
    super(message);
  }
}

export function translateDbError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;
  const raw = err instanceof Error ? err.message : String(err);
  // Formato D1: "D1_ERROR: <mensaje>: SQLITE_CONSTRAINT (extended: ...) <mensaje repetido>"
  const msg = raw.replace(/^D1_ERROR:\s*/i, '').split(/:\s*SQLITE_/)[0].trim();

  let m = msg.match(/^UNIQUE constraint failed: (.+)$/);
  if (m) return new HttpError(409, `Ya existe un registro con el mismo valor en: ${m[1].replace(/\w+\./g, '')}`);
  if (/FOREIGN KEY constraint failed/.test(msg)) {
    return new HttpError(409, 'Operación rechazada por integridad referencial: el registro está relacionado con otros datos o la referencia no existe.');
  }
  m = msg.match(/^NOT NULL constraint failed: \w+\.(\w+)$/);
  if (m) return new HttpError(400, `El campo ${m[1]} es obligatorio.`);
  m = msg.match(/^CHECK constraint failed: (.+)$/);
  if (m) return new HttpError(400, `Valor no válido (regla: ${m[1]}).`);
  // Mensajes de RAISE(ABORT, '...') de los triggers de reglas de negocio
  if (/SQLITE_CONSTRAINT/.test(raw) && msg) return new HttpError(400, msg);
  console.error('Error de base de datos:', raw);
  return new HttpError(500, 'Error interno de base de datos.');
}
