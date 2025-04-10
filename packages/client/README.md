# @pg-orm/client

Client package for PG-ORM providing the main interface for database operations.

## Overview

This package provides the client API for interacting with PostgreSQL through PG-ORM, including:

- Model-specific client interfaces
- Query building and execution
- Relation handling
- Type-safe query methods
- Transaction support

## Features

- Type-safe CRUD operations
- Relation loading and filtering
- Transaction management
- Pagination and sorting
- Field selection
- Aggregation functions

## Usage

```typescript
import { createClient } from '@pg-orm/client';

// Create client from connection string
const db = createClient('postgresql://user:password@localhost:5432/mydb');

// Create user
const user = await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'Hello World', content: 'My first post' }
      ]
    }
  }
});

// Find user with relations
const userWithPosts = await db.user.findUnique({
  where: { email: 'user@example.com' },
  include: { posts: true }
});

// Update user
const updatedUser = await db.user.update({
  where: { id: user.id },
  data: { name: 'Jane Doe' }
});

// Transaction example
const [user, post] = await db.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'transaction@example.com', name: 'Transaction User' }
  });
  
  const post = await tx.post.create({
    data: {
      title: 'Transaction Post',
      authorId: user.id
    }
  });
  
  return [user, post];
});
``` 