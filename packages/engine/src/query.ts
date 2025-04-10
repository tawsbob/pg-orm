/**
 * Query execution for PG-ORM.
 */

import { QueryError } from '@pg-orm/core';
import { DatabaseClient, QueryExecutor } from './types';

/**
 * PostgreSQL query executor implementation
 */
export class PgQueryExecutor implements QueryExecutor {
  /**
   * Execute a single query
   */
  async execute<T = Record<string, unknown>>(
    query: { text: string; values?: unknown[] },
    client?: DatabaseClient
  ) {
    try {
      if (client) {
        return await client.query<T>(query);
      }
      
      throw new QueryError(
        'No client provided for query execution',
        query.text,
        query.values
      );
    } catch (error) {
      if (error instanceof QueryError) {
        throw error;
      }
      
      throw new QueryError(
        `Query execution failed: ${(error as Error).message}`,
        query.text,
        query.values,
        error as Error
      );
    }
  }

  /**
   * Execute multiple queries
   */
  async executeMany<T = Record<string, unknown>>(
    queries: Array<{ text: string; values?: unknown[] }>,
    client?: DatabaseClient
  ) {
    if (!client) {
      throw new QueryError('No client provided for query execution');
    }

    const results = [];
    for (const query of queries) {
      results.push(await this.execute<T>(query, client));
    }
    return results;
  }
}

/**
 * Create a new query executor
 */
export function createQueryExecutor(): QueryExecutor {
  return new PgQueryExecutor();
} 