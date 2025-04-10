/**
 * Extension types for PG-ORM.
 */

// This is a placeholder for the extensions types
// It will be implemented according to the roadmap in Phase 3-4

/**
 * Base extension interface
 */
export interface Extension {
  /** Name of the extension */
  name: string;
  
  /** Initialize the extension */
  initialize(): Promise<void>;
} 