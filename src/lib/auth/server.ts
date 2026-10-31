import "server-only";
import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export async function requireUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("UNAUTHENTICATED");
  return adminAuth.verifyIdToken(token);
}
