import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit, ipFromRequest } from '@/lib/ratelimit';

describe('ratelimit unit tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should allow requests under the limit and track remaining count', () => {
    const key = 'test-ip-1';
    
    // First request
    const res1 = rateLimit(key, 3, 60000);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    // Second request
    const res2 = rateLimit(key, 3, 60000);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    // Third request
    const res3 = rateLimit(key, 3, 60000);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);

    // Fourth request (exceeding limit)
    const res4 = rateLimit(key, 3, 60000);
    expect(res4.allowed).toBe(false);
    expect(res4.remaining).toBe(0);
  });

  it('should reset limits after the window expires', () => {
    const key = 'test-ip-2';
    
    rateLimit(key, 2, 60000);
    rateLimit(key, 2, 60000);
    
    // Blocked now
    const blockedRes = rateLimit(key, 2, 60000);
    expect(blockedRes.allowed).toBe(false);

    // Fast-forward time by 61 seconds
    vi.advanceTimersByTime(61000);

    // Should be allowed again
    const allowedRes = rateLimit(key, 2, 60000);
    expect(allowedRes.allowed).toBe(true);
    expect(allowedRes.remaining).toBe(1);
  });

  describe('ipFromRequest helper', () => {
    it('should return unknown for empty or null requests', () => {
      expect(ipFromRequest(null)).toBe('unknown');
      expect(ipFromRequest(undefined)).toBe('unknown');
      expect(ipFromRequest({})).toBe('unknown');
    });

    it('should parse Fetch-like Request headers object with get function', () => {
      const mockReq = {
        headers: {
          get: (name: string) => {
            if (name === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1';
            return null;
          }
        }
      };

      expect(ipFromRequest(mockReq)).toBe('192.168.1.1');
    });

    it('should parse plain JS object headers dictionary', () => {
      const mockReq = {
        headers: {
          'x-forwarded-for': '1.2.3.4, 5.6.7.8'
        }
      };

      expect(ipFromRequest(mockReq)).toBe('1.2.3.4');
    });

    it('should fall back to x-real-ip if x-forwarded-for is missing', () => {
      const mockReqFetch = {
        headers: {
          get: (name: string) => {
            if (name === 'x-real-ip') return '9.9.9.9';
            return null;
          }
        }
      };

      const mockReqObject = {
        headers: {
          'x-real-ip': '8.8.8.8'
        }
      };

      expect(ipFromRequest(mockReqFetch)).toBe('9.9.9.9');
      expect(ipFromRequest(mockReqObject)).toBe('8.8.8.8');
    });
  });
});
