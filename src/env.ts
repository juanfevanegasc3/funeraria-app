// Bindings del Worker declarados en wrangler.toml.
export interface Env {
  /** Base de datos D1 ([[d1_databases]] binding = "DB"). */
  DB: D1Database;
  /** Frontend compilado en ./dist ([assets] binding = "ASSETS"). */
  ASSETS: Fetcher;
}
