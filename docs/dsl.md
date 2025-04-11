# PG-ORM Domain Specific Languages (DSLs)

This document outlines the various Domain Specific Languages used throughout PG-ORM.

## Schema Definition Language (SDL)

The Schema Definition Language is the primary way to define your database models and relationships in PG-ORM.

### Basic Model Definition

```
model User {
  id        Serial     @id
  email     String     @unique
  name      String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Field Types

| Type | PostgreSQL Type | Description |
|------|----------------|-------------|
| `String` | TEXT | Text data |
| `Int` | INTEGER | 32-bit integer |
| `BigInt` | BIGINT | 64-bit integer |
| `Float` | DOUBLE PRECISION | 64-bit floating point |
| `Decimal` | DECIMAL | Fixed-point decimal |
| `Boolean` | BOOLEAN | True/false value |
| `DateTime` | TIMESTAMP | Date and time |
| `Date` | DATE | Date without time |
| `Time` | TIME | Time without date |
| `Json` | JSONB | JSON data |
| `Bytes` | BYTEA | Binary data |
| `Serial` | SERIAL | Auto-incrementing integer |
| `BigSerial` | BIGSERIAL | Auto-incrementing 64-bit integer |
| `UUID` | UUID | Universally unique identifier |
| `Geography` | GEOGRAPHY | PostGIS geography type |
| `Geometry` | GEOMETRY | PostGIS geometry type |

### Field Modifiers

| Modifier | Example | Description |
|----------|---------|-------------|
| `@id` | `id Int @id` | Marks field as primary key |
| `@unique` | `email String @unique` | Creates a unique constraint |
| `@default()` | `role UserRole @default(USER)` | Sets a default value |
| `@updatedAt` | `updatedAt DateTime @updatedAt` | Automatically updates on record change |
| `@relation()` | `author User @relation(fields: [authorId], references: [id])` | Defines a relation between models |
| `?` | `name String?` | Marks a field as nullable |
| `[]` | `posts Post[]` | Defines a one-to-many relation |

### Model Modifiers

Model modifiers are applied to entire models using the `@@` prefix.

```
model Post {
  // fields here
  
  @@index([title], type: GIN, opclass: "gin_trgm_ops")
  @@partition(type: RANGE, by: [createdAt])
}
```

| Modifier | Example | Description |
|----------|---------|-------------|
| `@@index()` | `@@index([email], type: GIN)` | Creates an index |
| `@@rls()` | `@@rls(using: "role != 'ADMIN'", check: "id = auth.user_id()")` | Defines row-level security policy |
| `@@partition()` | `@@partition(type: RANGE, by: [createdAt])` | Configures table partitioning |
| `@@createPartition()` | `@@createPartition(name: "posts_2023", values: ["2023-01-01", "2024-01-01"])` | Creates a partition |
| `@@where()` | `@@index([content], type: GIN) @where("content IS NOT NULL")` | Adds a WHERE clause to an index |

### Enum Definition

```
enum UserRole {
  USER
  EDITOR
  ADMIN
  
  @@pg.enum
}
```

### Custom Types

```
type Address {
  street  String
  city    String
  state   String
  zip     String
  country String

  @@pg.type
}
```

### Custom Domains

```
type Email String {
  @@pg.domain
  @@pg.check("VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'")
}
```

### Views

```
view ActiveUsers {
  id    Int
  email String
  name  String

  @@pg.sql("SELECT id, email, name FROM \"User\" WHERE \"lastLoginAt\" > NOW() - INTERVAL '30 days'")
}
```

### Materialized Views

```
view PostStats @materialized {
  authorId      Int
  authorName    String
  postCount     Int
  avgPostLength Float

  @@pg.sql("SELECT u.id as \"authorId\", u.name as \"authorName\", COUNT(p.id) as \"postCount\", AVG(LENGTH(p.content)) as \"avgPostLength\" FROM \"User\" u JOIN \"Post\" p ON u.id = p.\"authorId\" GROUP BY u.id, u.name")
  @@pg.index(fields: [authorId], type: BTREE)
}
```

### Configuration Block

```
config {
  url      = env("DATABASE_URL")
}
```

## Query DSL

PG-ORM provides a type-safe query builder for interacting with your database.

### Basic Queries

```typescript
// Find all users
const users = await db.user.findMany()

// Find user by ID
const user = await db.user.findUnique({
  where: { id: 1 }
})

// Find with relations
const userWithPosts = await db.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
})
```

### Filtering

```typescript
// Complex filtering
const filteredUsers = await db.user.findMany({
  where: {
    OR: [
      { email: { contains: "example.com" } },
      { 
        AND: [
          { role: "EDITOR" },
          { createdAt: { gt: new Date("2023-01-01") } }
        ] 
      }
    ]
  }
})
```

### Creating Records

```typescript
// Create a user with a profile
const newUser = await db.user.create({
  data: {
    email: "user@example.com",
    name: "New User",
    profile: {
      create: {
        bio: "Hello world!"
      }
    }
  }
})
```

### Updating Records

```typescript
// Update a user
const updatedUser = await db.user.update({
  where: { id: 1 },
  data: {
    name: "Updated Name",
    posts: {
      update: {
        where: { id: 1 },
        data: { published: true }
      }
    }
  }
})
```

### Transactions

```typescript
// Execute operations in a transaction
const result = await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: "test@example.com", name: "Test User" } })
  const post = await tx.post.create({ 
    data: { 
      title: "Hello World",
      authorId: user.id
    } 
  })
  return { user, post }
})
```

## Migration DSL

PG-ORM's migration engine supports both declarative and programmatic migrations.

### Declarative Migrations

Migrations are typically generated automatically by comparing schema changes:

```bash
pg-orm migrate dev --name added_user_role
```

### Programmatic Migrations

For complex migrations, you can write SQL directly:

```typescript
// migrations/20230101000000_custom_migration.ts
import { Migration } from '@pg-orm/core'

export const migration: Migration = {
  up: async (db) => {
    await db.executeRaw(`
      CREATE EXTENSION IF NOT EXISTS postgis;
      CREATE INDEX idx_user_location ON "Profile" USING gist(location);
    `)
  },
  down: async (db) => {
    await db.executeRaw(`
      DROP INDEX IF EXISTS idx_user_location;
    `)
  }
}
```

## Extension DSLs

PG-ORM provides specialized DSLs for PostgreSQL extensions.

### PostGIS

```
model Location {
  id        Serial     @id
  name      String
  point     Geography  @postgis.Point(4326)
  area      Geometry   @postgis.Polygon(4326)
  
  @@index([point], type: GIST)
}
```

### Full-Text Search

```
model Document {
  id      Serial  @id
  title   String
  content String
  
  @@fts.index([title, content], name: "doc_search_idx", weights: [0.5, 1.0])
}

// Query using the FTS DSL
const docs = await db.document.findMany({
  where: {
    title: { fts: "search terms" }
  }
})
```

### pgVector

```
model Item {
  id        Serial       @id
  name      String
  embedding Vector(1536) @pgvector.embedding
  
  @@pgvector.index([embedding], type: IVF, lists: 100)
}

// Query using vector similarity
const similar = await db.item.findMany({
  where: {
    embedding: {
      nearest: [0.1, 0.2, ...] // 1536-dimension vector
    }
  },
  take: 10
})
``` 