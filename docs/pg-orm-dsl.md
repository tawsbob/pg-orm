# PG-ORM Domain Specific Languages (DSLs)

This document provides a comprehensive overview of the Domain Specific Languages used within the PG-ORM system.

## Table of Contents

- [Schema Definition Language](#schema-definition-language)
  - [Datasource Definition](#datasource-definition)
  - [Generator Configuration](#generator-configuration)
  - [Model Definition](#model-definition)
  - [Field Types and Attributes](#field-types-and-attributes)
  - [Relationships](#relationships)
  - [Indexes and Constraints](#indexes-and-constraints)
  - [PostgreSQL Extensions](#postgresql-extensions)
- [Query Language](#query-language)
- [Migration Language](#migration-language)

## Schema Definition Language

The Schema Definition Language (SDL) is the primary interface for defining your database schema in PG-ORM. It provides a declarative way to define models, relationships, indexes, and PostgreSQL-specific features.

### Datasource Definition

The `datasource` block defines the database connection:

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

| Property | Description |
|----------|-------------|
| provider | Database provider (currently only "postgresql" is supported) |
| url      | Connection URL, typically loaded from environment variables |

### Generator Configuration

The `generator` block configures code generation:

```
generator client {
  provider        = "pg-orm-client"
  output          = "./generated"
  binaryTargets   = ["native"]
}
```

| Property | Description |
|----------|-------------|
| provider | Generator to use (pg-orm-client is the default) |
| output   | Output directory for generated code |
| binaryTargets | Target platforms for any binary dependencies |

### Model Definition

Models represent database tables:

```
model User {
  id        Serial     @id
  email     String     @unique
  name      String?
  role      UserRole   @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@index([email], type: GIN)
  @@rls(using: "role != 'ADMIN'", check: "id = auth.user_id()")
}
```

### Field Types and Attributes

PG-ORM supports various field types and attributes:

| Type | Description |
|------|-------------|
| String | Text data |
| Int | Integer numbers |
| Float | Floating point numbers |
| Boolean | True/false values |
| DateTime | Date and time values |
| Serial | Auto-incrementing integer |
| Enum | Enumerated types |
| Json | JSON data |
| Uuid | UUID values |
| Geography | PostGIS spatial data |

Field attributes modify the behavior of fields:

| Attribute | Description |
|-----------|-------------|
| @id | Primary key |
| @unique | Unique constraint |
| @default(value) | Default value |
| @updatedAt | Automatically updated timestamp |
| @relation | Define relationships |
| @postgis.Point(srid) | Define PostGIS point with SRID |

### Relationships

PG-ORM supports various relationship types:

```
// One-to-many relationship
model User {
  id    Serial  @id
  posts Post[]
}

model Post {
  id       Serial @id
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}

// Many-to-many relationship
model Post {
  id   Serial @id
  tags Tag[]  @relation("PostToTag")
}

model Tag {
  id    Serial @id
  posts Post[] @relation("PostToTag")
}

// One-to-one relationship
model User {
  id      Serial   @id
  profile Profile?
}

model Profile {
  id     Serial @id
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
}
```

### Indexes and Constraints

PG-ORM provides rich support for PostgreSQL indexes and constraints:

```
model Post {
  id      Serial  @id
  title   String
  content String?
  
  @@index([title], type: GIN, opclass: "gin_trgm_ops")
  @@index([content], type: GIN, opclass: "gin_trgm_ops") @where("content IS NOT NULL")
}
```

| Index Type | Description |
|------------|-------------|
| BTREE | Default B-tree index |
| GIN | Generalized Inverted Index |
| GIST | Generalized Search Tree |
| HASH | Hash index |
| BRIN | Block Range Index |

### PostgreSQL Extensions

PG-ORM supports PostgreSQL-specific features:

#### Enum Types

```
enum UserRole {
  USER
  EDITOR
  ADMIN
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  
  @@pg.enum
}
```

#### Custom Types

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

#### Domains

```
type Email String {
  @@pg.domain
  @@pg.check("VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'")
}
```

#### Views and Materialized Views

```
view ActiveUsers {
  id    Int
  email String
  name  String

  @@pg.sql("SELECT id, email, name FROM \"User\" WHERE \"lastLoginAt\" > NOW() - INTERVAL '30 days'")
}

view PostStats @materialized {
  authorId      Int
  authorName    String
  postCount     Int
  avgPostLength Float

  @@pg.sql("SELECT u.id as \"authorId\", u.name as \"authorName\", COUNT(p.id) as \"postCount\", AVG(LENGTH(p.content)) as \"avgPostLength\" FROM \"User\" u JOIN \"Post\" p ON u.id = p.\"authorId\" GROUP BY u.id, u.name")
  @@pg.index(fields: [authorId], type: BTREE)
}
```

#### Table Partitioning

```
model Post {
  id        Serial  @id
  createdAt DateTime @default(now())
  
  @@partition(type: RANGE, by: [createdAt])
  @@createPartition(name: "posts_2023", values: ["2023-01-01", "2024-01-01"])
  @@createPartition(name: "posts_2024", values: ["2024-01-01", "2025-01-01"])
}
```

#### Row-Level Security (RLS)

```
model User {
  id   Serial    @id
  role UserRole  @default(USER)
  
  @@rls(using: "role != 'ADMIN'", check: "id = auth.user_id()")
}
```

## Query Language

PG-ORM provides a type-safe query builder that closely mirrors SQL but with enhanced type safety:

```typescript
// Example query (pseudocode)
const users = await db.user.findMany({
  where: {
    email: { contains: "example.com" },
    posts: { some: { published: true } }
  },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 5
    },
    profile: true
  },
  orderBy: { createdAt: "desc" }
});
```

The Query DSL supports:

- Complex filters with AND, OR, NOT conditions
- Nested relations with filtering and pagination
- Transaction support
- Raw SQL when needed
- Aggregation functions
- Geospatial queries through PostGIS integration

## Migration Language

Migrations in PG-ORM can be defined manually or generated automatically:

```typescript
// Example migration (pseudocode)
export const migration = {
  name: "add_location_field",
  up: sql`
    ALTER TABLE "Profile" ADD COLUMN "location" geography(Point,4326);
    CREATE INDEX "Profile_location_idx" ON "Profile" USING GIST ("location");
  `,
  down: sql`
    DROP INDEX "Profile_location_idx";
    ALTER TABLE "Profile" DROP COLUMN "location";
  `
};
```

The Migration DSL supports:

- Automatic diff detection between schema versions
- Manual migration customization
- Forward and backward migration support
- Migration history tracking
- Safe migration practices with transaction support 