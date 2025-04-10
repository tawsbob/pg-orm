/**
 * Schema validator for PG-ORM.
 * @packageDocumentation
 */

import { SchemaValidationError } from '@pg-orm/core';
import { Schema } from './types';

/**
 * Result of schema validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error
 */
export interface ValidationError {
  message: string;
  path?: string;
}

/**
 * Validate a schema
 * This is a placeholder implementation that will be expanded later
 */
export function validateSchema(schema: Schema): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Validate model names are unique
  const modelNames = new Set<string>();
  for (const model of schema.models) {
    if (modelNames.has(model.name)) {
      errors.push({
        message: `Duplicate model name: ${model.name}`,
        path: `models.${model.name}`
      });
    }
    modelNames.add(model.name);
  }
  
  // Validate enum names are unique
  const enumNames = new Set<string>();
  for (const enumDef of schema.enums) {
    if (enumNames.has(enumDef.name)) {
      errors.push({
        message: `Duplicate enum name: ${enumDef.name}`,
        path: `enums.${enumDef.name}`
      });
    }
    enumNames.add(enumDef.name);
  }
  
  // Validate type names are unique
  const typeNames = new Set<string>();
  for (const typeDef of schema.types) {
    if (typeNames.has(typeDef.name)) {
      errors.push({
        message: `Duplicate type name: ${typeDef.name}`,
        path: `types.${typeDef.name}`
      });
    }
    typeNames.add(typeDef.name);
  }
  
  // Check for name collisions across models, enums, and types
  const allNames = [...modelNames, ...enumNames, ...typeNames];
  const duplicateNames = allNames.filter((name, index) => allNames.indexOf(name) !== index);
  for (const name of duplicateNames) {
    errors.push({
      message: `Name collision across schema elements: ${name}`,
      path: name
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Throw an error if schema is invalid
 */
export function assertValidSchema(schema: Schema): void {
  const result = validateSchema(schema);
  if (!result.isValid) {
    const messages = result.errors.map(err => `- ${err.message}`).join('\n');
    throw new SchemaValidationError(`Schema validation failed:\n${messages}`);
  }
} 