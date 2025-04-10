# @pg-orm/schema

Schema definition and parsing package for PG-ORM.

## Overview

This package handles the parsing and validation of schema definitions, including:

- Schema definition language parser
- Schema validation rules
- Intermediate representation generation
- Schema metadata handling

## Features

- Parse schema files in PG-ORM schema definition language
- Validate schema against PostgreSQL constraints
- Generate intermediate representations for code generation
- Support for all PostgreSQL data types and constraints
- PostgreSQL-specific schema extensions

## Usage

```typescript
import { parseSchema } from '@pg-orm/schema';

const schema = parseSchema(`
  model User {
    id        Serial   @id
    email     String   @unique
    name      String?
    posts     Post[]
    createdAt DateTime @default(now())
  }
  
  model Post {
    id        Serial   @id
    title     String
    content   String?
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
  }
`);

console.log(schema.models); // Array of parsed model definitions
``` 