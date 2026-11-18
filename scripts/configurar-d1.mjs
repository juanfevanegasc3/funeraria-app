#!/usr/bin/env node
// Escribe el database_id real de D1 en wrangler.toml (reemplaza <REEMPLAZAR_CON_DATABASE_ID>).
// Uso:
//   node scripts/configurar-d1.mjs                 -> lo busca con `wrangler d1 list --json`
//   node scripts/configurar-d1.mjs <database_id>   -> usa el id indicado
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const DB_NAME = 'funeraria-db';
const PLACEHOLDER = '<REEMPLAZAR_CON_DATABASE_ID>';
const TOML = new URL('../wrangler.toml', import.meta.url);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let id = process.argv[2];
if (!id) {
  const out = execSync('npx wrangler d1 list --json', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
  const json = JSON.parse(out.slice(out.indexOf('[')));
  const db = json.find((d) => d.name === DB_NAME);
  if (!db) {
    console.error(`No existe la base "${DB_NAME}" en la cuenta. Créala con: npx wrangler d1 create ${DB_NAME}`);
    process.exit(1);
  }
  id = db.uuid ?? db.database_id ?? db.id;
}
if (!UUID.test(id)) {
  console.error(`database_id no válido: ${id}`);
  process.exit(1);
}

const toml = readFileSync(TOML, 'utf8');
if (toml.includes(`database_id = "${id}"`)) {
  console.log(`wrangler.toml ya usa database_id = "${id}"`);
} else if (toml.includes(`database_id = "${PLACEHOLDER}"`)) {
  writeFileSync(TOML, toml.replace(`database_id = "${PLACEHOLDER}"`, `database_id = "${id}"`));
  console.log(`wrangler.toml actualizado: database_id = "${id}"`);
} else {
  console.error('No se encontró el marcador en wrangler.toml; revisa el bloque [[d1_databases]] manualmente.');
  process.exit(1);
}
