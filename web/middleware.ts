import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('weddingos_token')?.value;
    const { pathname } = request.nextUrl;

    // Telas de autenticação (públicas)
    const isPublicRoute =
        pathname.startsWith('/login') ||
        pathname.startsWith('/cadastro');

    if (isPublicRoute) {
        if (token) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Validar ativamente se o payload do JWT é seguro e se não expirou
    // Isso mitiga travamentos na UI caso o token expire.
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) throw new Error('Invalid JWT format');

        // Padronização Base64 compatível com o navegador/Edge
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');

        const payloadString = atob(paddedBase64);
        const decodedPayload = JSON.parse(payloadString);

        if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
            // Token expirado: limpar cookie e redirecionar
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('weddingos_token');
            return response;
        }
    } catch (e) {
        // Formato malicioso/quebrado: invalidar e redirecionar
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('weddingos_token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Corrigida Brecha de Segurança: Exclusão via regex rígida ao invés de `.includes('.')`
         * - Exclui `/api/` (que é protegido direto pelo Backend NestJS)
         * - Impede que falsas URLs (`/fornecedores/empresa.ltda`) sejam lidas como arquivos estáticos!
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)',
    ],
};
