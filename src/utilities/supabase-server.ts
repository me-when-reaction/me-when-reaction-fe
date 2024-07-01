import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Panggil supabase client. Tempel di cookies ini nanti.
 * @returns Supabase client untuk server
 */
export function supabaseServer() {
  const cookie = cookies();

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

  await supabase.auth.getUser();
  return response;
}