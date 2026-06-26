import { NextRequest, NextResponse } from 'next/server';

import {
    AUTH_ROUTES,
    JWT_TOKEN,
    PROTECTED_ROLE_SEGMENTS,
    ProtectedRoleSegment,
    USER_DETAIL,
} from '@/constants/authSession';

interface SessionUserDetail {
    roleName?: string;
    role?: {
        name?: string;
    };
}

const ROLE_HOME_ROUTES: Record<ProtectedRoleSegment, string> = {
    admin: AUTH_ROUTES.adminDashboard,
    teacher: AUTH_ROUTES.teacherDashboard,
    student: AUTH_ROUTES.studentDashboard,
};

const PUBLIC_API_ROUTES = [
    '/api/login',
    '/api/logout',
    '/api/store-auth-token',
    '/api/store-user-details',
    '/api/student/login',
    '/cookies/store-auth-token',
    '/cookies/store-user-details',
];

const isProtectedRoleSegment = (segment: string): segment is ProtectedRoleSegment =>
    PROTECTED_ROLE_SEGMENTS.includes(segment as ProtectedRoleSegment);

const normalizeRole = (roleName?: string): ProtectedRoleSegment | null => {
    const normalizedRole = roleName?.trim().toLowerCase();

    if (!normalizedRole) {
        return null;
    }

    if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
        return 'admin';
    }

    if (normalizedRole === 'teacher') {
        return 'teacher';
    }

    if (normalizedRole === 'student') {
        return 'student';
    }

    return null;
};

const getUserRole = (request: NextRequest) => {
    const userDetailCookie = request.cookies.get(USER_DETAIL)?.value;

    if (!userDetailCookie) {
        return null;
    }

    try {
        const userDetail = JSON.parse(decodeURIComponent(userDetailCookie)) as SessionUserDetail;

        return normalizeRole(userDetail.role?.name || userDetail.roleName);
    } catch {
        return null;
    }
};

const getRequestedRoleSegment = (pathname: string) => {
    const [, firstSegment, secondSegment] = pathname.split('/');
    const routeSegment = firstSegment === 'api' ? secondSegment : firstSegment;

    return routeSegment && isProtectedRoleSegment(routeSegment) ? routeSegment : null;
};

const isPublicApiRoute = (pathname: string) =>
    PUBLIC_API_ROUTES.some((publicRoute) => pathname === publicRoute);

const isApiRoute = (pathname: string) => pathname.startsWith('/api/');

const redirectTo = (request: NextRequest, pathname: string) =>
    NextResponse.redirect(new URL(pathname, request.url));

const unauthorizedApiResponse = () =>
    NextResponse.json({ message: 'Authentication required' }, { status: 401 });

const forbiddenApiResponse = () =>
    NextResponse.json(
        { message: 'You do not have permission to access this resource' },
        { status: 403 },
    );

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isLoginPage = pathname === AUTH_ROUTES.login;
    const authToken = request.cookies.get(JWT_TOKEN)?.value;
    const userRole = getUserRole(request);
    const requestedRoleSegment = getRequestedRoleSegment(pathname);
    const hasValidSession = Boolean(authToken && userRole);

    if (isPublicApiRoute(pathname)) {
        return NextResponse.next();
    }

    if (isLoginPage) {
        if (authToken && userRole) {
            return redirectTo(request, ROLE_HOME_ROUTES[userRole]);
        }

        return NextResponse.next();
    }

    if (!hasValidSession || !userRole) {
        if (isApiRoute(pathname)) {
            return unauthorizedApiResponse();
        }

        return redirectTo(request, AUTH_ROUTES.login);
    }

    if (requestedRoleSegment && requestedRoleSegment !== userRole) {
        if (isApiRoute(pathname)) {
            return forbiddenApiResponse();
        }

        return redirectTo(request, ROLE_HOME_ROUTES[userRole]);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)',
    ],
};
