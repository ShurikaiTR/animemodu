import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseClient,updateSession } from "@/shared/lib/supabase/middleware";

export default async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Bakım sayfası ve statik dosyalar için kontrol yapma
  const isMaintenancePath = pathname === "/maintenance";
  const isPanelPath = pathname.startsWith("/panel");
  const isApiPath = pathname.startsWith("/api");
  const isAuthPath = pathname.startsWith("/auth");

  // Bakım modu kontrolü (panel, api, auth ve maintenance sayfası hariç)
  if (!isMaintenancePath && !isPanelPath && !isApiPath && !isAuthPath) {
    const supabase = createSupabaseClient(request, response);

    // Bakım modu ayarını kontrol et
    const { data: maintenanceSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single();

    if (maintenanceSetting?.value === "true") {
      // Admin kullanıcı mı kontrol et
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        // Admin değilse bakım sayfasına yönlendir
        if (!profile || (profile as { role: string }).role !== "admin") {
          const url = request.nextUrl.clone();
          url.pathname = "/maintenance";
          return NextResponse.redirect(url);
        }
      } else {
        // Giriş yapmamış kullanıcıları bakım sayfasına yönlendir
        const url = request.nextUrl.clone();
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
      }
    }
  }

  // Panel erişim kontrolü
  if (isPanelPath) {
    const supabase = createSupabaseClient(request, response);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile as { role: string }).role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};




