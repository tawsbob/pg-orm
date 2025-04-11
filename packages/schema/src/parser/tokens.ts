/**
 * Token definitions for the schema language
 */

/**
 * Represents the position of a token in the source
 */
export interface SourcePosition {
  line: number;
  column: number;
  offset: number;
}

/**
 * Types of tokens in the schema language
 */
export enum TokenType {
  // Literals
  IDENTIFIER = 'IDENTIFIER',     // model, User, etc.
  STRING = 'STRING',             // "hello", 'world'
  NUMBER = 'NUMBER',             // 123, 45.67
  BOOLEAN = 'BOOLEAN',           // true, false
  
  // Keywords
  KEYWORD = 'KEYWORD',           // model, enum, type, etc.
  
  // Operators and punctuation
  EQUALS = 'EQUALS',             // =
  BRACE_LEFT = 'BRACE_LEFT',     // {
  BRACE_RIGHT = 'BRACE_RIGHT',   // }
  BRACKET_LEFT = 'BRACKET_LEFT', // [
  BRACKET_RIGHT = 'BRACKET_RIGHT', // ]
  PAREN_LEFT = 'PAREN_LEFT',     // (
  PAREN_RIGHT = 'PAREN_RIGHT',   // )
  AT = 'AT',                     // @
  AT_AT = 'AT_AT',               // @@
  DOT = 'DOT',                   // .
  COMMA = 'COMMA',               // ,
  COLON = 'COLON',               // :
  QUESTION = 'QUESTION',         // ?
  
  // Special
  COMMENT = 'COMMENT',           // // comment or /* comment */
  WHITESPACE = 'WHITESPACE',     // space, tab, newline
  EOF = 'EOF',                   // End of file
  UNKNOWN = 'UNKNOWN'            // Unknown token
}

/**
 * Keywords in the schema language
 */
export const KEYWORDS = new Set([
  'model',
  'enum',
  'type',
  'view',
  'datasource',
  'generator',
  'env'
]);

/**
 * Represents a token in the schema language
 */
export interface Token {
  type: TokenType;         // Type of token
  value: string;           // Raw value of token
  position: SourcePosition; // Position in source
}

/**
 * Create a new token
 */
export function createToken(
  type: TokenType,
  value: string,
  position: SourcePosition
): Token {
  return {
    type,
    value,
    position
  };
} 