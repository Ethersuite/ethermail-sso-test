import { NextResponse } from 'next/server';
import axios from 'axios';
import { createPublicKey } from 'crypto';
import jwt from 'jsonwebtoken';

function jwkToPem(jwk: any): string {
  const keyObject = createPublicKey({
    key: jwk,
    format: 'jwk',
  });

  return keyObject.export({ type: 'spki', format: 'pem' }).toString();
}

export async function POST(request: Request) {
  try {
    // 🔹 Extract token from the request body
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token not provided' }, { status: 400 });
    }

    // 🔹 Fetch OpenID Configuration
    const openIDConfigUrl = `https://${process.env.NEXT_PUBLIC_ETHERMAIL_API_DOMAIN}/.well-known/openid-configuration`;
    const { data: { jwks_uri } } = await axios.get(openIDConfigUrl);

    if (!jwks_uri) {
      return NextResponse.json({ error: 'JWKS URI not found' }, { status: 500 });
    }

    // 🔹 Fetch JWKS
    const { data: jwkKeys } = await axios.get(jwks_uri);

    // 🔹 Extract key from the JWKS
    const jwk = jwkKeys.keys[0];

    // 🔹 Convert JWK to PEM format
    const publicKeyPem = jwkToPem(jwk);

    // 🔹 Verify the Token
    const decodedToken = jwt.verify(token, publicKeyPem, {
      algorithms: ['RS256'],
    });

    return NextResponse.json({ message: 'Token is valid', decodedToken });

  } catch (error: any) {
    console.error('Error processing request:', error.message);
    return NextResponse.json(
      { error: error.message.includes('jwt') ? 'Token verification failed' : 'Internal Server Error', details: error.message },
      { status: error.message.includes('jwt') ? 401 : 500 }
    );
  }
}