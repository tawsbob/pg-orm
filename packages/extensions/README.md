# @pg-orm/extensions

PostgreSQL extension support for PG-ORM.

## Overview

This package provides support for PostgreSQL extensions and specialized features in PG-ORM, including:

- Extension integration
- PostgreSQL-specific features
- Advanced data types
- Feature-specific APIs

## Supported Extensions

- **PostGIS**: Geospatial data types and functions
- **pgVector**: Vector similarity search
- **pgCrypto**: Cryptographic functions
- **TimescaleDB**: Time-series data
- **HStore**: Key-value data type
- **pg_trgm**: Trigram-based similarity
- **uuid-ossp**: UUID generation

## Supported PostgreSQL Features

- **Row-Level Security**: Policy definition and enforcement
- **Full-Text Search**: Configuration, indexing, and searching
- **Table Partitioning**: Range, list, and hash partitioning
- **JSON Operations**: JSONB path expressions and functions
- **Materialized Views**: Creation and refreshing
- **Triggers and Procedures**: Simplified management
- **LISTEN/NOTIFY**: Event-based communication

## Usage

```typescript
import { createClient } from '@pg-orm/client';
import { PostGIS, RowLevelSecurity } from '@pg-orm/extensions';

// Create client with extensions
const db = createClient('postgresql://user:password@localhost:5432/mydb', {
  extensions: [
    new PostGIS(),
    new RowLevelSecurity()
  ]
});

// Use PostGIS types and functions
const locations = await db.$queryRaw`
  SELECT ST_AsGeoJSON(location) as location
  FROM places
  WHERE ST_DWithin(
    location,
    ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326),
    ${radius}
  )
`;

// Define RLS policies
await db.$executeRaw`
  CREATE POLICY user_tenancy ON users
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
`;

// Set RLS context
await db.$setContext('app.tenant_id', tenantId);
``` 