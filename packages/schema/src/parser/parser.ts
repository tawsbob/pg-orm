/**
 * Parser for the schema definition language
 */
import { SchemaParsingError } from '@pg-orm/core';
import { Token, TokenType } from './tokens';
import { tokenize } from './tokenizer';
import {
  SchemaNode,
  ModelNode,
  FieldNode,
  AttributeNode,
  ValueNode,
  ArgumentNode,
  createSchemaNode,
  createModelNode,
  createFieldNode,
  createTypeReferenceNode,
  createAttributeNode,
  createArgumentNode,
  createIdentifierNode,
  createStringNode,
  createNumberNode,
  createBooleanNode,
  createArrayNode
} from './ast';

/**
 * Parser class for the schema definition language
 */
export class Parser {
  private tokens: Token[] = [];
  private current = 0;

  /**
   * Parse a schema string into an AST
   */
  public parse(input: string): SchemaNode {
    // Tokenize the input
    this.tokens = tokenize(input);
    this.current = 0;

    // Create the schema node
    const schema = createSchemaNode(this.peek().position);

    // Parse the schema contents
    while (!this.isAtEnd()) {
      try {
        // Skip comments
        if (this.check(TokenType.COMMENT)) {
          this.advance();
          continue;
        }

        // Parse a top-level definition
        if (this.match(TokenType.KEYWORD)) {
          const keyword = this.previous().value;
          
          switch (keyword) {
            case 'model':
              schema.models.push(this.parseModel());
              break;
            // Other top-level definitions will be added here
            default:
              throw this.error(`Unexpected keyword: ${keyword}`);
          }
        } else {
          throw this.error(`Unexpected token: ${this.peek().value}`);
        }
      } catch (error) {
        // Skip to the next definition on error to allow partial parsing
        this.synchronize();
      }
    }

    return schema;
  }

  /**
   * Parse a model definition
   */
  private parseModel(): ModelNode {
    // Get the position from the 'model' keyword
    const location = this.previous().position;
    
    // Parse the model name
    const name = this.consume(TokenType.IDENTIFIER, 'Expected model name').value;
    
    // Parse the model body
    this.consume(TokenType.BRACE_LEFT, 'Expected "{" after model name');
    
    const fields: FieldNode[] = [];
    const attributes: AttributeNode[] = [];
    
    // Parse fields and model attributes
    while (!this.check(TokenType.BRACE_RIGHT) && !this.isAtEnd()) {
      // Skip comments
      if (this.check(TokenType.COMMENT)) {
        this.advance();
        continue;
      }
      
      // Parse model attributes (@@attribute)
      if (this.match(TokenType.AT_AT)) {
        attributes.push(this.parseAttribute(false));
        continue;
      }
      
      // Parse fields
      fields.push(this.parseField());
    }
    
    this.consume(TokenType.BRACE_RIGHT, 'Expected "}" after model body');
    
    return createModelNode(name, fields, attributes, location);
  }

  /**
   * Parse a field definition
   */
  private parseField(): FieldNode {
    const location = this.peek().position;
    
    // Parse field name
    const name = this.consume(TokenType.IDENTIFIER, 'Expected field name').value;
    
    // Parse field type
    const typeToken = this.consume(TokenType.IDENTIFIER, 'Expected field type');
    
    // Check if the type is an array
    let isArray = false;
    if (this.match(TokenType.BRACKET_LEFT)) {
      this.consume(TokenType.BRACKET_RIGHT, 'Expected "]" after "["');
      isArray = true;
    }
    
    // Check if the type is optional
    let isRequired = true;
    if (this.match(TokenType.QUESTION)) {
      isRequired = false;
    }
    
    // Create the type reference
    const fieldType = createTypeReferenceNode(
      typeToken.value,
      isArray,
      isRequired,
      typeToken.position
    );
    
    // Parse field attributes
    const attributes: AttributeNode[] = [];
    while (this.match(TokenType.AT)) {
      attributes.push(this.parseAttribute(true));
    }
    
    return createFieldNode(name, fieldType, isRequired, isArray, attributes, location);
  }

  /**
   * Parse an attribute (@attribute or @@attribute)
   */
  private parseAttribute(isField: boolean): AttributeNode {
    const location = this.previous().position;
    
    // Parse attribute name
    const name = this.consume(TokenType.IDENTIFIER, 'Expected attribute name').value;
    
    // Parse attribute arguments
    const args: ArgumentNode[] = [];
    
    if (this.match(TokenType.PAREN_LEFT)) {
      // Parse arguments list
      if (!this.check(TokenType.PAREN_RIGHT)) {
        do {
          args.push(this.parseArgument());
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.PAREN_RIGHT, 'Expected ")" after arguments');
    }
    
    return createAttributeNode(name, isField, args, location);
  }

  /**
   * Parse an argument to an attribute
   */
  private parseArgument(): ArgumentNode {
    const location = this.peek().position;
    
    // Check for named argument (name: value)
    let name: string | undefined;
    if (this.check(TokenType.IDENTIFIER) && this.peekNext().type === TokenType.COLON) {
      name = this.advance().value;
      this.consume(TokenType.COLON, 'Expected ":" after argument name');
    }
    
    // Parse argument value
    const value = this.parseValue();
    
    return createArgumentNode(value, name, location);
  }

  /**
   * Parse a value (string, number, boolean, identifier, array)
   */
  private parseValue(): ValueNode {
    const token = this.peek();
    
    if (this.match(TokenType.STRING)) {
      // Remove quotes from string value
      const str = this.previous().value;
      const value = str.substring(1, str.length - 1);
      return createStringNode(value, token.position);
    }
    
    if (this.match(TokenType.NUMBER)) {
      return createNumberNode(parseFloat(this.previous().value), token.position);
    }
    
    if (this.match(TokenType.BOOLEAN)) {
      return createBooleanNode(this.previous().value === 'true', token.position);
    }
    
    if (this.match(TokenType.BRACKET_LEFT)) {
      // Parse array elements
      const elements: ValueNode[] = [];
      
      if (!this.check(TokenType.BRACKET_RIGHT)) {
        do {
          elements.push(this.parseValue());
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.BRACKET_RIGHT, 'Expected "]" after array elements');
      
      return createArrayNode(elements, token.position);
    }
    
    if (this.match(TokenType.IDENTIFIER)) {
      return createIdentifierNode(this.previous().value, token.position);
    }
    
    throw this.error(`Expected value, got ${this.peek().type}`);
  }

  /**
   * Helper function to report an error and create an error object
   */
  private error(message: string): SchemaParsingError {
    const token = this.peek();
    return new SchemaParsingError(
      `${message} at line ${token.position.line}, column ${token.position.column}`
    );
  }

  /**
   * Helper function to synchronize parser state after an error
   */
  private synchronize(): void {
    this.advance();
    
    while (!this.isAtEnd()) {
      // Skip until we find a keyword that could start a new definition
      if (this.previous().type === TokenType.BRACE_RIGHT) return;
      
      if (this.check(TokenType.KEYWORD)) {
        const value = this.peek().value;
        if (value === 'model' || value === 'enum' || value === 'type' || value === 'view' || 
            value === 'datasource' || value === 'generator') {
          return;
        }
      }
      
      this.advance();
    }
  }

  /**
   * Helper function to check if the current token matches a type
   */
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * Helper function to check if we've reached the end of the tokens
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Helper function to peek at the current token
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Helper function to peek at the next token
   */
  private peekNext(): Token {
    if (this.current + 1 >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.current + 1];
  }

  /**
   * Helper function to consume the current token and move to the next
   */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * Helper function to get the previous token
   */
  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  /**
   * Helper function to check if the current token matches a type, and if so, consume it
   */
  private match(type: TokenType): boolean {
    if (this.check(type)) {
      this.advance();
      return true;
    }
    return false;
  }

  /**
   * Helper function to consume a token of a specific type
   */
  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(message);
  }
} 