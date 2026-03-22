import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Exclude static files, Next internals, api paths, and the public login route
    if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Require token for any other routes (Admin, CISO, Manager, etc.)
    const token = request.cookies.get('token')?.value;

    if (!token && request.nextUrl.pathname !== '/') {
        // Redirect strictly to /login if no token is found and they are trying to access a dashboard
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If at root and not logged in, force login. If logged in, let them proceed (or redirect based on role if desired, but default Next.js root handles it)
    if (!token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
