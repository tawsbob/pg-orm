/**
 * Transaction management for PG-ORM.
 */

import { TransactionError, QueryError } from '@pg-orm/core';
import { 
  DatabaseClient, 
  TransactionClient, 
  TransactionOptions,
  IsolationLevel
} from './types';

/**
 * PostgreSQL transaction client implementation
 */
export class PgTransactionClient implements TransactionClient {
  constructor(private client: DatabaseClient) {}

  /**
   * Execute a query within the transaction
   */
  async query<T = Record<string, unknown>>(params: { text: string; values?: unknown[] }) {
    return this.client.query<T>(params);
  }

  /**
   * Commit the transaction
   */
  async commit(): Promise<void> {
    try {
      await this.client.query({ text: 'COMMIT' });
    } catch (error) {
      throw new TransactionError(
        `Failed to commit transaction: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Rollback the transaction
   */
  async rollback(): Promise<void> {
    try {
      await this.client.query({ text: 'ROLLBACK' });
    } catch (error) {
      throw new TransactionError(
        `Failed to rollback transaction: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Release the client
   */
  release(): void {
    this.client.release();
  }
}

/**
 * Start a new transaction
 */
export async function startTransaction(
  client: DatabaseClient,
  options: TransactionOptions = {}
): Promise<TransactionClient> {
  const {
    isolationLevel = IsolationLevel.READ_COMMITTED,
    readOnly = false,
    deferrable = false
  } = options;

  try {
    let beginStatement = `BEGIN ISOLATION LEVEL ${isolationLevel}`;
    
    if (readOnly) {
      beginStatement += ' READ ONLY';
    }
    
    if (deferrable && isolationLevel === IsolationLevel.SERIALIZABLE) {
      beginStatement += ' DEFERRABLE';
    }
    
    await client.query({ text: beginStatement });
    
    return new PgTransactionClient(client);
  } catch (error) {
    throw new TransactionError(
      `Failed to start transaction: ${(error as Error).message}`,
      error as Error
    );
  }
}

/**
 * Execute a function within a transaction
 */
export async function withTransaction<T>(
  client: DatabaseClient,
  fn: (transaction: TransactionClient) => Promise<T>,
  options: TransactionOptions = {}
): Promise<T> {
  const transaction = await startTransaction(client, options);
  
  try {
    const result = await fn(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    transaction.release();
  }
} 