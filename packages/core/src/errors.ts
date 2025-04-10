/**
 * Custom error classes for PG-ORM.
 */

/**
 * Base class for all PG-ORM errors
 */
export class PgOrmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PgOrmError';
    // Maintain proper stack trace in Node.js
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/**
 * Error thrown when there's an issue with parsing the schema
 */
export class SchemaParsingError extends PgOrmError {
  line?: number;
  column?: number;

  constructor(message: string, line?: number, column?: number) {
    super(message);
    this.name = 'SchemaParsingError';
    this.line = line;
    this.column = column;
  }
}

/**
 * Error thrown when there's an issue with validating the schema
 */
export class SchemaValidationError extends PgOrmError {
  constructor(message: string) {
    super(message);
    this.name = 'SchemaValidationError';
  }
}

/**
 * Error thrown when there's an issue with database connection
 */
export class ConnectionError extends PgOrmError {
  cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'ConnectionError';
    this.cause = cause;
  }
}

/**
 * Error thrown when there's an issue with executing a query
 */
export class QueryError extends PgOrmError {
  query?: string;
  params?: unknown[];
  cause?: Error;

  constructor(message: string, query?: string, params?: unknown[], cause?: Error) {
    super(message);
    this.name = 'QueryError';
    this.query = query;
    this.params = params;
    this.cause = cause;
  }
} 