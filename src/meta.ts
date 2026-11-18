// ARCHIVO GENERADO desde el modelo de datos. Describe tablas, columnas y relaciones.
// La API y el frontend se construyen a partir de estos metadatos (ver AGENTS.md > Reglas de extensión).
import type { TableMeta } from './types';

export const TABLES: TableMeta[] = [
  {
    "name": "tipo_documento",
    "title": "Tipos de documento",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_documento"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_documento",
        "label": "Tipo documento",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "sigla",
        "label": "Sigla",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "parentesco",
    "title": "Parentescos",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_parentesco"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_parentesco",
        "label": "Parentesco",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_poliza",
    "title": "Tipos de póliza",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_poliza"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_poliza",
        "label": "Tipo póliza",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Individual",
          "Colectiva"
        ]
      }
    ]
  },
  {
    "name": "estado_poliza",
    "title": "Estados de póliza",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_estado_poliza"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_estado_poliza",
        "label": "Estado póliza",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Activa",
          "Vencida",
          "Suspendida",
          "Cancelada"
        ]
      }
    ]
  },
  {
    "name": "periodicidad_cobro",
    "title": "Periodicidades de cobro",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_periodicidad_cobro"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_periodicidad_cobro",
        "label": "Periodicidad cobro",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "meses_por_ciclo",
        "label": "Meses por ciclo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "metodo_pago",
    "title": "Métodos de pago",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_metodo_pago"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_metodo_pago",
        "label": "Metodo pago",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_muerte",
    "title": "Tipos de muerte",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_muerte"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_muerte",
        "label": "Tipo muerte",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Natural",
          "Violenta",
          "En estudio"
        ]
      }
    ]
  },
  {
    "name": "tipo_institucion",
    "title": "Tipos de institución",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_institucion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_institucion",
        "label": "Tipo institución",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "motivo_restriccion",
    "title": "Motivos de restricción de cremación",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_motivo_restriccion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_motivo_restriccion",
        "label": "Motivo restricción",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_oficina",
    "title": "Tipos de oficina de registro",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_oficina"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_oficina",
        "label": "Tipo oficina",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Notaría",
          "Registraduría"
        ]
      }
    ]
  },
  {
    "name": "categoria_servicio",
    "title": "Categorías de servicio",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_categoria_servicio"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_categoria_servicio",
        "label": "Categoría servicio",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Básico",
          "Complementario"
        ]
      }
    ]
  },
  {
    "name": "religion",
    "title": "Religiones",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_religion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_religion",
        "label": "Religión",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "region_atencion",
    "title": "Regiones de atención",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_region_atencion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_region_atencion",
        "label": "Región atención",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "departamento",
        "label": "Departamento",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "estado_servicio",
    "title": "Estados de servicio",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_estado_servicio"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_estado_servicio",
        "label": "Estado servicio",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Programado",
          "En curso",
          "Prestado",
          "Cancelado"
        ]
      }
    ]
  },
  {
    "name": "responsabilidad",
    "title": "Responsabilidades",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_responsabilidad"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_responsabilidad",
        "label": "Responsabilidad",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "descripcion",
        "label": "Descripción",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "cargo",
    "title": "Cargos",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_cargo"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_cargo",
        "label": "Cargo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_vehiculo",
    "title": "Tipos de vehículo",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_vehiculo"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_vehiculo",
        "label": "Tipo vehículo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_instalacion",
    "title": "Tipos de instalación",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_instalacion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_instalacion",
        "label": "Tipo instalación",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_sede",
    "title": "Tipos de sede",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_sede"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_sede",
        "label": "Tipo sede",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Administrativa",
          "Cementerio"
        ]
      }
    ]
  },
  {
    "name": "categoria_articulo",
    "title": "Categorías de artículo",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_categoria_articulo"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_categoria_articulo",
        "label": "Categoría artículo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "material",
    "title": "Materiales",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_material"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_material",
        "label": "Material",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "modalidad_entrega",
    "title": "Modalidades de entrega",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_modalidad_entrega"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_modalidad_entrega",
        "label": "Modalidad entrega",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Venta",
          "Préstamo",
          "Consumo"
        ]
      }
    ]
  },
  {
    "name": "estado_devolucion",
    "title": "Estados de devolución",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_estado_devolucion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_estado_devolucion",
        "label": "Estado devolución",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "estado_factura",
    "title": "Estados de factura",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_estado_factura"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_estado_factura",
        "label": "Estado factura",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Pendiente",
          "Pagada",
          "Anulada"
        ]
      }
    ]
  },
  {
    "name": "rol",
    "title": "Roles",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_rol"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_rol",
        "label": "Rol",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Administrador",
          "Asesor",
          "Facturación"
        ]
      }
    ]
  },
  {
    "name": "permiso",
    "title": "Permisos",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_permiso"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_permiso",
        "label": "Permiso",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "descripcion",
        "label": "Descripción",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "tipo_operacion",
    "title": "Tipos de operación",
    "module": "Catálogos",
    "static": true,
    "audit": false,
    "pk": [
      "id_tipo_operacion"
    ],
    "label": "{a}.nombre",
    "description": "",
    "columns": [
      {
        "name": "id_tipo_operacion",
        "label": "Tipo operación",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre",
        "label": "Nombre",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true,
        "options": [
          "Inserción",
          "Actualización",
          "Eliminación"
        ]
      }
    ]
  },
  {
    "name": "persona",
    "title": "Personas",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_persona"
    ],
    "label": "{a}.nombres || ' ' || {a}.apellidos || ' (' || {a}.numero_documento || ')'",
    "description": "Supertipo: datos personales comunes a titulares, beneficiarios, fallecidos y reportantes.",
    "columns": [
      {
        "name": "id_persona",
        "label": "Persona",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_tipo_documento",
        "label": "Tipo documento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_documento"
      },
      {
        "name": "numero_documento",
        "label": "Número documento",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "nombres",
        "label": "Nombres",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "apellidos",
        "label": "Apellidos",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_nacimiento",
        "label": "Fecha nacimiento",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "telefono",
        "label": "Teléfono",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "direccion",
        "label": "Dirección",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "correo_electronico",
        "label": "Correo electrónico",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "titular",
    "title": "Titulares",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_persona"
    ],
    "label": "(SELECT p.nombres || ' ' || p.apellidos FROM persona p WHERE p.id_persona = {a}.id_persona)",
    "description": "Subtipo de PERSONA (herencia): quien contrata la póliza.",
    "columns": [
      {
        "name": "id_persona",
        "label": "Persona",
        "type": "integer",
        "required": true,
        "pk": true,
        "auto": false,
        "search": false,
        "fk": "persona"
      },
      {
        "name": "fecha_afiliacion",
        "label": "Fecha afiliación",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "plan_exequial",
    "title": "Planes exequiales",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_plan_exequial"
    ],
    "label": "{a}.nombre_plan",
    "description": "",
    "columns": [
      {
        "name": "id_plan_exequial",
        "label": "Plan exequial",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nombre_plan",
        "label": "Nombre plan",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "descripcion",
        "label": "Descripción",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "valor_base_prima",
        "label": "Valor base prima",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "poliza",
    "title": "Pólizas",
    "module": "Afiliación",
    "static": false,
    "audit": true,
    "pk": [
      "id_poliza"
    ],
    "label": "{a}.numero_poliza",
    "description": "",
    "columns": [
      {
        "name": "id_poliza",
        "label": "Póliza",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_persona_titular",
        "label": "Persona titular",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "titular"
      },
      {
        "name": "id_plan_exequial",
        "label": "Plan exequial",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "plan_exequial"
      },
      {
        "name": "id_tipo_poliza",
        "label": "Tipo póliza",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_poliza"
      },
      {
        "name": "id_estado_poliza",
        "label": "Estado póliza",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "estado_poliza"
      },
      {
        "name": "id_periodicidad_cobro",
        "label": "Periodicidad cobro",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "periodicidad_cobro"
      },
      {
        "name": "numero_poliza",
        "label": "Número póliza",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_inicio",
        "label": "Fecha inicio",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "fecha_fin_vigencia",
        "label": "Fecha fin vigencia",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_prima",
        "label": "Valor prima",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "beneficiario",
    "title": "Beneficiarios",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_persona"
    ],
    "label": "(SELECT p.nombres || ' ' || p.apellidos FROM persona p WHERE p.id_persona = {a}.id_persona)",
    "description": "Subtipo de PERSONA (herencia). Máximo 7 por póliza (trigger).",
    "columns": [
      {
        "name": "id_persona",
        "label": "Persona",
        "type": "integer",
        "required": true,
        "pk": true,
        "auto": false,
        "search": false,
        "fk": "persona"
      },
      {
        "name": "id_poliza",
        "label": "Póliza",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "poliza"
      },
      {
        "name": "id_parentesco",
        "label": "Parentesco",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "parentesco"
      },
      {
        "name": "tarifa_diferenciada",
        "label": "Tarifa diferenciada",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "fecha_inclusion",
        "label": "Fecha inclusión",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "anio_cobro_poliza",
    "title": "Años de cobro",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_anio_cobro"
    ],
    "label": "CAST({a}.anio AS TEXT)",
    "description": "",
    "columns": [
      {
        "name": "id_anio_cobro",
        "label": "Año cobro",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_poliza",
        "label": "Póliza",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "poliza"
      },
      {
        "name": "anio",
        "label": "Año",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "es_anio_cobrable",
        "label": "¿Es año cobrable?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "pago_prima",
    "title": "Pagos de prima",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_pago_prima"
    ],
    "label": "'Pago #' || {a}.id_pago_prima || ' · ' || {a}.fecha_pago",
    "description": "",
    "columns": [
      {
        "name": "id_pago_prima",
        "label": "Pago prima",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_poliza",
        "label": "Póliza",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "poliza"
      },
      {
        "name": "id_metodo_pago",
        "label": "Metodo pago",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "metodo_pago"
      },
      {
        "name": "fecha_pago",
        "label": "Fecha pago",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_pagado",
        "label": "Valor pagado",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "periodo_cubierto",
        "label": "Período cubierto",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "servicio_funerario",
    "title": "Servicios funerarios",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_servicio_funerario"
    ],
    "label": "{a}.nombre_servicio",
    "description": "",
    "columns": [
      {
        "name": "id_servicio_funerario",
        "label": "Servicio funerario",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_categoria_servicio",
        "label": "Categoría servicio",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "categoria_servicio"
      },
      {
        "name": "id_religion",
        "label": "Religión",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "religion"
      },
      {
        "name": "nombre_servicio",
        "label": "Nombre servicio",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "valor_base",
        "label": "Valor base",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "cobertura_plan",
    "title": "Coberturas por plan",
    "module": "Afiliación",
    "static": false,
    "audit": false,
    "pk": [
      "id_cobertura_plan"
    ],
    "label": "'Cobertura #' || {a}.id_cobertura_plan",
    "description": "",
    "columns": [
      {
        "name": "id_cobertura_plan",
        "label": "Cobertura plan",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_plan_exequial",
        "label": "Plan exequial",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "plan_exequial"
      },
      {
        "name": "id_servicio_funerario",
        "label": "Servicio funerario",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_funerario"
      },
      {
        "name": "porcentaje_cobertura",
        "label": "Porcentaje cobertura",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "tope_valor_cubierto",
        "label": "Tope valor cubierto",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "tarifa_servicio_region",
    "title": "Tarifas por región",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_tarifa"
    ],
    "label": "'Tarifa #' || {a}.id_tarifa",
    "description": "",
    "columns": [
      {
        "name": "id_tarifa",
        "label": "Tarifa",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_servicio_funerario",
        "label": "Servicio funerario",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_funerario"
      },
      {
        "name": "id_region_atencion",
        "label": "Región atención",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "region_atencion"
      },
      {
        "name": "valor_tarifa",
        "label": "Valor tarifa",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "vigente_desde",
        "label": "Vigente desde",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "evento_fallecimiento",
    "title": "Eventos de fallecimiento",
    "module": "Eventos y documentos",
    "static": false,
    "audit": true,
    "pk": [
      "id_evento"
    ],
    "label": "'EV-' || printf('%04d', {a}.id_evento) || ' · ' || (SELECT p.nombres || ' ' || p.apellidos FROM persona p WHERE p.id_persona = {a}.id_persona_fallecida)",
    "description": "La póliza debe estar Activa y cubrir al fallecido (titular o beneficiario); validado por trigger.",
    "columns": [
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_persona_fallecida",
        "label": "Persona fallecida",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "persona"
      },
      {
        "name": "id_poliza",
        "label": "Póliza",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "poliza"
      },
      {
        "name": "id_persona_reportante",
        "label": "Persona reportante",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "persona"
      },
      {
        "name": "id_parentesco_reportante",
        "label": "Parentesco reportante",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "parentesco"
      },
      {
        "name": "id_region_atencion",
        "label": "Región atención",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "region_atencion"
      },
      {
        "name": "fecha_fallecimiento",
        "label": "Fecha fallecimiento",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "hora_fallecimiento",
        "label": "Hora fallecimiento",
        "type": "time",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "lugar_fallecimiento",
        "label": "Lugar fallecimiento",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "causa_fallecimiento",
        "label": "Causa fallecimiento",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "es_servicio_particular",
        "label": "¿Es servicio particular?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      },
      {
        "name": "fecha_hora_reporte",
        "label": "Fecha hora reporte",
        "type": "datetime",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "institucion_emisora",
    "title": "Instituciones emisoras",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_institucion"
    ],
    "label": "{a}.nombre_institucion",
    "description": "",
    "columns": [
      {
        "name": "id_institucion",
        "label": "Institución",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_tipo_institucion",
        "label": "Tipo institución",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_institucion"
      },
      {
        "name": "nombre_institucion",
        "label": "Nombre institución",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "nit",
        "label": "NIT",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "medico",
    "title": "Médicos",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_medico"
    ],
    "label": "{a}.nombre_completo",
    "description": "",
    "columns": [
      {
        "name": "id_medico",
        "label": "Médico",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_institucion",
        "label": "Institución",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "institucion_emisora"
      },
      {
        "name": "nombre_completo",
        "label": "Nombre completo",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "registro_medico",
        "label": "Registro médico",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "certificado_defuncion",
    "title": "Certificados de defunción",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_certificado"
    ],
    "label": "{a}.numero_certificado",
    "description": "",
    "columns": [
      {
        "name": "id_certificado",
        "label": "Certificado",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_medico",
        "label": "Médico",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "medico"
      },
      {
        "name": "id_institucion",
        "label": "Institución",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "institucion_emisora"
      },
      {
        "name": "id_tipo_muerte",
        "label": "Tipo muerte",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_muerte"
      },
      {
        "name": "numero_certificado",
        "label": "Número certificado",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_defuncion",
        "label": "Fecha defunción",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "hora_defuncion",
        "label": "Hora defunción",
        "type": "time",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "lugar_defuncion",
        "label": "Lugar defunción",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "causa_muerte",
        "label": "Causa muerte",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "acta_necropsia",
    "title": "Actas de necropsia",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_acta_necropsia"
    ],
    "label": "{a}.numero_acta",
    "description": "",
    "columns": [
      {
        "name": "id_acta_necropsia",
        "label": "Acta necropsia",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_institucion",
        "label": "Institución",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "institucion_emisora"
      },
      {
        "name": "numero_acta",
        "label": "Número acta",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_expedicion",
        "label": "Fecha expedición",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "restriccion_cremacion",
    "title": "Restricciones de cremación",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_restriccion"
    ],
    "label": "'Restricción #' || {a}.id_restriccion",
    "description": "Mientras no tenga autorización judicial, el evento no admite servicios de cremación (trigger).",
    "columns": [
      {
        "name": "id_restriccion",
        "label": "Restricción",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_motivo_restriccion",
        "label": "Motivo restricción",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "motivo_restriccion"
      },
      {
        "name": "numero_autorizacion_judicial",
        "label": "Número autorización judicial",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "juzgado_autorizador",
        "label": "Juzgado autorizador",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_autorizacion",
        "label": "Fecha autorización",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "oficina_registro_civil",
    "title": "Oficinas de registro civil",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_oficina_registro"
    ],
    "label": "{a}.nombre_oficina || ' (' || {a}.ciudad || ')'",
    "description": "",
    "columns": [
      {
        "name": "id_oficina_registro",
        "label": "Oficina registro",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_tipo_oficina",
        "label": "Tipo oficina",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_oficina"
      },
      {
        "name": "nombre_oficina",
        "label": "Nombre oficina",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "ciudad",
        "label": "Ciudad",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "sede",
    "title": "Sedes",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_sede"
    ],
    "label": "{a}.nombre_sede",
    "description": "",
    "columns": [
      {
        "name": "id_sede",
        "label": "Sede",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_tipo_sede",
        "label": "Tipo sede",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_sede"
      },
      {
        "name": "nombre_sede",
        "label": "Nombre sede",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "direccion",
        "label": "Dirección",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "empleado",
    "title": "Empleados",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_empleado"
    ],
    "label": "{a}.nombres || ' ' || {a}.apellidos",
    "description": "",
    "columns": [
      {
        "name": "id_empleado",
        "label": "Empleado",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_sede",
        "label": "Sede",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "sede"
      },
      {
        "name": "id_cargo",
        "label": "Cargo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "cargo"
      },
      {
        "name": "numero_documento",
        "label": "Número documento",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "nombres",
        "label": "Nombres",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "apellidos",
        "label": "Apellidos",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "telefono",
        "label": "Teléfono",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "registro_civil_defuncion",
    "title": "Registros civiles de defunción",
    "module": "Eventos y documentos",
    "static": false,
    "audit": false,
    "pk": [
      "id_registro_civil"
    ],
    "label": "{a}.numero_serial",
    "description": "",
    "columns": [
      {
        "name": "id_registro_civil",
        "label": "Registro civil",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_oficina_registro",
        "label": "Oficina registro",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "oficina_registro_civil"
      },
      {
        "name": "id_empleado_gestor",
        "label": "Empleado gestor",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "empleado"
      },
      {
        "name": "numero_serial",
        "label": "Número serial",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_registro",
        "label": "Fecha registro",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "instalacion",
    "title": "Instalaciones",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_instalacion"
    ],
    "label": "{a}.nombre_instalacion",
    "description": "",
    "columns": [
      {
        "name": "id_instalacion",
        "label": "Instalación",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_sede",
        "label": "Sede",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "sede"
      },
      {
        "name": "id_tipo_instalacion",
        "label": "Tipo instalación",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_instalacion"
      },
      {
        "name": "nombre_instalacion",
        "label": "Nombre instalación",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "capacidad_personas",
        "label": "Capacidad personas",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "esta_disponible",
        "label": "¿Está disponible?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "servicio_prestado",
    "title": "Servicios prestados",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_servicio_prestado"
    ],
    "label": "(SELECT s.nombre_servicio FROM servicio_funerario s WHERE s.id_servicio_funerario = {a}.id_servicio_funerario) || ' · EV-' || printf('%04d', {a}.id_evento)",
    "description": "",
    "columns": [
      {
        "name": "id_servicio_prestado",
        "label": "Servicio prestado",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_servicio_funerario",
        "label": "Servicio funerario",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_funerario"
      },
      {
        "name": "id_instalacion",
        "label": "Instalación",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "instalacion"
      },
      {
        "name": "id_estado_servicio",
        "label": "Estado servicio",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "estado_servicio"
      },
      {
        "name": "fecha_hora_prestacion",
        "label": "Fecha hora prestación",
        "type": "datetime",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "es_cubierto_poliza",
        "label": "¿Es cubierto póliza?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      },
      {
        "name": "valor_aplicado",
        "label": "Valor aplicado",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "asignacion_empleado",
    "title": "Asignación de empleados",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_asignacion_empleado"
    ],
    "label": "'Asignación #' || {a}.id_asignacion_empleado",
    "description": "",
    "columns": [
      {
        "name": "id_asignacion_empleado",
        "label": "Asignación empleado",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_servicio_prestado",
        "label": "Servicio prestado",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_prestado"
      },
      {
        "name": "id_empleado",
        "label": "Empleado",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "empleado"
      },
      {
        "name": "id_responsabilidad",
        "label": "Responsabilidad",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "responsabilidad"
      },
      {
        "name": "fecha_asignacion",
        "label": "Fecha asignación",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "vehiculo",
    "title": "Vehículos",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_vehiculo"
    ],
    "label": "{a}.placa",
    "description": "",
    "columns": [
      {
        "name": "id_vehiculo",
        "label": "Vehículo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_tipo_vehiculo",
        "label": "Tipo vehículo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_vehiculo"
      },
      {
        "name": "placa",
        "label": "Placa",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "capacidad_pasajeros",
        "label": "Capacidad pasajeros",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "esta_disponible",
        "label": "¿Está disponible?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "asignacion_vehiculo",
    "title": "Asignación de vehículos",
    "module": "Servicios y recursos",
    "static": false,
    "audit": false,
    "pk": [
      "id_asignacion_vehiculo"
    ],
    "label": "'Asignación #' || {a}.id_asignacion_vehiculo",
    "description": "",
    "columns": [
      {
        "name": "id_asignacion_vehiculo",
        "label": "Asignación vehículo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_servicio_prestado",
        "label": "Servicio prestado",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_prestado"
      },
      {
        "name": "id_vehiculo",
        "label": "Vehículo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "vehiculo"
      },
      {
        "name": "fecha_hora_salida",
        "label": "Fecha hora salida",
        "type": "datetime",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "fecha_hora_regreso",
        "label": "Fecha hora regreso",
        "type": "datetime",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "articulo",
    "title": "Artículos (inventario)",
    "module": "Inventario y compras",
    "static": false,
    "audit": false,
    "pk": [
      "id_articulo"
    ],
    "label": "{a}.codigo || ' - ' || {a}.nombre_articulo",
    "description": "La existencia se actualiza sola con compras, entregas y devoluciones (triggers).",
    "columns": [
      {
        "name": "id_articulo",
        "label": "Artículo",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_categoria_articulo",
        "label": "Categoría artículo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "categoria_articulo"
      },
      {
        "name": "id_material",
        "label": "Material",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "material"
      },
      {
        "name": "codigo",
        "label": "Código",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "nombre_articulo",
        "label": "Nombre artículo",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "precio_venta",
        "label": "Precio venta",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "cantidad_disponible",
        "label": "Cantidad disponible",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "articulo_entregado",
    "title": "Artículos entregados",
    "module": "Inventario y compras",
    "static": false,
    "audit": false,
    "pk": [
      "id_articulo_entregado"
    ],
    "label": "(SELECT a.nombre_articulo FROM articulo a WHERE a.id_articulo = {a}.id_articulo) || ' x' || {a}.cantidad || ' · EV-' || printf('%04d', {a}.id_evento)",
    "description": "",
    "columns": [
      {
        "name": "id_articulo_entregado",
        "label": "Artículo entregado",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_articulo",
        "label": "Artículo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "articulo"
      },
      {
        "name": "id_modalidad_entrega",
        "label": "Modalidad entrega",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "modalidad_entrega"
      },
      {
        "name": "id_estado_devolucion",
        "label": "Estado devolución",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "estado_devolucion"
      },
      {
        "name": "cantidad",
        "label": "Cantidad",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "fecha_entrega",
        "label": "Fecha entrega",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "fecha_devolucion",
        "label": "Fecha devolución",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "proveedor",
    "title": "Proveedores",
    "module": "Inventario y compras",
    "static": false,
    "audit": false,
    "pk": [
      "id_proveedor"
    ],
    "label": "{a}.razon_social",
    "description": "",
    "columns": [
      {
        "name": "id_proveedor",
        "label": "Proveedor",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "nit",
        "label": "NIT",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "razon_social",
        "label": "Razón social",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "telefono",
        "label": "Teléfono",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "correo_electronico",
        "label": "Correo electrónico",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": true
      }
    ]
  },
  {
    "name": "compra",
    "title": "Compras",
    "module": "Inventario y compras",
    "static": false,
    "audit": false,
    "pk": [
      "id_compra"
    ],
    "label": "'Compra #' || {a}.id_compra || ' · ' || {a}.fecha_compra",
    "description": "valor_total se recalcula desde el detalle (trigger).",
    "columns": [
      {
        "name": "id_compra",
        "label": "Compra",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_proveedor",
        "label": "Proveedor",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "proveedor"
      },
      {
        "name": "fecha_compra",
        "label": "Fecha compra",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_total",
        "label": "Valor total",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "computed": true,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "detalle_compra",
    "title": "Detalle de compras",
    "module": "Inventario y compras",
    "static": false,
    "audit": false,
    "pk": [
      "id_detalle_compra"
    ],
    "label": "'Detalle #' || {a}.id_detalle_compra",
    "description": "",
    "columns": [
      {
        "name": "id_detalle_compra",
        "label": "Detalle compra",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_compra",
        "label": "Compra",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "compra"
      },
      {
        "name": "id_articulo",
        "label": "Artículo",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "articulo"
      },
      {
        "name": "cantidad",
        "label": "Cantidad",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "costo_unitario",
        "label": "Costo unitario",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "factura",
    "title": "Facturas",
    "module": "Facturación",
    "static": false,
    "audit": true,
    "pk": [
      "id_factura"
    ],
    "label": "{a}.numero_factura",
    "description": "Totales recalculados desde el detalle (trigger). Si todo lo cubre la póliza, valor_a_cargo_cliente = 0.",
    "columns": [
      {
        "name": "id_factura",
        "label": "Factura",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_evento",
        "label": "Evento",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "evento_fallecimiento"
      },
      {
        "name": "id_estado_factura",
        "label": "Estado factura",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "estado_factura"
      },
      {
        "name": "numero_factura",
        "label": "Número factura",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "fecha_emision",
        "label": "Fecha emisión",
        "type": "date",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      },
      {
        "name": "valor_total",
        "label": "Valor total",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "computed": true,
        "hasDefault": true
      },
      {
        "name": "valor_cubierto_poliza",
        "label": "Valor cubierto póliza",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "computed": true,
        "hasDefault": true
      },
      {
        "name": "valor_a_cargo_cliente",
        "label": "Valor a cargo cliente",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "computed": true,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "detalle_factura",
    "title": "Detalle de facturas",
    "module": "Facturación",
    "static": false,
    "audit": true,
    "pk": [
      "id_detalle_factura"
    ],
    "label": "{a}.concepto",
    "description": "",
    "columns": [
      {
        "name": "id_detalle_factura",
        "label": "Detalle factura",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_factura",
        "label": "Factura",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "factura"
      },
      {
        "name": "id_servicio_prestado",
        "label": "Servicio prestado",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "servicio_prestado"
      },
      {
        "name": "id_articulo_entregado",
        "label": "Artículo entregado",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "articulo_entregado"
      },
      {
        "name": "concepto",
        "label": "Concepto",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "valor_concepto",
        "label": "Valor concepto",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_cubierto",
        "label": "Valor cubierto",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      },
      {
        "name": "valor_cliente",
        "label": "Valor cliente",
        "type": "real",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "pago_factura",
    "title": "Pagos de factura",
    "module": "Facturación",
    "static": false,
    "audit": true,
    "pk": [
      "id_pago_factura"
    ],
    "label": "'Pago #' || {a}.id_pago_factura || ' · ' || {a}.fecha_pago",
    "description": "Cuando lo pagado cubre el valor a cargo del cliente, la factura pasa a Pagada (trigger).",
    "columns": [
      {
        "name": "id_pago_factura",
        "label": "Pago factura",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_factura",
        "label": "Factura",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "factura"
      },
      {
        "name": "id_metodo_pago",
        "label": "Metodo pago",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "metodo_pago"
      },
      {
        "name": "fecha_pago",
        "label": "Fecha pago",
        "type": "date",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_pagado",
        "label": "Valor pagado",
        "type": "real",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  },
  {
    "name": "usuario",
    "title": "Usuarios",
    "module": "Seguridad",
    "static": false,
    "audit": false,
    "pk": [
      "id_usuario"
    ],
    "label": "{a}.nombre_usuario",
    "description": "",
    "columns": [
      {
        "name": "id_usuario",
        "label": "Usuario",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_rol",
        "label": "Rol",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "rol"
      },
      {
        "name": "id_empleado",
        "label": "Empleado",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "empleado"
      },
      {
        "name": "nombre_usuario",
        "label": "Nombre usuario",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "clave_hash",
        "label": "Clave hash",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "esta_activo",
        "label": "¿Está activo?",
        "type": "boolean",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      }
    ]
  },
  {
    "name": "rol_permiso",
    "title": "Permisos por rol",
    "module": "Seguridad",
    "static": false,
    "audit": false,
    "pk": [
      "id_rol",
      "id_permiso"
    ],
    "label": "(SELECT r.nombre FROM rol r WHERE r.id_rol = {a}.id_rol) || ' → ' || (SELECT p.nombre FROM permiso p WHERE p.id_permiso = {a}.id_permiso)",
    "description": "",
    "columns": [
      {
        "name": "id_rol",
        "label": "Rol",
        "type": "integer",
        "required": true,
        "pk": true,
        "auto": false,
        "search": false,
        "fk": "rol"
      },
      {
        "name": "id_permiso",
        "label": "Permiso",
        "type": "integer",
        "required": true,
        "pk": true,
        "auto": false,
        "search": false,
        "fk": "permiso"
      }
    ]
  },
  {
    "name": "bitacora_auditoria",
    "title": "Bitácora de auditoría",
    "module": "Seguridad",
    "static": false,
    "audit": false,
    "pk": [
      "id_bitacora"
    ],
    "label": "'#' || {a}.id_bitacora || ' · ' || {a}.tabla_afectada",
    "description": "Se llena automáticamente desde la API al modificar pólizas, eventos y facturación.",
    "columns": [
      {
        "name": "id_bitacora",
        "label": "Bitácora",
        "type": "integer",
        "required": false,
        "pk": true,
        "auto": true,
        "search": false
      },
      {
        "name": "id_usuario",
        "label": "Usuario",
        "type": "integer",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "usuario"
      },
      {
        "name": "id_tipo_operacion",
        "label": "Tipo operación",
        "type": "integer",
        "required": true,
        "pk": false,
        "auto": false,
        "search": false,
        "fk": "tipo_operacion"
      },
      {
        "name": "fecha_hora",
        "label": "Fecha hora",
        "type": "datetime",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false,
        "hasDefault": true
      },
      {
        "name": "tabla_afectada",
        "label": "Tabla afectada",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "id_registro_afectado",
        "label": "Registro afectado",
        "type": "text",
        "required": true,
        "pk": false,
        "auto": false,
        "search": true
      },
      {
        "name": "valor_anterior",
        "label": "Valor anterior",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      },
      {
        "name": "valor_nuevo",
        "label": "Valor nuevo",
        "type": "text",
        "required": false,
        "pk": false,
        "auto": false,
        "search": false
      }
    ]
  }
];

export const TABLE_MAP: Record<string, TableMeta> = Object.fromEntries(TABLES.map((t) => [t.name, t]));
