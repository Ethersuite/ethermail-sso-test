import jwt from 'jsonwebtoken';

export class JwtUtils {
  public verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/jwk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch JWKS');
      }
      return response.json();
    } catch (error) {
      console.error('JWT verification failed:');
      console.log(error);
      throw error;
    }
  };

  public decodeToken = (token: string) => {
    return jwt.decode(token)
  }
}