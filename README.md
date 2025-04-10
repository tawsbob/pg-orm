# PG-ORM: PostgreSQL-Focused ORM

## Project Overview

PG-ORM is a specialized Object-Relational Mapping (ORM) library designed specifically for PostgreSQL. Unlike general-purpose ORMs that abstract away database-specific features for portability, PG-ORM embraces PostgreSQL's rich feature set and exposes them through a declarative interface similar to Prisma.

### Key Differentiators

- **PostgreSQL-Exclusive**: Built specifically for PostgreSQL, without the compromises required for cross-database compatibility.
- **Full Feature Access**: Exposes PostgreSQL-specific features that are often unavailable in general-purpose ORMs.
- **Type Safety**: Provides strong TypeScript integration with generated types based on your schema.
- **Performance Optimized**: Takes advantage of PostgreSQL-specific optimizations not possible in generic ORMs.
- **Developer Experience**: Offers a declarative schema definition language and intuitive query API.

## Features

PG-ORM will support the following PostgreSQL-specific features:

- **Extensions**: Integration with popular extensions like PostGIS, pgvector, pgcrypto, etc.
- **Indexing**: Advanced index types (B-tree, Hash, GiST, SP-GiST, GIN, and BRIN)
- **Partitioning**: Table partitioning strategies (Range, List, Hash)
- **Row-Level Security**: Declarative definition of row-level security policies
- **Triggers and Procedures**: Simplified configuration of triggers and stored procedures
- **JSON/JSONB**: First-class support for JSON operations and indexing
- **Full-Text Search**: Integrated support for PostgreSQL's full-text search capabilities
- **Custom Data Types**: Support for custom data types and domains
- **Materialized Views**: Simplified creation and refreshing of materialized views
- **Inheritance**: Table inheritance support
- **Advisory Locks**: Interface for PostgreSQL's advisory locking mechanism
- **Pub/Sub with LISTEN/NOTIFY**: Event handling using PostgreSQL's pub/sub capabilities

## Architecture

### System Architecture

PG-ORM follows a layered architecture:

1. **Schema Layer**
   - Schema definition language
   - Schema parser and validator
   - Migration generator

2. **Client Layer**
   - Query builder
   - Model generation
   - Type generation

3. **Database Layer**
   - Connection pool management
   - Query execution
   - Result transformation

4. **Extension Layer**
   - Extension-specific APIs
   - Extension detection and configuration

### Core Components

![Architecture Diagram](docs/architecture.png)

#### Schema Definition

The schema definition provides a declarative way to define database structures, similar to Prisma schema, but with PostgreSQL-specific extensions.

#### Code Generator

Generates TypeScript types and client code based on the schema definition.

#### Query Builder

A type-safe query builder that translates method chains into SQL queries.

#### Migration Engine

Generates and applies migrations based on schema changes.

#### Connection Manager

Manages database connections with connection pooling and transaction support.

#### PostgreSQL Feature Adapters

Specialized modules for each PostgreSQL feature (extensions, policies, etc.)

## Design Patterns

PG-ORM employs several design patterns to maintain a clean and maintainable codebase:

### Repository Pattern

Models interact with the database through repositories, which encapsulate the data access logic.

### Builder Pattern

The query builder uses a fluent interface with method chaining to construct queries.

### Factory Pattern

Client instances are created through factories that configure the necessary dependencies.

### Adapter Pattern

PostgreSQL-specific features are exposed through adapters that translate between the ORM API and the underlying database capabilities.

### Singleton Pattern

Connection pools and configuration are managed as singletons.

### Observer Pattern

For features like LISTEN/NOTIFY, an event system allows subscribing to database events.

## Development Roadmap

### Phase 1: Core Framework

- Schema definition language
- Basic CRUD operations
- Connection management
- Type generation

### Phase 2: Migration System

- Schema diff detection
- Migration file generation
- Migration application

### Phase 3: PostgreSQL Features

- Extension support
- Advanced indexing
- Row-level security
- JSON operations

### Phase 4: Advanced Features

- Triggers and procedures
- Partitioning
- Materialized views
- Full-text search

### Phase 5: Performance and Scaling

- Query optimization
- Prepared statements
- Connection pooling optimizations
- Caching strategies

## Project Structure

```
pg-orm/
├── packages/
│   ├── core/               # Core ORM functionality
│   ├── cli/                # Command-line interface
│   ├── generator/          # Code generator
│   ├── client/             # Client API
│   ├── engine/             # Database interaction
│   └── extensions/         # PostgreSQL extensions
├── examples/               # Example projects
├── docs/                   # Documentation
└── tests/                  # Test suite
```

## Technical Stack

- **Language**: TypeScript
- **Database**: PostgreSQL 12+
- **Development Tools**: Jest, ESLint, Prettier
- **Build System**: esbuild or SWC
- **Documentation**: TypeDoc

## Comparison with Existing Solutions

| Feature | PG-ORM | Prisma | TypeORM | Sequelize |
|---------|--------|--------|---------|-----------|
| PostgreSQL Extensions | ✅ | ❌ | ⚠️ | ❌ |
| Row-Level Security | ✅ | ❌ | ❌ | ❌ |
| Advanced Indexing | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Table Partitioning | ✅ | ❌ | ❌ | ❌ |
| JSON Operations | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Full-Text Search | ✅ | ❌ | ⚠️ | ❌ |
| Multi-DB Support | ❌ | ✅ | ✅ | ✅ |

✅ Full support  ⚠️ Limited support  ❌ No support

## Development

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pg-orm.git
   cd pg-orm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build all packages:
   ```bash
   npm run build
   ```

### Scripts

- `npm run build`: Build all packages
- `npm run test`: Run tests for all packages
- `npm run lint`: Lint all packages
- `npm run format`: Format code with Prettier

### Monorepo Structure

This project uses a monorepo structure with the following packages:

- `@pg-orm/core`: Core types and utilities
- `@pg-orm/schema`: Schema definition and parsing
- `@pg-orm/engine`: Database connection and query execution
- `@pg-orm/client`: Client API for database operations
- `@pg-orm/generator`: Code generation from schema
- `@pg-orm/cli`: Command-line interface
- `@pg-orm/extensions`: PostgreSQL extension support

Each package has its own `package.json` and can be built and tested individually.

## Getting Started (Future Documentation)

```typescript
// Schema definition (schema.pg)
model User {
  id          Serial    @id
  email       String    @unique
  name        String?
  role        UserRole  @default(USER)
  profile     Profile?
  posts       Post[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([email], type: GIN)
  @@rls(using: "role != 'ADMIN'", check: "id = auth.user_id()")
}

// Generated client usage
const user = await db.user.findUnique({
  where: { email: 'example@example.com' },
  include: { profile: true, posts: true }
});
```

## Contributing

Guidelines for contributing to the project will be developed as the project progresses.

## License

MIT 