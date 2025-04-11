import { tokenize } from '../../src/parser/tokenizer';
import { TokenType } from '../../src/parser/tokens';

describe('Tokenizer', () => {
  it('should tokenize an empty string', () => {
    const tokens = tokenize('');
    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize whitespace', () => {
    const tokens = tokenize('  \t\n  ');
    expect(tokens.length).toBe(1);
    expect(tokens[0].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize identifiers', () => {
    const tokens = tokenize('User Post');
    expect(tokens.length).toBe(3);
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].value).toBe('User');
    expect(tokens[1].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[1].value).toBe('Post');
    expect(tokens[2].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize keywords', () => {
    const tokens = tokenize('model enum type');
    expect(tokens.length).toBe(4);
    expect(tokens[0].type).toBe(TokenType.KEYWORD);
    expect(tokens[0].value).toBe('model');
    expect(tokens[1].type).toBe(TokenType.KEYWORD);
    expect(tokens[1].value).toBe('enum');
    expect(tokens[2].type).toBe(TokenType.KEYWORD);
    expect(tokens[2].value).toBe('type');
    expect(tokens[3].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize strings', () => {
    const tokens = tokenize('"hello" \'world\'');
    expect(tokens.length).toBe(3);
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('"hello"');
    expect(tokens[1].type).toBe(TokenType.STRING);
    expect(tokens[1].value).toBe("'world'");
    expect(tokens[2].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize numbers', () => {
    const tokens = tokenize('123 45.67');
    expect(tokens.length).toBe(3);
    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].value).toBe('123');
    expect(tokens[1].type).toBe(TokenType.NUMBER);
    expect(tokens[1].value).toBe('45.67');
    expect(tokens[2].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize comments', () => {
    const tokens = tokenize('// Line comment\n/* Block comment */');
    expect(tokens.length).toBe(3);
    expect(tokens[0].type).toBe(TokenType.COMMENT);
    expect(tokens[0].value).toBe('// Line comment');
    expect(tokens[1].type).toBe(TokenType.COMMENT);
    expect(tokens[1].value).toBe('/* Block comment */');
    expect(tokens[2].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize operators and punctuation', () => {
    const tokens = tokenize('{}[]()=.,?@@@');
    expect(tokens.length).toBe(13);
    expect(tokens[0].type).toBe(TokenType.BRACE_LEFT);
    expect(tokens[1].type).toBe(TokenType.BRACE_RIGHT);
    expect(tokens[2].type).toBe(TokenType.BRACKET_LEFT);
    expect(tokens[3].type).toBe(TokenType.BRACKET_RIGHT);
    expect(tokens[4].type).toBe(TokenType.PAREN_LEFT);
    expect(tokens[5].type).toBe(TokenType.PAREN_RIGHT);
    expect(tokens[6].type).toBe(TokenType.EQUALS);
    expect(tokens[7].type).toBe(TokenType.DOT);
    expect(tokens[8].type).toBe(TokenType.COMMA);
    expect(tokens[9].type).toBe(TokenType.QUESTION);
    expect(tokens[10].type).toBe(TokenType.AT_AT);
    expect(tokens[11].type).toBe(TokenType.AT);
    expect(tokens[12].type).toBe(TokenType.EOF);
  });
  
  it('should tokenize a simple model definition', () => {
    const schemaString = `
    model User {
      id Int @id
      name String
      posts Post[]
    }
    `;
    
    const tokens = tokenize(schemaString);
    const tokenTypes = tokens.map(t => t.type);
    
    expect(tokenTypes).toEqual([
      TokenType.KEYWORD,       // model
      TokenType.IDENTIFIER,    // User
      TokenType.BRACE_LEFT,    // {
      TokenType.IDENTIFIER,    // id
      TokenType.IDENTIFIER,    // Int
      TokenType.AT,            // @
      TokenType.IDENTIFIER,    // id
      TokenType.IDENTIFIER,    // name
      TokenType.IDENTIFIER,    // String
      TokenType.IDENTIFIER,    // posts
      TokenType.IDENTIFIER,    // Post
      TokenType.BRACKET_LEFT,  // [
      TokenType.BRACKET_RIGHT, // ]
      TokenType.BRACE_RIGHT,   // }
      TokenType.EOF           // EOF
    ]);
  });
  
  it('should track source positions correctly', () => {
    const tokens = tokenize('model User {\n  id Int\n}');
    
    expect(tokens[0].position).toEqual({ line: 1, column: 1, offset: 0 });
    expect(tokens[1].position).toEqual({ line: 1, column: 7, offset: 6 });
    expect(tokens[2].position).toEqual({ line: 1, column: 12, offset: 11 });
    expect(tokens[3].position).toEqual({ line: 2, column: 3, offset: 15 });
    expect(tokens[4].position).toEqual({ line: 2, column: 6, offset: 18 });
    expect(tokens[5].position).toEqual({ line: 3, column: 1, offset: 22 });
  });
  
  it('should handle escaped characters in strings', () => {
    const tokens = tokenize('"escaped \\"quote\\""');
    
    expect(tokens.length).toBe(2);
    expect(tokens[0].type).toBe(TokenType.STRING);
    expect(tokens[0].value).toBe('"escaped \\"quote\\""');
  });
}); 