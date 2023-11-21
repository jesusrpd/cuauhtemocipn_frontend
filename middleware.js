import { NextResponse } from 'next/server';

export function middleware(request){
    
    const user = request.cookies.get('user');
    const token = request.cookies.get('token');
    if(!user || !token){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL_FRONT}/login`);
    }else{
        if(request.nextUrl.pathname.startsWith('/login')){
            return NextResponse.redirect(`${URL_FRONT}/dashboard/inicio`);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/comprobante/:path*"]
}