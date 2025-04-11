/**
 * AST node types for the schema definition language
 */
import { SourcePosition } from '../tokens';

/**
 * AST node types
 */
export enum NodeType {
  // Document nodes
  SCHEMA = 'SCHEMA',
  DATASOURCE = 'DATASOURCE',
  GENERATOR = 'GENERATOR',
  
  // Model definition nodes
  MODEL = 'MODEL',
  ENUM = 'ENUM',
  TYPE = 'TYPE',
  VIEW = 'VIEW',
  
  // Field nodes
  FIELD = 'FIELD',
  ATTRIBUTE = 'ATTRIBUTE',
  
  // Expression nodes
  ARRAY = 'ARRAY',
  CALL = 'CALL',
  FUNCTION = 'FUNCTION',
  
  // Value nodes
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  NULL = 'NULL'
}

/**
 * Base interface for all AST nodes
 */
export interface AstNode {
  type: NodeType;
  location: SourcePosition;
}

/**
 * Schema document node
 */
export interface SchemaNode extends AstNode {
  type: NodeType.SCHEMA;
  datasources: DatasourceNode[];
  generators: GeneratorNode[];
  models: ModelNode[];
  enums: EnumNode[];
  types: TypeNode[];
  views: ViewNode[];
}

/**
 * Datasource definition node
 */
export interface DatasourceNode extends AstNode {
  type: NodeType.DATASOURCE;
  name: string;
  properties: PropertyNode[];
}

/**
 * Generator definition node
 */
export interface GeneratorNode extends AstNode {
  type: NodeType.GENERATOR;
  name: string;
  properties: PropertyNode[];
}

/**
 * Property node (used in datasource and generator)
 */
export interface PropertyNode {
  name: string;
  value: ValueNode;
  location: SourcePosition;
}

/**
 * Model definition node
 */
export interface ModelNode extends AstNode {
  type: NodeType.MODEL;
  name: string;
  fields: FieldNode[];
  attributes: AttributeNode[];
}

/**
 * Field definition node
 */
export interface FieldNode extends AstNode {
  type: NodeType.FIELD;
  name: string;
  fieldType: TypeReferenceNode;
  isRequired: boolean;
  isArray: boolean;
  attributes: AttributeNode[];
}

/**
 * Type reference node
 */
export interface TypeReferenceNode {
  name: string;
  isArray: boolean;
  isRequired: boolean;
  location: SourcePosition;
}

/**
 * Attribute node
 */
export interface AttributeNode extends AstNode {
  type: NodeType.ATTRIBUTE;
  name: string;
  isField: boolean; // @attribute vs @@attribute
  arguments: ArgumentNode[];
}

/**
 * Argument node
 */
export interface ArgumentNode {
  name?: string; // Named arguments, optional
  value: ValueNode;
  location: SourcePosition;
}

/**
 * Enum definition node
 */
export interface EnumNode extends AstNode {
  type: NodeType.ENUM;
  name: string;
  values: string[];
  attributes: AttributeNode[];
}

/**
 * Type definition node
 */
export interface TypeNode extends AstNode {
  type: NodeType.TYPE;
  name: string;
  baseType?: string;
  fields?: FieldNode[];
  attributes: AttributeNode[];
}

/**
 * View definition node
 */
export interface ViewNode extends AstNode {
  type: NodeType.VIEW;
  name: string;
  fields: FieldNode[];
  attributes: AttributeNode[];
  isMaterialized: boolean;
}

/**
 * Value node (abstract)
 */
export type ValueNode = 
  | IdentifierNode
  | StringNode
  | NumberNode
  | BooleanNode
  | NullNode
  | ArrayNode
  | FunctionCallNode;

/**
 * Identifier node
 */
export interface IdentifierNode extends AstNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

/**
 * String literal node
 */
export interface StringNode extends AstNode {
  type: NodeType.STRING;
  value: string;
}

/**
 * Number literal node
 */
export interface NumberNode extends AstNode {
  type: NodeType.NUMBER;
  value: number;
}

/**
 * Boolean literal node
 */
export interface BooleanNode extends AstNode {
  type: NodeType.BOOLEAN;
  value: boolean;
}

/**
 * Null literal node
 */
export interface NullNode extends AstNode {
  type: NodeType.NULL;
}

/**
 * Array literal node
 */
export interface ArrayNode extends AstNode {
  type: NodeType.ARRAY;
  elements: ValueNode[];
}

/**
 * Function call node
 */
export interface FunctionCallNode extends AstNode {
  type: NodeType.CALL;
  name: string;
  arguments: ValueNode[];
} 