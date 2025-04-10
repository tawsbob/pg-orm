# PG-ORM Architecture Overview

## System Components

PG-ORM follows a layered architecture with the following main components:

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

## Data Flow

### Schema to Database Flow

```mermaid
sequenceDiagram
    participant User
    participant SchemaParser
    participant MigrationEngine
    participant Database
    
    User->>SchemaParser: Define schema in SDL
    SchemaParser->>SchemaParser: Validate schema
    SchemaParser->>MigrationEngine: Generate IR
    MigrationEngine->>MigrationEngine: Compare with previous schema
    MigrationEngine->>MigrationEngine: Generate migration SQL
    MigrationEngine->>Database: Apply migration
    Database-->>User: Confirmation
```

### Query Flow

```mermaid
sequenceDiagram
    participant App
    participant ClientAPI
    participant QueryBuilder
    participant ConnectionManager
    participant QueryExecutor
    participant ResultTransformer
    participant Database
    
    App->>ClientAPI: Make query request
    ClientAPI->>QueryBuilder: Build query
    QueryBuilder->>QueryBuilder: Generate SQL
    QueryBuilder->>ConnectionManager: Get connection
    ConnectionManager->>QueryExecutor: Execute query
    QueryExecutor->>Database: Run SQL
    Database-->>QueryExecutor: Return results
    QueryExecutor->>ResultTransformer: Transform results
    ResultTransformer-->>ClientAPI: Return typed results
    ClientAPI-->>App: Return data
```

## Package Structure

```mermaid
graph TD
    Core[pg-orm/core] --> Schema[pg-orm/schema]
    Core --> Engine[pg-orm/engine]
    Schema --> Generator[pg-orm/generator]
    Schema --> Extensions[pg-orm/extensions]
    Generator --> CLI[pg-orm/cli]
    Engine --> Client[pg-orm/client]
```

## Developer Workflow

```mermaid
graph LR
    A[Define Schema] --> B[Generate Client]
    B --> C[Create Migration]
    C --> D[Apply Migration]
    D --> E[Use Client API]
    E --> F[Update Schema]
    F --> B
```

## Component Responsibilities

| Component | Primary Responsibilities |
|-----------|--------------------------|
| Schema Parser | Parse SDL, validate schema, generate IR |
| Migration Engine | Generate migrations, apply to database |
| Type Generator | Generate TypeScript types from schema |
| Query Builder | Build type-safe SQL queries |
| Connection Manager | Manage database connections and pools |
| Query Executor | Execute SQL, handle parameters and results |
| Extension Modules | Provide PostgreSQL-specific feature support | 