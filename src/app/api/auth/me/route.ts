import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
export async function GET(request: NextRequest) { const header = request.headers.get("authorization"); if (!header?.startsWith("Bearer ")) return NextResponse.json({ error:"Unauthorized" }, { status:401 }); try { const token = await adminAuth.verifyIdToken(header.slice(7)); return NextResponse.json({ uid:token.uid, email:token.email, admin:token.admin === true }); } catch { return NextResponse.json({ error:"Unauthorized" }, { status:401 }); } }
