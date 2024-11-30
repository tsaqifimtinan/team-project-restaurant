import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyToken } from './src/app/utils/jwt';

export function middleware(request: NextRequest) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
  }

  // Set CORS headers for all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Paths yang tidak perlu autentikasi
  const publicPaths = ['/api/auth/login', '/api/auth/register'];
  
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return response;
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { 
        status: 401,
        headers: response.headers // Tetap sertakan CORS headers
      }
    );
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { 
        status: 401,
        headers: response.headers // Tetap sertakan CORS headers
      }
    );
  }

  return response;
}

export const config = {
  matcher: '/api/:path*'
};