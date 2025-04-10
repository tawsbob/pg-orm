# PG-ORM Architecture

This document outlines the technical architecture of PG-ORM, a PostgreSQL-focused ORM that exposes the full power of PostgreSQL through a declarative interface.

## Architectural Principles

PG-ORM is built on the following architectural principles:

1. **PostgreSQL First**: Every design decision prioritizes PostgreSQL capabilities over generic database compatibility.
2. **Type Safety**: Strong TypeScript types throughout the codebase and in generated client code.
3. **Modularity**: Core components are decoupled and can be used independently.
4. **Extensibility**: The system is designed to be extended with new PostgreSQL features.
5. **Developer Experience**: Intuitive APIs that simplify complex PostgreSQL features.
6. **Performance**: Optimizations specific to PostgreSQL's query planner and execution model.

## System Components

### Core Components

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│   Schema Layer    │────▶│   Client Layer    │────▶│  Database Layer   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
          │                        │                         │
          │                        │                         │
          ▼                        ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│  Schema Parser    │     │   Query Builder   │     │ Connection Manager│
└───────────────────┘     └───────────────────┘     └───────────────────┘
          │                        │                         │
          │                        │                         │
          ▼                        ▼                         ▼
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│ Migration Engine  │     │    Client API     │     │   Query Executor  │
└───────────────────┘     └───────────────────┘     └───────────────────┘
```

### Extension Layer

The extension layer provides specialized modules for PostgreSQL features:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Extension Layer                           │
└─────────────────────────────────────────────────────────────────────┘
          │                │                │                 │
          ▼                ▼                ▼                 ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ PostGIS Module│  │ pgVector Module│ │ RLS Module    │  │ FTS Module    │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
```

## Component Details

### Schema Layer

#### Schema Definition Language

The Schema Definition Language (SDL) is the primary interface for users to define their database schema. It is similar to Prisma's schema language but extended with PostgreSQL-specific features.

```
model User {
  id          Serial    @id
  email       String    @unique
  name        String?
  posts       Post[]
  location    Geography? @postgis.Point(4326)
  
  @@index([name], type: GIN)
  @@rls(using: "auth.uid() = id")
}
```

#### Schema Parser

The Schema Parser is responsible for:

- Parsing the SDL files
- Validating the schema against PostgreSQL constraints
- Generating an intermediate representation (IR) of the schema
- Detecting conflicts or potential issues

#### Migration Engine

The Migration Engine:

- Compares the current schema to the previous version
- Generates migration files with up/down SQL
- Applies migrations to the database
- Tracks migration history
- Provides rollback capabilities

### Client Layer

#### Type Generator

Generates TypeScript types from the schema definition:

- Model types
- Input types for operations
- Enum types
- Relation types

#### Query Builder

A type-safe, fluent interface for constructing SQL queries:

- Supports all CRUD operations
- Handles relations
- Provides aggregation functions
- Supports transactions
- Generates optimized PostgreSQL queries

#### Client API

The main interface for applications to interact with the database:

- Exposes model-specific methods
- Handles type transformations
- Provides transaction control
- Manages connection lifecycle

### Database Layer

#### Connection Manager

Handles database connections:

- Connection pooling
- Connection lifecycle
- Configuration management
- Connection retry logic
- Connection metrics

#### Query Executor

Executes SQL queries:

- Prepares statements
- Handles parameterization
- Executes queries
- Transforms results
- Error handling and retries

#### Result Transformer

Converts database results to application models:

- Type conversion
- Relation mapping
- Custom type handling
- Date/time normalization

### Extension Layer

The Extension Layer provides specialized modules for PostgreSQL extensions and features:

#### PostgreSQL Extensions Support

- **PostGIS**: Geospatial data types and operations
- **pgVector**: Vector similarity search
- **pgCrypto**: Cryptographic functions
- **TimescaleDB**: Time-series data
- **HStore**: Key-value data type

#### PostgreSQL Feature Adapters

- **Row-Level Security**: Policy definition and enforcement
- **Full-Text Search**: Configuration, indexing, and querying
- **JSON Operations**: Path expressions and containment
- **Table Partitioning**: Partition definition and management
- **Materialized Views**: Creation, indexing, and refreshing
- **Triggers**: Declarative trigger definition
- **LISTEN/NOTIFY**: Event subscription and handling

## Data Flow

### Schema to Database Flow

1. User defines schema in SDL
2. Schema parser validates and creates IR
3. Migration engine compares with previous schema
4. Migration engine generates migration SQL
5. Migration engine applies migrations to database

### Query Flow

1. Application uses generated client API
2. Client API calls query builder
3. Query builder generates SQL
4. Connection manager provides database connection
5. Query executor runs SQL against database
6. Result transformer converts results to application types
7. Client API returns typed results to application

## Extension Points

PG-ORM is designed to be extended in the following ways:

### Schema Extensions

New schema annotations and directives for PostgreSQL features:

```typescript
// Extension API
export interface SchemaExtension {
  name: string;
  directives: DirectiveDefinition[];
  modelAttributes: AttributeDefinition[];
  fieldAttributes: AttributeDefinition[];
  validate(schema: Schema): ValidationResult;
  generateSQL(context: SQLGenerationContext): string;
}
```

### Custom Types

Support for custom PostgreSQL types:

```typescript
// Custom Type API
export interface CustomTypeHandler<T, DBT> {
  pgType: string;
  tsType: string;
  toDB(value: T): DBT;
  fromDB(value: DBT): T;
  generateTypeScript(): string;
}
```

### Query Hooks

Hooks into the query generation and execution:

```typescript
// Query Hook API
export interface QueryHook {
  beforeQuery(query: Query): Query;
  afterQuery(result: QueryResult): QueryResult;
  onError(error: Error, query: Query): QueryResult | Error;
}
```

## Implementation Strategy

### Monorepo Structure

PG-ORM will be implemented as a monorepo with the following packages:

- `@pg-orm/core`: Core infrastructure and interfaces
- `@pg-orm/schema`: Schema definition and parsing
- `@pg-orm/client`: Generated client and query builder
- `@pg-orm/engine`: Database connection and query execution
- `@pg-orm/cli`: Command-line tools
- `@pg-orm/extensions`: PostgreSQL extension support
- `@pg-orm/generator`: Code generation utilities

### Dependency Graph

```
@pg-orm/core
  ↑
  ├─── @pg-orm/schema
  │      ↑
  │      ├─── @pg-orm/generator
  │      │      ↑
  │      │      └─── @pg-orm/cli
  │      │
  │      └─── @pg-orm/extensions
  │
  └─── @pg-orm/engine
         ↑
         └─── @pg-orm/client
```

### Technical Considerations

#### SQL Generation

SQL generation will use template literals with proper parameterization:

```typescript
function generateSQL(table: string, conditions: Condition[]): PreparedQuery {
  const whereClause = conditions
    .map((c, i) => `${c.field} ${c.operator} $${i + 1}`)
    .join(' AND ');
  
  return {
    text: `SELECT * FROM ${table} WHERE ${whereClause}`,
    values: conditions.map(c => c.value)
  };
}
```

#### Type Generation

TypeScript types will be generated using code templates:

```typescript
function generateModelType(model: Model): string {
  return `
export interface ${model.name} {
  ${model.fields.map(field => `${field.name}: ${mapToTsType(field)}`).join('\n  ')}
}
  `;
}
```

#### Connection Management

Connection pooling will use node-postgres with custom enhancements:

```typescript
class ConnectionManager {
  private pool: Pool;
  
  constructor(config: ConnectionConfig) {
    this.pool = new Pool({
      ...config,
      max: config.maxConnections || 10,
      idleTimeoutMillis: config.idleTimeout || 30000,
    });
  }
  
  async withConnection<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }
}
```

## Performance Optimization Strategies

### Query Optimization

- **Prepared Statements**: Cache and reuse prepared statements
- **Cursor Support**: Streaming large result sets
- **Batch Operations**: Batching multiple operations into single queries
- **Eager Loading**: Optimized relation loading
- **Index Hints**: Allow index usage hints

### Caching Strategies

- **Result Caching**: Cache query results with TTL
- **Schema Caching**: Cache introspected schema information
- **Metadata Caching**: Cache database metadata information
- **Connection Reuse**: Optimize connection lifecycle

### Benchmarking

Benchmarking infrastructure will be established to compare:

- Raw SQL performance
- PG-ORM performance
- Other ORM performance (Prisma, TypeORM, etc.)

## Security Considerations

### Query Safety

- Parameterized queries
- Input validation
- SQL injection prevention
- Type checking

### Authentication

- Support for PostgreSQL authentication methods
- Integration with connection pooling
- Credential management

### Authorization

- Row-level security policy definition
- Application-level permission checking
- Policy testing tools

## Testing Strategy

### Unit Testing

- Component-level testing with mocks
- Type generation testing
- Schema validation testing

### Integration Testing

- Database interaction testing with test containers
- Migration testing
- Full-stack integration testing

### Performance Testing

- Throughput testing
- Memory usage testing
- Connection handling testing
- Comparative benchmarking

## Conclusion

PG-ORM aims to provide a powerful, PostgreSQL-focused ORM that exposes the full capabilities of PostgreSQL through a declarative interface. By focusing exclusively on PostgreSQL, we can provide a better developer experience and more efficient database operations compared to general-purpose ORMs.

The modular architecture allows for extensibility and customization, while maintaining a cohesive and easy-to-use API. The strong emphasis on type safety and developer experience will make PG-ORM a valuable tool for TypeScript developers working with PostgreSQL. 