import { NextRequest, NextResponse } from "next/server";
import { requireUser, handleAuthError, AuthError } from "@/lib/auth/server";
import { joinGroupByCodeServer } from "@/lib/services/server/groups-server-service";
import { z } from "zod";

const joinSchema = z.object({
  inviteCode: z.string().min(3).max(30),
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const body = await req.json();
    const parsed = joinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Yaroqli taklif kodi talab qilinadi." },
        { status: 400 }
      );
    }

    const { inviteCode } = parsed.data;
    const displayName = (user.name as string) || user.email || "Learner";

    const result = await joinGroupByCodeServer(user.uid, displayName, inviteCode);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      alreadyMember: result.alreadyMember ?? false,
      group: result.group,
    });
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      return handleAuthError(err);
    }
    const message = err instanceof Error ? err.message : "Guruhga qo‘shilishda server xatosi yuz berdi.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
