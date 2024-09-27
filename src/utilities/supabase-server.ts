import { API_DETAIL } from "@/configuration/api";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { notFoundResponse, unauthorizedResponse } from "./api";
import HTTPMethod from "http-method-enum";

/**
 * Panggil supabase client. Tempel di cookies ini nanti.
 * @param [elevatedAccess=false] PAKAI JIKA MEMANG PERLU BANGET
 * @returns Supabase client untuk server
 */
export function supabaseServer(elevatedAccess: boolean = false) {
  const cookie = cookies();

  if (elevatedAccess) return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      cookies: {
        
      }
    }
  );

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      cookies: {
        get(name: string) { return cookie.get(name)?.value; },
        set(name: string, value: string, option: CookieOptions) {
          try {
            cookie.set({ name, value, ...option });
          }
          catch(error) {

          }
        },
        remove(name: string, option: CookieOptions) {
          try {
            cookie.set({ name, value: '', ...option })
          }
          catch(error) {

          }
        }
      }
    }
  )
}

/**
 * Update session agar cek masih valid atau nga pas dia login
 * @param request Rekues dari Middleware
 * @returns Return responsenya. Udah dihandle di middleware untuk pelemparan ke controller dkknya
 */
export async function updateSession(request: NextRequest) {
  // Lanjut dulu itu rekuesnya
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      cookies: {
        get(name: string){
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options)
        {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        }
      }
    }
  )

  const { data: { user }} = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith('/api')) {
    const path = request.nextUrl.pathname;

    const apiDetail = Object.values(API_DETAIL).find(x => path.startsWith(x.route));
    if (!apiDetail) return notFoundResponse();
    else if (!(apiDetail.anonMethod ?? []).includes(request.method as HTTPMethod) && !user) return unauthorizedResponse();
  }

  return response;
}