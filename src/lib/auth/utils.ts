import { NextRequest, NextResponse } from "next/server";

export function getSearchParam(
  request: NextRequest,
  key: string,
  defaultValue: string = "/"
): string {
  const requestUrl = new URL(request.url);
  return requestUrl.searchParams.get(key) || defaultValue;
}

export function redirectWithError(
  request: NextRequest,
  error: string
): NextResponse {
  return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
}

export function redirectTo(
  request: NextRequest,
  path: string
): NextResponse {
  return NextResponse.redirect(new URL(path, request.url));
}

