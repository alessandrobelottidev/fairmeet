import { logout } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await logout();
  return NextResponse.next();
}
