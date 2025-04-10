# @pg-orm/engine

Database interaction engine for PG-ORM handling connections and query execution.

## Overview

This package handles the low-level database interaction for PG-ORM, including:

- Connection management
- Query execution
- Transaction handling
- Result mapping
- Error handling

## Features

- Connection pooling
- Prepared statement handling
- Query parameterization
- Transaction management
- Result transformation
- Error classification and recovery

## Usage

```typescript
import { createEngine } from '@pg-orm/engine';

// Create database engine
const engine = createEngine({
  connectionString: 'postgresql://user:password@localhost:5432/mydb',
  poolSize: 10,
  idleTimeout: 30000
});

// Execute a query
const result = await engine.query({
  text: 'SELECT * FROM users WHERE email = $1',
  values: ['user@example.com']
});

// Execute in transaction
await engine.transaction(async (client) => {
  await client.query({
    text: 'INSERT INTO users (email, name) VALUES ($1, $2)',
    values: ['user@example.com', 'John Doe']
  });
  
  await client.query({
    text: 'INSERT INTO posts (title, author_id) VALUES ($1, $2)',
    values: ['Hello World', 1]
  });
});

// Close connections
await engine.disconnect();
``` 