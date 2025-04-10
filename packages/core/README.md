# @pg-orm/core

Core package for PG-ORM containing shared interfaces, types, and utilities.

## Overview

This package provides the foundational elements used across all PG-ORM packages, including:

- Core interfaces and types
- Shared utilities and helpers
- Error handling
- Configuration management
- Common constants

## Usage

This package is primarily used internally by other PG-ORM packages but can also be used directly for extending PG-ORM functionality.

```typescript
import { ModelDefinition, DataType } from '@pg-orm/core';

// Define model interfaces
const userModel: ModelDefinition = {
  name: 'User',
  fields: [
    { name: 'id', type: DataType.SERIAL, isPrimary: true },
    { name: 'email', type: DataType.STRING, isUnique: true },
    { name: 'createdAt', type: DataType.TIMESTAMP, defaultValue: 'now()' }
  ],
  indexes: [
    { fields: ['email'], type: 'BTREE' }
  ]
};