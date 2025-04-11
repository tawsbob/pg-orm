# Schema Definition Language Parser - Implementation Plan

## Overview
This document outlines the implementation plan for the PG-ORM schema definition language parser. The parser will be responsible for converting the schema definition language (SDL) into an intermediate representation (IR) that can be used by other components of the system.

## Components to Implement

### 1. Lexer/Tokenizer
- [x] Create a tokenizer function to convert raw text into a stream of tokens
- [x] Implement token types (identifiers, keywords, strings, etc.)
- [x] Handle comments and whitespace
- [x] Track source positions for error reporting
- [x] Add tests for the tokenizer

### 2. Parser
- [x] Create a recursive descent parser for the schema language
- [ ] Implement parsing for datasource blocks
- [ ] Implement parsing for generator blocks
- [x] Implement parsing for model definitions
- [ ] Implement parsing for enum definitions
- [ ] Implement parsing for type definitions
- [ ] Implement parsing for view definitions
- [x] Implement parsing for fields and attributes
- [x] Handle error recovery and reporting
- [x] Add tests for the parser

### 3. AST Builder
- [x] Define AST node types for each language construct
- [x] Create AST builder functions for each node type
- [ ] Handle validation of AST nodes
- [x] Add tests for AST construction

### 4. Schema Generator
- [ ] Convert AST to schema IR
- [ ] Resolve references between models
- [ ] Validate relationships
- [ ] Generate full schema representation
- [ ] Add tests for schema generation

## Implementation Order

The implementation will be done in stages:

1. **Stage 1: Core Tokenization**
   - [x] Implement basic tokenizer
   - [x] Handle common tokens like identifiers, keywords, punctuation

2. **Stage 2: Basic Parsing**
   - [x] Parse simple model definitions
   - [x] Parse field definitions with basic types

3. **Stage 3: Attributes and Decorators**
   - [x] Parse field attributes (e.g., @id, @unique)
   - [x] Parse model attributes (e.g., @@index)

4. **Stage 4: Advanced Language Features**
   - [ ] Parse enum definitions
   - [ ] Parse custom type definitions
   - [ ] Parse view definitions

5. **Stage 5: PostgreSQL-Specific Features**
   - [ ] Parse PostgreSQL-specific types and attributes
   - [ ] Handle extensions and special features

## Testing Strategy

Each component will have its own set of unit tests:

- [x] **Tokenizer Tests**: Test individual token recognition
- [x] **Parser Tests**: Test parsing of different schema components
- [x] **AST Tests**: Test correct AST construction (through parser tests)
- [ ] **Schema Generator Tests**: Test correct schema generation
- [ ] **Integration Tests**: Test end-to-end parsing of complete schemas

Each test case will be in its own file to ensure clean separation and easy maintenance.

## Next Steps

1. Implement enum definition parsing
2. Implement type definition parsing
3. Implement view definition parsing
4. Implement datasource and generator blocks parsing
5. Create schema generator from AST 