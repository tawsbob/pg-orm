# @pg-orm/cli

Command-line interface for PG-ORM.

## Overview

This package provides a command-line interface for PG-ORM, enabling:

- Schema management
- Migration handling
- Client generation
- Database operations
- Development tools

## Features

- Initialize new PG-ORM projects
- Generate and apply migrations
- Generate client code
- Introspect existing databases
- Visualize schema
- Database seeding

## Installation

```bash
npm install -g @pg-orm/cli
```

## Usage

```bash
# Initialize a new project
pg-orm init

# Generate schema from an existing database
pg-orm introspect --connection "postgresql://user:password@localhost:5432/mydb"

# Generate client
pg-orm generate

# Create a migration
pg-orm migrate create --name "add_user_table"

# Apply migrations
pg-orm migrate up

# Rollback migrations
pg-orm migrate down

# Seed database
pg-orm seed --file ./seeds/development.ts

# Show schema visualization
pg-orm schema visualize
``` 