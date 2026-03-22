const BASE_URL = 'http://localhost:5000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    let token = '';

    // If running in browser, extract token from cookie
    if (typeof window !== 'undefined') {
        const match = document.cookie.match(/(^| )token=([^;]+)/);
        if (match) token = match[2];
    } else {
        // SSR Development fallback (Super Admin mock token)
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyLWFkbWluLWlkIiwicm9sZSI6InN1cGVyX2FkbWluIiwiZW1haWwiOiJhZG1pbkBjeWJlcnNoaWVsZC5pbyIsImlhdCI6MTc3MzY4NzgzMSwiZXhwIjoxODA1MjIzODMxfQ.FmeH5iO_nDuBJwkJ3whTC5HQ0j4vt24LU95Inw6Ni54';
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    return res;
}
