# @pg-orm/generator

Code generation package for PG-ORM.

## Overview

This package handles code generation for PG-ORM, including:

- TypeScript type generation
- Client code generation
- Migration file generation
- Schema artifact generation

## Features

- Generate TypeScript types from schema
- Create client code with model-specific methods
- Generate migration files
- Create schema visualization assets
- Generate database documentation

## Usage

```typescript
import { generateClient, generateTypes } from '@pg-orm/generator';
import { Schema } from '@pg-orm/schema';

// Generate TypeScript types
const types = generateTypes(schema, {
  outputDir: './generated',
  prettier: true
});

// Generate client code
const client = generateClient(schema, {
  outputDir: './generated',
  prettier: true,
  includeComments: true
});

// Generate both at once
const { typesPath, clientPath } = await generateArtifacts(schema, {
  outputDir: './generated',
  prettier: true,
  includeComments: true
});

console.log(`Generated types at ${typesPath}`);
console.log(`Generated client at ${clientPath}`);
``` 