"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  BookOpen,
  PenTool,
  Headphones,
  Mic,
  Award,
  Copy,
  Check,
  Megaphone,
  UserCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Group,
  GroupAssignment,
  GroupSubmission,
  GroupAnnouncement,
  TeacherReview,
} from "@/lib/types/groups";
import {
  fetchGroupById,
  fetchAssignmentsForGroup,
  createAssignment,
  fetchSubmissionsForAssignment,
  submitTeacherReview,
  fetchAnnouncementsForGroup,
  postAnnouncement,
  leaveGroup,
} from "@/lib/services/groups-service";

function GroupDetailPageContent() {
  const params = useParams();
  const groupId = params.groupId as string;
  const router = useRouter();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [assignments, setAssignments] = useState<GroupAssignment[]>([]);
  const [announcements, setAnnouncements] = useState<GroupAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  // Role view toggle (Teacher vs Learner)
  const [viewRole, setViewRole] = useState<"teacher" | "learner">("teacher");
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Create Assignment Modal
  const [createAsgnModal, setCreateAsgnModal] = useState(false);
  const [asgnTitle, setAsgnTitle] = useState("");
  const [asgnInstructions, setAsgnInstructions] = useState("");
  const [asgnSkill, setAsgnSkill] = useState<"reading" | "listening" | "writing" | "speaking">("writing");
  const [asgnContentTitle, setAsgnContentTitle] = useState("University Education: Career Skills vs Broader Knowledge");
  const [asgnDays, setAsgnDays] = useState("3");
  const [asgnAllowLate, setAsgnAllowLate] = useState(true);
  const [asgnError, setAsgnError] = useState<string | null>(null);

  // Announcement Form
  const [ancTitle, setAncTitle] = useState("");
  const [ancMsg, setAncMsg] = useState("");

  // Teacher Review Modal
  const [selectedSubForReview, setSelectedSubForReview] = useState<any | null>(null);
  const [reviewBand, setReviewBand] = useState("7.0");
  const [reviewComment, setReviewComment] = useState("");

  const [copiedCode, setCopiedCode] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const g = await fetchGroupById(groupId);
    if (g) {
      setGroup(g);
      const [asgns, ancs] = await Promise.all([
        fetchAssignmentsForGroup(groupId),
        fetchAnnouncementsForGroup(groupId),
      ]);
      setAssignments(asgns);
      setAnnouncements(ancs);

      // Default role view
      if (g.ownerId === user?.uid || g.teacherIds.includes(user?.uid || "")) {
        setViewRole("teacher");
      } else {
        setViewRole("learner");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [groupId, user?.uid]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAsgnError(null);
    if (!asgnTitle.trim() || !asgnInstructions.trim()) return;

    const res = await createAssignment(groupId, {
      title: asgnTitle.trim(),
      instructions: asgnInstructions.trim(),
      skill: asgnSkill,
      contentRef: asgnSkill === "writing" ? "task2-university-purpose" : "urban-gardens-drill",
      contentTitle: asgnContentTitle,
      version: "v1.0",
      assignedLearnerUids: ["all"],
      startAt: Date.now(),
      deadlineAt: Date.now() + parseInt(asgnDays, 10) * 86400000,
      allowLateSubmissions: asgnAllowLate,
      attemptLimit: 1,
      feedbackRelease: "immediate",
      status: "published",
    });

    if (res.success && res.assignment) {
      setAssignments((prev) => [res.assignment!, ...prev]);
      setCreateAsgnModal(false);
      setAsgnTitle("");
      setAsgnInstructions("");
    } else {
      setAsgnError(res.error || "Topshiriq yaratishda xatolik.");
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle.trim() || !ancMsg.trim()) return;

    const created = await postAnnouncement(
      groupId,
      user?.uid || "teacher_1",
      user?.displayName || "Ustoz Yoqubov",
      ancTitle,
      ancMsg
    );
    setAnnouncements((prev) => [created, ...prev]);
    setAncTitle("");
    setAncMsg("");
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Haqiqatan ham guruhni tark etmoqchimisiz? Topshirilgan ishlaringiz saqlanib qoladi.")) return;
    await leaveGroup(user?.uid || "guest_learner", groupId);
    router.push("/groups");
  };

  const copyCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-[var(--muted)]">Guruh ma’lumotlari yuklanmoqda…</div>;
  }

  if (!group) {
    return (
      <div className="card p-12 text-center space-y-4 rounded-2xl">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Guruh topilmadi</h2>
        <Link href="/groups" className="btn-primary !py-2 !px-4 text-xs font-bold inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Guruhlar ro‘yxatiga qaytish</span>
        </Link>
      </div>
    );
  }

  const capacityPercent = Math.min(100, Math.round((group.learnerCount / 15) * 100));

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <Link
          href="/groups"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha guruhlarga qaytish</span>
        </Link>

        {/* Role Mode Switcher (Demonstration & Testing) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)] font-semibold">Ko‘rinish:</span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)]">
            <button
              onClick={() => setViewRole("teacher")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                viewRole === "teacher"
                  ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              Ustoz Kabineti
            </button>
            <button
              onClick={() => setViewRole("learner")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                viewRole === "learner"
                  ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--secondary)] hover:text-[var(--foreground)]"
              }`}
            >
              Talaba Kabineti
            </button>
          </div>
        </div>
      </div>

      {/* Group Header Card */}
      <div className="card p-6 md:p-8 space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[var(--primary)] border border-orange-200/50 uppercase">
                {group.examTrack} Track
              </span>
              <span
                className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border uppercase ${
                  group.state === "ACTIVE"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300/50"
                    : group.state === "UNDER_MINIMUM"
                    ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300/50"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300/50"
                }`}
              >
                {group.state}
              </span>
              <span className="text-xs text-[var(--muted)] font-medium">
                Maqsad: <strong>Band {group.targetBand.toFixed(1)}</strong>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">
              {group.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--secondary)] max-w-3xl leading-relaxed">
              {group.description}
            </p>
          </div>

          {/* Quick Stats & Invite Code */}
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button
              onClick={copyCode}
              className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] text-xs flex items-center gap-2 cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              <span className="text-[var(--muted)]">Taklif kodi:</span>
              <span className="font-mono font-black text-[var(--foreground)]">{group.inviteCode}</span>
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />}
            </button>

            {viewRole === "learner" && (
              <button
                onClick={handleLeaveGroup}
                className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Guruhdan chiqish
              </button>
            )}
          </div>
        </div>

        {/* Capacity Indicator Progress Bar */}
        <div className="pt-3 border-t border-[var(--border)]/70 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--secondary)] font-medium">
              Faol a’zolar (Min: 5 · Max: 15):
            </span>
            <span className="font-mono font-bold text-[var(--foreground)] tabular">
              {group.learnerCount} / 15 nafar
            </span>
          </div>
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

          {group.state === "FORMING" && (
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              ⚠️ Guruh shakllanish bosqichida. Topshiriqlar va darslar faollashishi uchun yana <strong>{Math.max(0, 5 - group.learnerCount)} nafar</strong> talaba a’zo bo‘lishi lozim.
            </p>
          )}

          {group.state === "UNDER_MINIMUM" && (
            <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">
              ⚠️ Talabalar soni 5 tadan kamaydi ({group.learnerCount}/15). Yangi topshiriqlar yaratish vaqtincha bloklandi. Mavjud topshiriqlarni yakunlash mumkin.
            </p>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 border-b border-[var(--border)] pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Guruh Ko‘rinishi" },
          { id: "assignments", label: `Topshiriqlar (${assignments.length})` },
          { id: "announcements", label: `E’lonlar (${announcements.length})` },
          ...(viewRole === "teacher"
            ? [
                { id: "submissions", label: "Ishlar & Baholash" },
                { id: "learners", label: `Talabalar (${group.learnerCount})` },
              ]
            : [{ id: "my_results", label: "Mening Natijalarim" }]),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[var(--primary)] text-white shadow-xs"
                : "bg-[var(--surface)] text-[var(--secondary)] hover:text-[var(--foreground)] border border-[var(--border)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 space-y-4">
            <div className="card p-6 space-y-3 bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="text-base font-bold text-[var(--foreground)]">Yaqinlashayotgan Topshiriqlar</h3>
              {assignments.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">Hozircha faol topshiriqlar yo‘q.</p>
              ) : (
                <div className="space-y-2.5">
                  {assignments.map((asgn) => (
                    <div
                      key={asgn.id}
                      className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-[var(--primary)] uppercase">
                          {asgn.skill}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--foreground)]">{asgn.title}</h4>
                        <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Muddat: {new Date(asgn.deadlineAt).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        href={`/${asgn.skill}`}
                        className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 shrink-0"
                      >
                        <span>Topshirish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Announcements */}
            <div className="card p-6 space-y-3 bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--foreground)]">Ustoz E’lonlari</h3>
                <span className="text-xs text-[var(--muted)]">{announcements.length} ta e’lon</span>
              </div>

              {announcements.length === 0 ? (
                <p className="text-xs text-[var(--muted)]">E’lonlar mavjud emas.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((anc) => (
                    <div key={anc.id} className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">{anc.title}</h4>
                        <span className="text-[11px] text-[var(--muted)]">{new Date(anc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-[var(--secondary)] leading-relaxed">{anc.message}</p>
                      <span className="text-[11px] font-semibold text-[var(--primary)] block pt-1">Ustoz: {anc.authorName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Teacher Info & Schedule */}
          <div className="md:col-span-4 space-y-4">
            <div className="card p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">Guruh Ma’lumotlari</h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[var(--muted)] block">Yetakchi Ustoz:</span>
                  <span className="font-bold text-[var(--foreground)]">{group.ownerName}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Dars Vaqti:</span>
                  <span className="font-bold text-[var(--foreground)]">{group.schedule || "Kelishilgan"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Vaqt mintaqasi:</span>
                  <span className="font-bold text-[var(--foreground)]">{group.timezone}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)] block">Guruh holati:</span>
                  <span className="font-bold text-[var(--primary)]">{group.state} ({group.learnerCount}/15 nafar)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">Guruh Topshiriqlari</h3>
              <p className="text-xs text-[var(--secondary)]">Ustoz tomonidan e’lon qilingan mashg‘ulotlar.</p>
            </div>

            {viewRole === "teacher" && (
              <button
                onClick={() => setCreateAsgnModal(true)}
                className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi topshiriq berish</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {assignments.map((asgn) => (
              <div key={asgn.id} className="card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-[var(--primary)] uppercase">
                      {asgn.skill}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      Muddat: <strong>{new Date(asgn.deadlineAt).toLocaleDateString()}</strong>
                    </span>
                    {asgn.allowLateSubmissions && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-semibold">
                        Kech topshirish mumkin
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[var(--foreground)]">{asgn.title}</h4>
                  <p className="text-xs text-[var(--secondary)] leading-relaxed">{asgn.instructions}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/${asgn.skill}`}
                    className="btn-primary !py-2.5 !px-5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>{viewRole === "teacher" ? "Topshiriqni ko‘rish" : "Topshiriqni boshlash"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-6 max-w-3xl">
          {viewRole === "teacher" && (
            <div className="card p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)]">
              <h3 className="text-base font-bold text-[var(--foreground)]">Yangi e’lon yozish</h3>
              <form onSubmit={handlePostAnnouncement} className="space-y-3">
                <input
                  type="text"
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  placeholder="E’lon sarlavhasi..."
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
                <textarea
                  value={ancMsg}
                  onChange={(e) => setAncMsg(e.target.value)}
                  placeholder="E’lon matni..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" className="btn-primary !py-2 !px-4 text-xs font-bold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>E’lonni joylash</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {announcements.map((anc) => (
              <div key={anc.id} className="card p-5 space-y-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[var(--foreground)]">{anc.title}</h4>
                  <span className="text-xs text-[var(--muted)]">{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[var(--secondary)] leading-relaxed">{anc.message}</p>
                <span className="text-[11px] font-semibold text-[var(--primary)] block pt-1">Yozuvchi: {anc.authorName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEACHER SUBMISSIONS & REVIEWS */}
      {viewRole === "teacher" && activeTab === "submissions" && (
        <div className="card p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
          <h3 className="text-base font-bold text-[var(--foreground)]">Talabalar Topshirgan Ishlari</h3>
          <p className="text-xs text-[var(--secondary)]">Guruh talabalari topshirgan insholar va mashqlar natijalari.</p>

          <div className="p-8 text-center text-xs text-[var(--muted)] border border-dashed rounded-xl">
            Talabalar yangi topshiriqlarni topshirishi bilan bu yerda tekshirish uchun ko‘rinadi. Ustoz har bir inshoga shaxsiy Band bahosi va mezonlar bo‘yicha izoh qoldira oladi.
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL (Section 6) */}
      {createAsgnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card max-w-lg w-full p-6 space-y-4 shadow-xl border border-[var(--border)] bg-[var(--surface)] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[var(--foreground)]">Guruhga Yangi Topshiriq Berish</h3>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Topshiriq nomi:</label>
                <input
                  type="text"
                  value={asgnTitle}
                  onChange={(e) => setAsgnTitle(e.target.value)}
                  placeholder="Masalan: Writing Task 2: AI & Creativity in Education"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[var(--foreground)]">Modul (Skill):</label>
                  <select
                    value={asgnSkill}
                    onChange={(e) => setAsgnSkill(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  >
                    <option value="writing">Writing</option>
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                    <option value="speaking">Speaking</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[var(--foreground)]">Muddati (kun):</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={asgnDays}
                    onChange={(e) => setAsgnDays(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Ustoz ko‘rsatmalari:</label>
                <textarea
                  value={asgnInstructions}
                  onChange={(e) => setAsgnInstructions(e.target.value)}
                  placeholder="Inshoni yozishda nimalarga e’tibor qaratish kerakligi haqida ko‘rsatma..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="asgnLate"
                  checked={asgnAllowLate}
                  onChange={(e) => setAsgnAllowLate(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--primary)]"
                />
                <label htmlFor="asgnLate" className="font-semibold text-[var(--foreground)] cursor-pointer">
                  Muddati o‘tgach ham kech topshirishga ruxsat berish (Late belgisi bilan)
                </label>
              </div>

              {asgnError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300">
                  {asgnError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateAsgnModal(false)}
                  className="btn-secondary !py-2 !px-4 text-xs font-bold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer shadow-xs"
                >
                  Topshiriqni e’lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GroupDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="card p-12 text-center text-sm text-[var(--muted)]">
          Guruh ma’lumotlari yuklanmoqda…
        </div>
      }
    >
      <GroupDetailPageContent />
    </Suspense>
  );
}
