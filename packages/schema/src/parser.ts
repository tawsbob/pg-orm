/**
 * Schema parser for PG-ORM.
 * @packageDocumentation
 */

import { SchemaParsingError, ModelDefinition, FieldDefinition } from '@pg-orm/core';
import { Schema } from './types';
import { Parser } from './parser/parser';
import { SchemaNode } from './parser/ast/nodes';

/**
 * Parse schema definition language string into a Schema object
 */
export function parseSchema(schemaString: string): Schema {
  try {
    // Parse the schema string into an AST
    const parser = new Parser();
    const ast = parser.parse(schemaString);
    
    // Convert the AST to a schema
    const schema = convertAstToSchema(ast);
    
    return schema;
  } catch (error) {
    if (error instanceof Error) {
      throw new SchemaParsingError(`Error parsing schema: ${error.message}`);
    }
    throw new SchemaParsingError('Unknown error parsing schema');
  }
}

/**
 * Convert AST to Schema (Will be expanded as we implement more features)
 * For now, this is a simplified implementation that only converts models
 */
function convertAstToSchema(ast: SchemaNode): Schema {
  // Create a basic Schema object
  const schema: Schema = {
    models: [],
    enums: [],
    types: []
  };
  
  // Process models
  for (const model of ast.models) {
    // Convert fields
    const fields: FieldDefinition[] = model.fields.map(field => {
      // Basic field properties
      const fieldDef: FieldDefinition = {
        name: field.name,
        type: field.fieldType.name,
        isRequired: field.isRequired,
        isArray: field.isArray,
        attributes: {}
      };
      
      // Process field attributes
      for (const attr of field.attributes) {
        if (attr.name === 'id') {
          fieldDef.isPrimary = true;
        } else if (attr.name === 'unique') {
          fieldDef.isUnique = true;
        } else {
          // Store other attributes
          fieldDef.attributes![attr.name] = attr.arguments.map(arg => arg.value);
        }
      }
      
      return fieldDef;
    });
    
    // Create the model definition
    const modelDef: ModelDefinition = {
      name: model.name,
      fields: fields,
      attributes: {}
    };
    
    // Process model attributes
    if (model.attributes.length > 0) {
      for (const attr of model.attributes) {
        modelDef.attributes![attr.name] = attr.arguments.map(arg => arg.value);
      }
    }
    
    // Add to schema
    schema.models.push(modelDef);
  }
  
  return schema;
} 