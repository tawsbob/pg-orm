/**
 * Database interaction engine for PG-ORM handling connections and query execution.
 */

// Export public API
export { createConnectionManager } from './connection';
export { createQueryExecutor } from './query';
export { startTransaction, withTransaction } from './transaction';

// Export types
export * from './types'; 