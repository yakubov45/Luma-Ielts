"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  X,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Group,
  GroupLifecycleState,
} from "@/lib/types/groups";
import {
  fetchGroupsForUser,
  createGroup,
  joinGroupByCode,
} from "@/lib/services/groups-service";

export default function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // New Group Form
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupTrack, setNewGroupTrack] = useState<"academic" | "general">("academic");
  const [newGroupBand, setNewGroupBand] = useState("7.5");
  const [newGroupTimezone, setNewGroupTimezone] = useState("Asia/Tashkent (UTC+5)");
  const [newGroupSchedule, setNewGroupSchedule] = useState("Dushanba, Chorshanba, Juma — 19:00");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    const list = await fetchGroupsForUser(user?.uid);
    setGroups(list);
    setLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, [user?.uid]);

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    if (!inviteCodeInput.trim()) return;

    const res = await joinGroupByCode(
      user?.uid || "guest_learner",
      user?.displayName || "Talaba",
      inviteCodeInput.trim()
    );

    if (res.success && res.group) {
      setJoinSuccess(true);
      setTimeout(() => {
        setJoinSuccess(false);
        setJoinModalOpen(false);
        setInviteCodeInput("");
        loadGroups();
      }, 1200);
    } else {
      setJoinError(res.error || "Guruhga qo‘shilishda xatolik.");
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;

    await createGroup(user?.uid || "teacher_1", user?.displayName || "Ustoz", {
      name: newGroupName,
      description: newGroupDesc,
      examTrack: newGroupTrack,
      targetBand: parseFloat(newGroupBand) || 7.0,
      timezone: newGroupTimezone,
      schedule: newGroupSchedule,
    });

    setCreateModalOpen(false);
    setNewGroupName("");
    setNewGroupDesc("");
    loadGroups();
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getLifecycleBadge = (state: GroupLifecycleState, count: number) => {
    switch (state) {
      case "ACTIVE":
        return {
          label: "FAOL GURUH",
          style: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/50",
          desc: "5–15 faol talaba mavjud. Topshiriqlar va darslar faol.",
        };
      case "FORMING":
        return {
          label: "SHAKLLANMOQDA",
          style: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/50",
          desc: `Faollashish uchun yana ${Math.max(0, 5 - count)} ta talaba kerak (min. 5 ta).`,
        };
      case "UNDER_MINIMUM":
        return {
          label: "MINIMUMDAN KAM",
          style: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300/50",
          desc: `Talabalar soni 5 tadan kamaydi (${count}/15). Qayta faollashish uchun talaba qo‘shing.`,
        };
      default:
        return {
          label: "ARXIVLANGAN",
          style: "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300",
          desc: "Guruh o‘qishi yakunlangan.",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="eyebrow">USTOZ-BOSHQARUVDAGI GURUHLAR</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">
            IELTS Study Groups
          </h1>
          <p className="text-xs md:text-sm text-[var(--secondary)] max-w-2xl leading-relaxed">
            5–15 nafar faol talabadan iborat o‘quv guruhlari, ustoz topshiriqlari va birgalikdagi amaliyot.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setJoinModalOpen(true)}
            className="btn-secondary !py-2.5 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kodni kiritib qo‘shilish</span>
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn-primary !py-2.5 !px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi guruh ochish</span>
          </button>
        </div>
      </div>

      {/* Mandatory Group Size Rule Banner (Section 2) */}
      <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-[var(--primary)]/30 text-xs text-[var(--foreground)] flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[var(--primary)] block">
            IELTS Focus Guruh Qoidasi (5–15 nafar talaba):
          </span>
          <p className="text-[11px] text-[var(--secondary)] leading-relaxed">
            Har bir guruh kamida <strong>5 ta</strong> va ko‘pi bilan <strong>15 ta</strong> faol talabadan iborat bo‘ladi. Guruh 5 kishiga yetguncha <em>SHAKLLANISH (FORMING)</em> rejimida bo‘ladi va 5-talaba qo‘shilishi bilan avtomatik <em>FAOL (ACTIVE)</em> holatga o‘tadi.
          </p>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[var(--foreground)]">
          Mavjud Guruhlaringiz ({groups.length})
        </h2>

        {groups.length === 0 ? (
          <div className="card p-12 text-center space-y-3 rounded-2xl border-dashed">
            <Users className="w-8 h-8 text-[var(--muted)] mx-auto" />
            <h3 className="font-bold text-sm text-[var(--foreground)]">Siz hali hech qanday guruhga a’zo emassiz</h3>
            <p className="text-xs text-[var(--secondary)] max-w-sm mx-auto">
              Ustozingiz bergan taklif kodini kiriting yoki o‘zingiz yangi guruh yarating.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => {
              const badge = getLifecycleBadge(group.state, group.learnerCount);
              const capacityPercent = Math.min(100, Math.round((group.learnerCount / 15) * 100));

              return (
                <div
                  key={group.id}
                  className="card p-5 sm:p-6 flex flex-col justify-between gap-5 border border-[var(--border)] hover:border-[var(--primary)]/60 transition-all rounded-2xl bg-[var(--surface)] shadow-xs group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Track Badge, Lifecycle State & Target Band */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase border ${badge.style}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-[var(--muted)] border border-[var(--border)] uppercase">
                          {group.examTrack}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[var(--muted)] uppercase block leading-tight">
                          Maqsad
                        </span>
                        <span className="text-sm font-black text-[var(--primary)] tabular">
                          Band {group.targetBand.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Group Name & Description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">
                        {group.name}
                      </h3>
                      <p className="text-xs text-[var(--secondary)] mt-1 line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    </div>

                    {/* Schedule & Ustoz */}
                    <div className="pt-2 border-t border-[var(--border)]/70 space-y-1.5 text-xs text-[var(--muted)]">
                      <div className="flex items-center justify-between">
                        <span>Ustoz: <strong className="text-[var(--foreground)]">{group.ownerName}</strong></span>
                        <span>{group.timezone}</span>
                      </div>
                      {group.schedule && (
                        <div className="flex items-center gap-1 text-[var(--secondary)]">
                          <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                          <span>{group.schedule}</span>
                        </div>
                      )}
                    </div>

                    {/* Capacity Indicator (Section 2) */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--foreground)]">
                          Guruh sig‘imi:
                        </span>
                        <span className="font-mono font-bold text-[var(--foreground)] tabular">
                          {group.learnerCount} / 15 talaba
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[var(--surface-subtle)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className={`h-full transition-all ${
                            group.state === "ACTIVE"
                              ? "bg-emerald-500"
                              : group.state === "UNDER_MINIMUM"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${capacityPercent}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-[var(--muted)]">{badge.desc}</p>
                    </div>
                  </div>

                  {/* Bottom Action & Invite Code */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
                    <button
                      onClick={() => copyInviteCode(group.inviteCode)}
                      title="Taklif kodini nusxalash"
                      className="px-2.5 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === group.inviteCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-bold text-emerald-600">Nusxalandi!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="font-mono font-bold text-[var(--foreground)]">{group.inviteCode}</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/groups/${group.id}`}
                      className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Guruh kabinetiga kirish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JOIN GROUP MODAL */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card max-w-md w-full p-6 space-y-4 shadow-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Guruhga qo‘shilish</h3>
                <p className="text-xs text-[var(--secondary)] mt-0.5">Ustozingiz bergan maxsus taklif kodini kiriting.</p>
              </div>
              <button
                onClick={() => setJoinModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinGroup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--foreground)]">Taklif kodi:</label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  placeholder="Masalan: IELTS75-SQUAD"
                  className="w-full p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-sm font-mono font-bold text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
                  required
                />
              </div>

              {joinError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              {joinSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Guruhga muvaffaqiyatli qo‘shildingiz!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setJoinModalOpen(false)}
                  className="btn-secondary !py-2 !px-4 text-xs font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer shadow-xs"
                >
                  Qo‘shilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GROUP MODAL (For Teachers) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card max-w-lg w-full p-6 space-y-4 shadow-xl border border-[var(--border)] bg-[var(--surface)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Yangi o‘quv guruhi yaratish</h3>
                <p className="text-xs text-[var(--secondary)] mt-0.5">Ustoz sifatida 5–15 nafarli o‘quv guruhi oching.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Guruh nomi:</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Masalan: IELTS Academic Masterclass (Evening)"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Tavsif va maqsadlar:</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Guruh nimalarni o‘rganishi va o‘quv rejasi haqida qisqacha ma‘lumot..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[var(--foreground)]">IELTS Yo‘nalishi:</label>
                  <select
                    value={newGroupTrack}
                    onChange={(e) => setNewGroupTrack(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  >
                    <option value="academic">IELTS Academic</option>
                    <option value="general">IELTS General Training</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[var(--foreground)]">Maqsad qilingan Band:</label>
                  <select
                    value={newGroupBand}
                    onChange={(e) => setNewGroupBand(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  >
                    <option value="6.5">Band 6.5</option>
                    <option value="7.0">Band 7.0</option>
                    <option value="7.5">Band 7.5</option>
                    <option value="8.0">Band 8.0</option>
                    <option value="8.5">Band 8.5</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Dars jadvali (ixtiyoriy):</label>
                <input
                  type="text"
                  value={newGroupSchedule}
                  onChange={(e) => setNewGroupSchedule(e.target.value)}
                  placeholder="Masalan: Dushanba, Chorshanba — 19:00"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[11px] text-[var(--muted)] space-y-1">
                <strong>Eslatma:</strong> Guruh boshida <em>FORMING</em> holatida ochiladi. 5-talaba qo‘shilgach, guruh <em>ACTIVE</em> bo‘ladi va topshiriqlarni e’lon qilish mumkin bo‘ladi.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn-secondary !py-2 !px-4 text-xs font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer shadow-xs"
                >
                  Guruhni yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
