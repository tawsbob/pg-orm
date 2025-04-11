/**
 * Tokenizer for the schema language
 */
import { TokenType, Token, SourcePosition, createToken, KEYWORDS } from './tokens';

/**
 * Tokenizes a schema string into a list of tokens
 */
export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const inputLength = input.length;
  
  const position: SourcePosition = {
    line: 1,
    column: 1,
    offset: 0
  };
  
  /**
   * Update position based on character
   */
  function updatePosition(char: string): void {
    if (char === '\n') {
      position.line++;
      position.column = 1;
    } else {
      position.column++;
    }
    position.offset++;
  }
  
  /**
   * Create a source position object at the current position
   */
  function currentPosition(): SourcePosition {
    return { ...position };
  }
  
  /**
   * Read a string of characters that match a predicate
   */
  function readWhile(predicate: (char: string) => boolean): string {
    let result = '';
    while (position.offset < inputLength) {
      const char = input[position.offset];
      if (predicate(char)) {
        result += char;
        updatePosition(char);
      } else {
        break;
      }
    }
    return result;
  }
  
  /**
   * Check if character is a whitespace
   */
  function isWhitespace(char: string): boolean {
    return /\s/.test(char);
  }
  
  /**
   * Check if character can be part of an identifier
   */
  function isIdentifierChar(char: string): boolean {
    return /[a-zA-Z0-9_]/.test(char);
  }
  
  /**
   * Check if character is a digit
   */
  function isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }
  
  /**
   * Parse a line comment (// ...)
   */
  function readLineComment(): Token {
    const start = currentPosition();
    
    // Skip the '//'
    updatePosition('/');
    updatePosition('/');
    
    // Read until end of line or end of file
    const commentText = readWhile(char => char !== '\n');
    
    return createToken(TokenType.COMMENT, '//' + commentText, start);
  }
  
  /**
   * Parse a block comment (/* ... *\/)
   */
  function readBlockComment(): Token {
    const start = currentPosition();
    
    // Skip the '/*'
    updatePosition('/');
    updatePosition('*');
    
    let commentText = '';
    let ended = false;
    
    while (position.offset < inputLength && !ended) {
      const char = input[position.offset];
      if (char === '*' && position.offset + 1 < inputLength && input[position.offset + 1] === '/') {
        updatePosition('*');
        updatePosition('/');
        ended = true;
      } else {
        commentText += char;
        updatePosition(char);
      }
    }
    
    return createToken(TokenType.COMMENT, '/*' + commentText + '*/', start);
  }
  
  /**
   * Parse a string literal
   */
  function readString(quote: string): Token {
    const start = currentPosition();
    let value = quote; // Include the opening quote
    
    // Skip the opening quote
    updatePosition(quote);
    
    let ended = false;
    
    while (position.offset < inputLength && !ended) {
      const char = input[position.offset];
      
      if (char === '\\') {
        // This is an escape sequence, so consume the backslash and the next character
        value += char; // Add the backslash to the value
        updatePosition(char);
        
        if (position.offset < inputLength) {
          const nextChar = input[position.offset];
          value += nextChar; // Add the escaped character to the value
          updatePosition(nextChar);
        }
      } else if (char === quote) {
        // End of string
        value += char; // Add the closing quote
        updatePosition(char);
        ended = true;
      } else {
        value += char;
        updatePosition(char);
      }
    }
    
    return createToken(TokenType.STRING, value, start);
  }
  
  /**
   * Parse a number literal
   */
  function readNumber(): Token {
    const start = currentPosition();
    
    let numberStr = readWhile(isDigit);
    
    // Handle decimal point
    if (position.offset < inputLength && input[position.offset] === '.') {
      updatePosition('.');
      numberStr += '.';
      numberStr += readWhile(isDigit);
    }
    
    return createToken(TokenType.NUMBER, numberStr, start);
  }
  
  /**
   * Parse an identifier or keyword
   */
  function readIdentifier(): Token {
    const start = currentPosition();
    
    const value = readWhile(isIdentifierChar);
    
    // Check if this is a boolean literal
    if (value === 'true' || value === 'false') {
      return createToken(TokenType.BOOLEAN, value, start);
    }
    
    // Check if this is a keyword
    if (KEYWORDS.has(value)) {
      return createToken(TokenType.KEYWORD, value, start);
    }
    
    return createToken(TokenType.IDENTIFIER, value, start);
  }
  
  // Main tokenization loop
  while (position.offset < inputLength) {
    const char = input[position.offset];
    
    // Handle whitespace
    if (isWhitespace(char)) {
      readWhile(isWhitespace);
      continue;
    }
    
    // Handle comments
    if (char === '/' && position.offset + 1 < inputLength) {
      const nextChar = input[position.offset + 1];
      if (nextChar === '/') {
        tokens.push(readLineComment());
        continue;
      } else if (nextChar === '*') {
        tokens.push(readBlockComment());
        continue;
      }
    }
    
    // Handle string literals
    if (char === '"' || char === "'") {
      tokens.push(readString(char));
      continue;
    }
    
    // Handle number literals
    if (isDigit(char)) {
      tokens.push(readNumber());
      continue;
    }
    
    // Handle identifiers and keywords
    if (isIdentifierChar(char)) {
      tokens.push(readIdentifier());
      continue;
    }
    
    // Handle operators and punctuation
    const tokenStart = currentPosition();
    
    switch (char) {
      case '{':
        tokens.push(createToken(TokenType.BRACE_LEFT, char, tokenStart));
        break;
      case '}':
        tokens.push(createToken(TokenType.BRACE_RIGHT, char, tokenStart));
        break;
      case '[':
        tokens.push(createToken(TokenType.BRACKET_LEFT, char, tokenStart));
        break;
      case ']':
        tokens.push(createToken(TokenType.BRACKET_RIGHT, char, tokenStart));
        break;
      case '(':
        tokens.push(createToken(TokenType.PAREN_LEFT, char, tokenStart));
        break;
      case ')':
        tokens.push(createToken(TokenType.PAREN_RIGHT, char, tokenStart));
        break;
      case '=':
        tokens.push(createToken(TokenType.EQUALS, char, tokenStart));
        break;
      case '.':
        tokens.push(createToken(TokenType.DOT, char, tokenStart));
        break;
      case ',':
        tokens.push(createToken(TokenType.COMMA, char, tokenStart));
        break;
      case ':':
        tokens.push(createToken(TokenType.COLON, char, tokenStart));
        break;
      case '?':
        tokens.push(createToken(TokenType.QUESTION, char, tokenStart));
        break;
      case '@':
        if (position.offset + 1 < inputLength && input[position.offset + 1] === '@') {
          updatePosition('@');
          updatePosition('@');
          tokens.push(createToken(TokenType.AT_AT, '@@', tokenStart));
          continue;
        } else {
          tokens.push(createToken(TokenType.AT, char, tokenStart));
        }
        break;
      default:
        tokens.push(createToken(TokenType.UNKNOWN, char, tokenStart));
    }
    
    updatePosition(char);
  }
  
  // Add EOF token
  tokens.push(createToken(TokenType.EOF, '', currentPosition()));
  
  return tokens;
} 