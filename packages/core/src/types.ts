/**
 * Core types used throughout PG-ORM.
 * @packageDocumentation
 */

/**
 * Supported PostgreSQL data types
 */
export enum DataType {
  // Numeric types
  INT = 'INT',
  BIGINT = 'BIGINT',
  DECIMAL = 'DECIMAL',
  NUMERIC = 'NUMERIC',
  REAL = 'REAL',
  DOUBLE = 'DOUBLE PRECISION',
  SERIAL = 'SERIAL',
  BIGSERIAL = 'BIGSERIAL',

  // Character types
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  TEXT = 'TEXT',
  STRING = 'TEXT', // Alias for TEXT

  // Boolean type
  BOOLEAN = 'BOOLEAN',

  // Date/Time types
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',
  TIMESTAMPTZ = 'TIMESTAMPTZ',
  INTERVAL = 'INTERVAL',

  // Binary types
  BYTEA = 'BYTEA',

  // JSON types
  JSON = 'JSON',
  JSONB = 'JSONB',

  // UUID type
  UUID = 'UUID',

  // Array type (used with other types)
  ARRAY = 'ARRAY',

  // Network address types
  INET = 'INET',
  CIDR = 'CIDR',
  MACADDR = 'MACADDR',

  // Geometric types
  POINT = 'POINT',
  LINE = 'LINE',
  LSEG = 'LSEG',
  BOX = 'BOX',
  PATH = 'PATH',
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',

  // Special types
  ENUM = 'ENUM',
  CUSTOM = 'CUSTOM',
}

/**
 * Supported PostgreSQL index types
 */
export enum IndexType {
  BTREE = 'BTREE',
  HASH = 'HASH',
  GIST = 'GIST',
  SPGIST = 'SPGIST',
  GIN = 'GIN',
  BRIN = 'BRIN',
}

/**
 * Supported PostgreSQL partitioning types
 */
export enum PartitionType {
  RANGE = 'RANGE',
  LIST = 'LIST',
  HASH = 'HASH',
}

/**
 * Field definition for model
 */
export interface FieldDefinition {
  name: string;
  type: DataType | string;
  isRequired?: boolean;
  isPrimary?: boolean;
  isUnique?: boolean;
  isArray?: boolean;
  defaultValue?: unknown;
  attributes?: Record<string, unknown>;
}

/**
 * Index definition for model
 */
export interface IndexDefinition {
  fields: string[];
  type: IndexType | string;
  name?: string;
  opclass?: string;
  where?: string;
  attributes?: Record<string, unknown>;
}

/**
 * Model definition
 */
export interface ModelDefinition {
  name: string;
  fields: FieldDefinition[];
  indexes?: IndexDefinition[];
  attributes?: Record<string, unknown>;
}

/**
 * Connection configuration
 */
export interface ConnectionConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  connectionString?: string;
  ssl?: boolean | Record<string, unknown>;
  maxConnections?: number;
  idleTimeout?: number;
}

/**
 * Query parameters
 */
export interface QueryParams {
  text: string;
  values?: unknown[];
}

/**
 * Query result
 */
export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
  command: string;
  fields: {
    name: string;
    dataTypeID: number;
  }[];
} 