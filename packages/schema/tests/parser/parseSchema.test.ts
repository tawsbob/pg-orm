import { parseSchema } from '../../src/parser';

describe('parseSchema function', () => {
  it('should parse a simple model definition', () => {
    const schemaString = `
      model User {
        id Int @id
        name String
        posts Post[]
      }
    `;

    const schema = parseSchema(schemaString);
    
    expect(schema.models.length).toBe(1);
    
    const model = schema.models[0];
    expect(model.name).toBe('User');
    expect(model.fields.length).toBe(3);
    
    // Check the id field
    const idField = model.fields[0];
    expect(idField.name).toBe('id');
    expect(idField.type).toBe('Int');
    expect(idField.isRequired).toBe(true);
    expect(idField.isArray).toBe(false);
    expect(idField.isPrimary).toBe(true);
    
    // Check the name field
    const nameField = model.fields[1];
    expect(nameField.name).toBe('name');
    expect(nameField.type).toBe('String');
    expect(nameField.isRequired).toBe(true);
    expect(nameField.isArray).toBe(false);
    
    // Check the posts field
    const postsField = model.fields[2];
    expect(postsField.name).toBe('posts');
    expect(postsField.type).toBe('Post');
    expect(postsField.isRequired).toBe(true);
    expect(postsField.isArray).toBe(true);
  });

  it('should parse model with attributes', () => {
    const schemaString = `
      model User {
        id Int @id
        email String @unique
        @@id([id, email])
      }
    `;

    const schema = parseSchema(schemaString);
    
    expect(schema.models.length).toBe(1);
    
    const model = schema.models[0];
    expect(model.name).toBe('User');
    expect(model.fields.length).toBe(2);
    
    // Check the email field
    const emailField = model.fields[1];
    expect(emailField.name).toBe('email');
    expect(emailField.isUnique).toBe(true);
    
    // Check model attributes
    expect(model.attributes).toBeDefined();
    expect(model.attributes!.id).toBeDefined();
  });

  it('should handle optional fields', () => {
    const schemaString = `
      model User {
        id Int @id
        name String?
      }
    `;

    const schema = parseSchema(schemaString);
    
    const model = schema.models[0];
    const nameField = model.fields[1];
    
    expect(nameField.name).toBe('name');
    expect(nameField.isRequired).toBe(false);
  });
}); 