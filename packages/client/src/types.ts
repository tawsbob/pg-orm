/**
 * Client types for PG-ORM.
 */

// This is a placeholder for the client types
// It will be implemented according to the roadmap in Phase 2-3

/**
 * Client configuration options
 */
export interface ClientOptions {
  /** Connection string for the database */
  connectionString?: string;
  
  /** Maximum number of connections */
  maxConnections?: number;
  
  /** Whether to use debug mode */
  debug?: boolean;
}

/**
 * Client API interface
 */
export interface Client {
  /** Disconnect from the database */
  disconnect(): Promise<void>;
}