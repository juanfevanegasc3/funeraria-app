// Tipos compartidos entre el Worker (src/) y el frontend (web/).

export type ColumnType = 'integer' | 'real' | 'text' | 'boolean' | 'date' | 'time' | 'datetime';

export interface ColumnMeta {
  name: string;
  label: string;
  type: ColumnType;
  /** Obligatorio al crear (NOT NULL sin DEFAULT). */
  required: boolean;
  pk: boolean;
  /** PK autoincremental: la asigna la base de datos. */
  auto: boolean;
  /** Se incluye en la búsqueda de texto libre (?q=). */
  search: boolean;
  /** Tabla referenciada si es llave foránea. */
  fk?: string;
  hasDefault?: boolean;
  /** Valores permitidos por CHECK (catálogos cerrados). */
  options?: string[];
  /** Calculado por triggers: solo lectura en la API. */
  computed?: boolean;
}

export interface TableMeta {
  name: string;
  title: string;
  module: string;
  /** Tabla estática (catálogo). */
  static: boolean;
  /** Los cambios se registran en bitacora_auditoria. */
  audit: boolean;
  pk: string[];
  /** Expresión SQL para el nombre legible; {a} = alias de la tabla. Solo uso interno del Worker. */
  label: string;
  description: string;
  columns: ColumnMeta[];
}

export type PublicTableMeta = Omit<TableMeta, 'label'>;

export type Row = Record<string, unknown>;

export interface ListResponse {
  data: Row[];
  total: number;
  limit: number;
  offset: number;
}

export interface OptionItem {
  value: string;
  label: string;
}
