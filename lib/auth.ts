import crypto from 'crypto';

// Password hashing
export function hashPassword(password: string, salt: string): string {
  const hmac = crypto.createHmac('sha256', salt);
  hmac.update(password);
  return hmac.digest('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Simple signed session tokens (alternative to JWT libraries)
export function signSession(userId: string): string {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const data = `${userId}.${exp}`;
  const secret = process.env.JWT_SECRET || 'actionpath_secret_fallback_2026';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${data}.${signature}`;
}

export function verifySession(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [userId, expStr, signature] = parts;
    const exp = parseInt(expStr, 10);
    if (Date.now() > exp) return null; // Token expired
    
    const data = `${userId}.${expStr}`;
    const secret = process.env.JWT_SECRET || 'actionpath_secret_fallback_2026';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    const expectedSignature = hmac.digest('hex');
    
    if (signature === expectedSignature) {
      return userId;
    }
    return null;
  } catch {
    return null;
  }
}
