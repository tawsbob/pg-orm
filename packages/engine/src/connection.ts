/**
 * Connection management for PG-ORM.
 */

import { Pool, PoolClient } from 'pg';
import { ConnectionError } from '@pg-orm/core';
import { 
  ConnectionManager, 
  DatabaseClient, 
  EngineOptions 
} from './types';
import { 
  DEFAULT_POOL_SIZE, 
  DEFAULT_IDLE_TIMEOUT,
  DEFAULT_CONNECTION_TIMEOUT,
  DEFAULT_STATEMENT_TIMEOUT
} from '@pg-orm/core';

/**
 * PostgreSQL database client implementation
 */
class PgDatabaseClient implements DatabaseClient {
  constructor(private poolClient: PoolClient) {}

  /**
   * Execute a query
   */
  async query<T = Record<string, unknown>>(params: { text: string; values?: unknown[] }) {
    try {
      return await this.poolClient.query(params);
    } catch (error) {
      throw new ConnectionError(
        `Query execution failed: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Release the client back to the pool
   */
  release() {
    this.poolClient.release();
  }
}

/**
 * PostgreSQL connection manager implementation
 */
export class PgConnectionManager implements ConnectionManager {
  private pool: Pool;

  constructor(options: EngineOptions) {
    const {
      maxConnections = DEFAULT_POOL_SIZE,
      idleTimeout = DEFAULT_IDLE_TIMEOUT,
      connectionTimeout = DEFAULT_CONNECTION_TIMEOUT,
      statementTimeout = DEFAULT_STATEMENT_TIMEOUT,
      ...connectionOptions
    } = options;

    this.pool = new Pool({
      ...connectionOptions,
      max: maxConnections,
      idleTimeoutMillis: idleTimeout,
      connectionTimeoutMillis: connectionTimeout
    });

    // Set statement timeout for all clients
    this.pool.on('connect', (client) => {
      client.query(`SET statement_timeout = ${statementTimeout}`);
    });

    // Log errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  /**
   * Get a database client from the pool
   */
  async getClient(): Promise<DatabaseClient> {
    try {
      const client = await this.pool.connect();
      return new PgDatabaseClient(client);
    } catch (error) {
      throw new ConnectionError(
        `Failed to get client from pool: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Connect to the database
   */
  async connect(): Promise<DatabaseClient> {
    return this.getClient();
  }

  /**
   * Execute a function with a client, automatically releasing it afterwards
   */
  async withClient<T>(fn: (client: DatabaseClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}

/**
 * Create a new connection manager
 */
export function createConnectionManager(options: EngineOptions): ConnectionManager {
  return new PgConnectionManager(options);
} 