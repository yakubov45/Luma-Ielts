import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebase/admin";

export class AuthError extends Error {
  constructor(message: string, public status: number = 401) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireUser(request: NextRequest): Promise<DecodedIdToken> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    throw new AuthError("Tizimga kirish talab etiladi (Unauthenticated)", 401);
  }
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    throw new AuthError("Foydalanuvchi seans tokeni yaroqsiz yoki muddati o‘tgan", 401);
  }
}

export async function requireAdmin(request: NextRequest): Promise<DecodedIdToken> {
  const decoded = await requireUser(request);
  if (decoded.admin !== true) {
    throw new AuthError("Ushbu amalni bajarish uchun administrator huquqi talab etiladi (Forbidden)", 403);
  }
  return decoded;
}

export function handleAuthError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Avtorizatsiya xatosi";
  return NextResponse.json({ error: message }, { status: 401 });
}
