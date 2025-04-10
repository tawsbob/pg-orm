/**
 * Schema types for PG-ORM.
 * @packageDocumentation
 */

import { DataType, IndexType, ModelDefinition, FieldDefinition } from '@pg-orm/core';

/**
 * Schema document representing a complete schema definition
 */
export interface Schema {
  models: ModelDefinition[];
  enums: EnumDefinition[];
  types: TypeDefinition[];
}

/**
 * Enum definition in schema
 */
export interface EnumDefinition {
  name: string;
  values: string[];
  isPgEnum: boolean;
}

/**
 * Custom type definition in schema
 */
export interface TypeDefinition {
  name: string;
  baseType?: DataType | string;
  fields?: {
    name: string;
    type: DataType | string;
  }[];
  isPgType: boolean;
}

/**
 * Relation definition in schema
 */
export interface RelationDefinition {
  name: string;
  modelName: string;
  fields: string[];
  references: string[];
  relationField?: string;
}

/**
 * Attribute definition in schema
 */
export interface AttributeDefinition {
  name: string;
  arguments: any[];
}

/**
 * Language token types
 */
export enum TokenType {
  IDENTIFIER = 'IDENTIFIER',
  KEYWORD = 'KEYWORD',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OPERATOR = 'OPERATOR',
  PUNCTUATION = 'PUNCTUATION',
  COMMENT = 'COMMENT',
  EOF = 'EOF',
}

/**
 * Language token
 */
export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

/**
 * AST node types
 */
export enum NodeType {
  SCHEMA = 'SCHEMA',
  MODEL = 'MODEL',
  FIELD = 'FIELD',
  ENUM = 'ENUM',
  TYPE = 'TYPE',
  ATTRIBUTE = 'ATTRIBUTE',
}

/**
 * Base AST node
 */
export interface AstNode {
  type: NodeType;
  location: {
    line: number;
    column: number;
  };
}

/**
 * Schema AST node
 */
export interface SchemaNode extends AstNode {
  type: NodeType.SCHEMA;
  models: ModelNode[];
  enums: EnumNode[];
  types: TypeNode[];
}

/**
 * Model AST node
 */
export interface ModelNode extends AstNode {
  type: NodeType.MODEL;
  name: string;
  fields: FieldNode[];
  attributes: AttributeNode[];
}

/**
 * Field AST node
 */
export interface FieldNode extends AstNode {
  type: NodeType.FIELD;
  name: string;
  fieldType: string;
  isRequired: boolean;
  isArray: boolean;
  attributes: AttributeNode[];
}

/**
 * Enum AST node
 */
export interface EnumNode extends AstNode {
  type: NodeType.ENUM;
  name: string;
  values: string[];
  attributes: AttributeNode[];
}

/**
 * Type AST node
 */
export interface TypeNode extends AstNode {
  type: NodeType.TYPE;
  name: string;
  baseType?: string;
  fields?: {
    name: string;
    type: string;
  }[];
  attributes: AttributeNode[];
}

/**
 * Attribute AST node
 */
export interface AttributeNode extends AstNode {
  type: NodeType.ATTRIBUTE;
  name: string;
  arguments: any[];
} 