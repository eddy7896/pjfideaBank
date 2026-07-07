import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

describe('auth-utils unit tests', () => {
  it('should generate a valid hash', async () => {
    const password = 'mySuperSecurePassword123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash).toContain(':');
    
    const [salt, key] = hash.split(':');
    expect(salt).toHaveLength(32); // hex of 16 bytes is 32 chars
    expect(key).toBeDefined();
    expect(key.length).toBeGreaterThan(0);
  });

  it('should verify correct password', async () => {
    const password = 'mySuperSecurePassword123';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const password = 'mySuperSecurePassword123';
    const wrongPassword = 'mySuperSecurePassword124';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it('should return false for malformed hash', async () => {
    const password = 'mySuperSecurePassword123';
    const isValid1 = await verifyPassword(password, 'malformedhash');
    const isValid2 = await verifyPassword(password, 'salt:');
    const isValid3 = await verifyPassword(password, ':key');
    const isValid4 = await verifyPassword(password, '');

    expect(isValid1).toBe(false);
    expect(isValid2).toBe(false);
    expect(isValid3).toBe(false);
    expect(isValid4).toBe(false);
  });
});
