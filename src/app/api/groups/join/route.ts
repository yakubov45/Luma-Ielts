import { NextRequest, NextResponse } from "next/server";
import { joinGroupByCode } from "@/lib/services/groups-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, displayName, inviteCode } = body;

    if (!uid || !inviteCode) {
      return NextResponse.json(
        { error: "Foydalanuvchi identifikatori va taklif kodi talab qilinadi." },
        { status: 400 }
      );
    }

    const result = await joinGroupByCode(uid, displayName || "Learner", inviteCode);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, group: result.group });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Guruhga qo‘shilishda server xatosi yuz berdi." },
      { status: 500 }
    );
  }
}
