/**
 * Core constants used throughout PG-ORM.
 * @packageDocumentation
 */

/**
 * Default connection pool size
 */
export const DEFAULT_POOL_SIZE = 10;

/**
 * Default idle timeout in milliseconds (30 seconds)
 */
export const DEFAULT_IDLE_TIMEOUT = 30000;

/**
 * Default connection timeout in milliseconds (10 seconds)
 */
export const DEFAULT_CONNECTION_TIMEOUT = 10000;

/**
 * Default statement timeout in milliseconds (60 seconds)
 */
export const DEFAULT_STATEMENT_TIMEOUT = 60000;

/**
 * Schema filename
 */
export const SCHEMA_FILENAME = 'schema.pg';

/**
 * Generated client directory
 */
export const DEFAULT_GENERATED_DIR = './generated';

/**
 * Migrations directory
 */
export const DEFAULT_MIGRATIONS_DIR = './migrations';

/**
 * Map of PostgreSQL error codes to names
 */
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  CONNECTION_FAILURE: '08006',
  CONNECTION_EXCEPTION: '08000',
  QUERY_CANCELED: '57014',
  UNDEFINED_TABLE: '42P01',
  UNDEFINED_COLUMN: '42703',
} as const; 