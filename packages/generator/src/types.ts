/**
 * Generator types for PG-ORM.
 */

// This is a placeholder for the generator types
// It will be implemented according to the roadmap in Phase 2-3

import { Schema } from '@pg-orm/schema';

/**
 * Generator options
 */
export interface GeneratorOptions {
  /** Output directory for generated files */
  outputDir?: string;
  
  /** Whether to run prettier on generated files */
  prettier?: boolean;
  
  /** Whether to include comments in generated files */
  includeComments?: boolean;
}

/**
 * Generation result
 */
export interface GenerationResult {
  /** Path to the generated types file */
  typesPath: string;
  
  /** Path to the generated client file */
  clientPath: string;
} 