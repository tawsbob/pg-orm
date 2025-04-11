/**
 * AST builder functions
 */
import { SourcePosition } from '../tokens';
import {
  NodeType,
  SchemaNode,
  ModelNode,
  FieldNode,
  EnumNode,
  TypeNode,
  ViewNode,
  AttributeNode,
  DatasourceNode,
  GeneratorNode,
  PropertyNode,
  IdentifierNode,
  StringNode,
  NumberNode,
  BooleanNode,
  NullNode,
  ArrayNode,
  FunctionCallNode,
  TypeReferenceNode,
  ArgumentNode,
  ValueNode
} from './nodes';

/**
 * Create a schema node
 */
export function createSchemaNode(location: SourcePosition): SchemaNode {
  return {
    type: NodeType.SCHEMA,
    location,
    datasources: [],
    generators: [],
    models: [],
    enums: [],
    types: [],
    views: []
  };
}

/**
 * Create a datasource node
 */
export function createDatasourceNode(
  name: string,
  properties: PropertyNode[],
  location: SourcePosition
): DatasourceNode {
  return {
    type: NodeType.DATASOURCE,
    name,
    properties,
    location
  };
}

/**
 * Create a generator node
 */
export function createGeneratorNode(
  name: string,
  properties: PropertyNode[],
  location: SourcePosition
): GeneratorNode {
  return {
    type: NodeType.GENERATOR,
    name,
    properties,
    location
  };
}

/**
 * Create a property node
 */
export function createPropertyNode(
  name: string,
  value: ValueNode,
  location: SourcePosition
): PropertyNode {
  return {
    name,
    value,
    location
  };
}

/**
 * Create a model node
 */
export function createModelNode(
  name: string,
  fields: FieldNode[],
  attributes: AttributeNode[],
  location: SourcePosition
): ModelNode {
  return {
    type: NodeType.MODEL,
    name,
    fields,
    attributes,
    location
  };
}

/**
 * Create a field node
 */
export function createFieldNode(
  name: string,
  fieldType: TypeReferenceNode,
  isRequired: boolean,
  isArray: boolean,
  attributes: AttributeNode[],
  location: SourcePosition
): FieldNode {
  return {
    type: NodeType.FIELD,
    name,
    fieldType,
    isRequired,
    isArray,
    attributes,
    location
  };
}

/**
 * Create a type reference node
 */
export function createTypeReferenceNode(
  name: string,
  isArray: boolean,
  isRequired: boolean,
  location: SourcePosition
): TypeReferenceNode {
  return {
    name,
    isArray,
    isRequired,
    location
  };
}

/**
 * Create an attribute node
 */
export function createAttributeNode(
  name: string,
  isField: boolean,
  args: ArgumentNode[],
  location: SourcePosition
): AttributeNode {
  return {
    type: NodeType.ATTRIBUTE,
    name,
    isField,
    arguments: args,
    location
  };
}

/**
 * Create an argument node
 */
export function createArgumentNode(
  value: ValueNode,
  name: string | undefined,
  location: SourcePosition
): ArgumentNode {
  return {
    name,
    value,
    location
  };
}

/**
 * Create an enum node
 */
export function createEnumNode(
  name: string,
  values: string[],
  attributes: AttributeNode[],
  location: SourcePosition
): EnumNode {
  return {
    type: NodeType.ENUM,
    name,
    values,
    attributes,
    location
  };
}

/**
 * Create a type node
 */
export function createTypeNode(
  name: string,
  baseType: string | undefined,
  fields: FieldNode[] | undefined,
  attributes: AttributeNode[],
  location: SourcePosition
): TypeNode {
  return {
    type: NodeType.TYPE,
    name,
    baseType,
    fields,
    attributes,
    location
  };
}

/**
 * Create a view node
 */
export function createViewNode(
  name: string,
  fields: FieldNode[],
  attributes: AttributeNode[],
  isMaterialized: boolean,
  location: SourcePosition
): ViewNode {
  return {
    type: NodeType.VIEW,
    name,
    fields,
    attributes,
    isMaterialized,
    location
  };
}

/**
 * Create an identifier node
 */
export function createIdentifierNode(
  name: string,
  location: SourcePosition
): IdentifierNode {
  return {
    type: NodeType.IDENTIFIER,
    name,
    location
  };
}

/**
 * Create a string node
 */
export function createStringNode(
  value: string,
  location: SourcePosition
): StringNode {
  return {
    type: NodeType.STRING,
    value,
    location
  };
}

/**
 * Create a number node
 */
export function createNumberNode(
  value: number,
  location: SourcePosition
): NumberNode {
  return {
    type: NodeType.NUMBER,
    value,
    location
  };
}

/**
 * Create a boolean node
 */
export function createBooleanNode(
  value: boolean,
  location: SourcePosition
): BooleanNode {
  return {
    type: NodeType.BOOLEAN,
    value,
    location
  };
}

/**
 * Create a null node
 */
export function createNullNode(location: SourcePosition): NullNode {
  return {
    type: NodeType.NULL,
    location
  };
}

/**
 * Create an array node
 */
export function createArrayNode(
  elements: ValueNode[],
  location: SourcePosition
): ArrayNode {
  return {
    type: NodeType.ARRAY,
    elements,
    location
  };
}

/**
 * Create a function call node
 */
export function createFunctionCallNode(
  name: string,
  args: ValueNode[],
  location: SourcePosition
): FunctionCallNode {
  return {
    type: NodeType.CALL,
    name,
    arguments: args,
    location
  };
} 