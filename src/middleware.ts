import { updateSession } from "@/utilities/supabase-server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest){
  // const url = request.nextUrl.clone();
  // url.pathname = '/login'
  // if (!request.nextUrl.pathname.startsWith("/login")){
  //   const supabase = supabaseServer();
  //   const { data, error } = await supabase.auth.getUser();
  //   if (error || !data?.user) return NextResponse.rewrite(url);
  // }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}