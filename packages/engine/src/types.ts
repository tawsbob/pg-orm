/**
 * Engine types for PG-ORM.
 */

import { ConnectionConfig, QueryParams, QueryResult } from '@pg-orm/core';

/**
 * Database client interface
 */
export interface DatabaseClient {
  query<T = Record<string, unknown>>(params: QueryParams): Promise<QueryResult<T>>;
  release(): void;
}

/**
 * Transaction client interface
 */
export interface TransactionClient extends DatabaseClient {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * Connection manager interface
 */
export interface ConnectionManager {
  connect(): Promise<DatabaseClient>;
  getClient(): Promise<DatabaseClient>;
  withClient<T>(fn: (client: DatabaseClient) => Promise<T>): Promise<T>;
  disconnect(): Promise<void>;
}

/**
 * Engine options
 */
export interface EngineOptions extends ConnectionConfig {
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
  statementTimeout?: number;
}

/**
 * Query executor interface
 */
export interface QueryExecutor {
  execute<T = Record<string, unknown>>(
    query: QueryParams,
    client?: DatabaseClient
  ): Promise<QueryResult<T>>;
  executeMany<T = Record<string, unknown>>(
    queries: QueryParams[],
    client?: DatabaseClient
  ): Promise<Array<QueryResult<T>>>;
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  isolationLevel?: IsolationLevel;
  readOnly?: boolean;
  deferrable?: boolean;
}

/**
 * Transaction isolation levels
 */
export enum IsolationLevel {
  READ_UNCOMMITTED = 'READ UNCOMMITTED',
  READ_COMMITTED = 'READ COMMITTED',
  REPEATABLE_READ = 'REPEATABLE READ',
  SERIALIZABLE = 'SERIALIZABLE'
} 