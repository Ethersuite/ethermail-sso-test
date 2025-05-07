import jwt from 'jsonwebtoken';
import { jwtVerify, createRemoteJWKSet } from 'jose';

export class JwtUtils {
  private readonly ETHERMAIL_API_DOMAIN: string;

  constructor() {
    this.ETHERMAIL_API_DOMAIN = process.env.NEXT_PUBLIC_ETHERMAIL_API_DOMAIN;
  }

  public verifyToken = async (token: string) => {
    try {
      const openIDConfigUrl = `https://${this.ETHERMAIL_API_DOMAIN}/.well-known/openid-configuration`;
      const openIDConfigResponse = await fetch(openIDConfigUrl);
      const { jwks_uri } = await openIDConfigResponse.json();

      if (!jwks_uri) {
        throw new Error('JWKS URI not found in OpenID configuration');
      }

      const jwks = createRemoteJWKSet(new URL(jwks_uri));

      const { payload } = await jwtVerify(token, jwks, {
        algorithms: ['RS256'],
      });

      console.log('Verified payload:', payload);
      return payload;
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