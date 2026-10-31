"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  AlertCircle,
  X,
  Layers,
  Flag,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SAMPLE_READING_TESTS, SampleReadingTest } from "@/lib/reading/sample-data";
import {
  fetchQualityReports,
  updateQualityReportStatus,
  QualityReport,
  QualityReportStatus,
} from "@/lib/services/quality-reports-service";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"cms" | "quality_reports">("cms");
  const [tests, setTests] = useState<SampleReadingTest[]>(SAMPLE_READING_TESTS);
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Quality Reports Queue state (Section 13)
  const [reports, setReports] = useState<QualityReport[]>([]);
  const [reportFilter, setReportFilter] = useState<string>("all");
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchQualityReports().then((list) => {
      setReports(list);
      const notes: Record<string, string> = {};
      list.forEach((r) => {
        if (r.adminNotes) notes[r.id] = r.adminNotes;
      });
      setAdminNotes(notes);
    });
  }, []);

  const handleUpdateReportStatus = async (
    reportId: string,
    status: QualityReportStatus
  ) => {
    const note = adminNotes[reportId];
    await updateQualityReportStatus(reportId, status, note);
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status, adminNotes: note, ...(status === "resolved" ? { resolvedAt: Date.now() } : {}) }
          : r
      )
    );
  };

  // New drill form
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<"reading" | "listening">("reading");
  const [duration, setDuration] = useState("8");
  const [passageText, setPassageText] = useState("");
  const [qPrompt, setQPrompt] = useState("");
  const [qType, setQType] = useState<"trueFalseNotGiven" | "singleChoice" | "sentenceCompletion">("trueFalseNotGiven");
  const [qAccepted, setQAccepted] = useState("");
  const [qExplanation, setQExplanation] = useState("");

  const filtered = tests.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchSkill = filterSkill === "all" || t.skill === filterSkill;
    return matchSearch && matchSkill;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !passageText.trim()) return;

    const newId = `drill-${Date.now()}`;
    const newTest: SampleReadingTest = {
      id: newId,
      skill: "reading",
      examTrack: "academic",
      title: title.trim(),
      tags: ["admin-created", "academic"],
      status: "published",
      publishedVersion: "v1",
      estimatedDuration: parseInt(duration, 10) || 8,
      source: "Admin CMS",
      creator: "Platform Admin",
      license: "CC BY 4.0",
      attribution: "Original material created via Admin CMS",
      aiGenerated: false,
      reviewedBy: "Admin",
      reviewedAt: new Date().toISOString(),
      schemaVersion: 1,
      section: {
        title: title.trim(),
        paragraphs: [
          {
            id: "p1",
            text: passageText.trim(),
          },
        ],
        questions: [
          {
            id: `q_${Date.now()}`,
            type: qType,
            instructions:
              qType === "trueFalseNotGiven"
                ? "Do the following statements agree with the information?"
                : "Choose the correct answer or complete the sentence.",
            prompt: qPrompt.trim() || "Savol matni kiritilmadi.",
            accepted: qAccepted.split(",").map((s) => s.trim().toLowerCase()),
            explanation: qExplanation.trim() || "Matndagi dalil asosida tasdiqlangan.",
            evidence: passageText.slice(0, 100),
          },
        ],
      },
    };

    setTests((prev) => [newTest, ...prev]);
    setModalOpen(false);

    // Reset form
    setTitle("");
    setPassageText("");
    setQPrompt("");
    setQAccepted("");
    setQExplanation("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="eyebrow flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ma’muryat Paneli
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            IELTS Admin & Content CMS
          </h1>
          <p className="text-sm text-[var(--secondary)] mt-0.5">
            Testlar bazasi, matnlar tahriri, savollar va nashr holatini boshqarish.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary text-xs sm:text-sm !py-2.5 !px-4 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1" />
          Yangi mashq yaratish
        </button>
      </div>

      {/* Admin Subsystem Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        <button
          onClick={() => setActiveTab("cms")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "cms"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Materiallar & Mashqlar CMS</span>
        </button>

        <button
          onClick={() => setActiveTab("quality_reports")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "quality_reports"
              ? "bg-[var(--primary)] text-white shadow-xs"
              : "bg-[var(--surface-subtle)] text-[var(--secondary)] hover:text-[var(--foreground)]"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Sifat Nazorati & Shikoyatlar ({reports.filter((r) => r.status === "pending").length})</span>
        </button>
      </div>

      {activeTab === "quality_reports" ? (
        /* SECTION 13: QUALITY CONTROL & REPORT QUEUE */
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: `Barchasi (${reports.length})` },
                { id: "pending", label: `Kutilmoqda (${reports.filter((r) => r.status === "pending").length})` },
                { id: "investigating", label: `Tekshirilmoqda (${reports.filter((r) => r.status === "investigating").length})` },
                { id: "resolved", label: `Hal qilindi (${reports.filter((r) => r.status === "resolved").length})` },
                { id: "dismissed", label: `Rad etildi (${reports.filter((r) => r.status === "dismissed").length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setReportFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    reportFilter === tab.id
                      ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] font-bold"
                      : "text-[var(--secondary)] hover:bg-[var(--surface-subtle)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[var(--muted)]">
              Eslatma: Ko‘pchilik xato qilgani savolni avtomatik nuqsonli qilmaydi.
            </p>
          </div>

          {reports.filter((r) => reportFilter === "all" || r.status === reportFilter).length === 0 ? (
            <div className="card p-12 text-center text-xs text-[var(--muted)]">
              Ushbu filtr bo‘yicha shikoyatlar mavjud emas.
            </div>
          ) : (
            <div className="space-y-4">
              {reports
                .filter((r) => reportFilter === "all" || r.status === reportFilter)
                .map((rep) => {
                  const statusBadge = {
                    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                    investigating: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
                    resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                    dismissed: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
                  }[rep.status];

                  return (
                    <div
                      key={rep.id}
                      className="card p-5 md:p-6 space-y-4 border border-[var(--border)] bg-[var(--surface)] rounded-2xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-bold text-[var(--primary)] uppercase">
                            {rep.skill}
                          </span>
                          <span className="text-[var(--muted)] font-mono">
                            v{rep.contentVersion} · {rep.itemReference}
                          </span>
                          <span className="text-[var(--muted)]">· {new Date(rep.createdAt).toLocaleString()}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${statusBadge}`}>
                          {rep.status}
                        </span>
                      </div>

                      {/* Material info */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase text-[var(--muted)] block">
                          Shikoyat qilingan material / savol:
                        </span>
                        <p className="font-semibold text-[var(--foreground)]">{rep.itemPrompt}</p>
                      </div>

                      {/* Reporter note */}
                      <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--foreground)]">Foydalanuvchi izohi:</span>
                          <span className="text-[11px] text-[var(--muted)]">{rep.reporterEmail}</span>
                        </div>
                        <p className="leading-relaxed text-[var(--secondary)]">{rep.reason}</p>
                      </div>

                      {/* Admin notes & action controls */}
                      <div className="pt-2 border-t border-[var(--border)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={adminNotes[rep.id] ?? (rep.adminNotes || "")}
                            onChange={(e) =>
                              setAdminNotes((prev) => ({ ...prev, [rep.id]: e.target.value }))
                            }
                            placeholder="Admin ichki izohi (Internal note)..."
                            className="w-full text-xs p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rep.status !== "investigating" && rep.status !== "resolved" && (
                            <button
                              onClick={() => handleUpdateReportStatus(rep.id, "investigating")}
                              className="btn-secondary !py-1.5 !px-3 text-xs cursor-pointer"
                            >
                              Tekshirishga olish
                            </button>
                          )}
                          {rep.status !== "resolved" && (
                            <button
                              onClick={() => handleUpdateReportStatus(rep.id, "resolved")}
                              className="btn-primary !py-1.5 !px-3 text-xs font-bold cursor-pointer"
                            >
                              Hal qilindi
                            </button>
                          )}
                          {rep.status !== "dismissed" && (
                            <button
                              onClick={() => handleUpdateReportStatus(rep.id, "dismissed")}
                              className="text-xs text-[var(--muted)] hover:text-rose-600 px-2 cursor-pointer"
                            >
                              Rad etish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Material nomi yoki mavzu bo‘yicha qidiring..."
                className="w-full pl-10 pr-4"
              />
            </div>

            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">Barcha ko‘nikmalar</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
            </select>
          </div>

          {/* Content Catalog Table */}
          <div className="card p-0 overflow-hidden border border-[var(--border)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-subtle)] border-b border-[var(--border)] text-[var(--muted)] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Material nomi</th>
                    <th className="p-4">Modul</th>
                    <th className="p-4">Vaqt</th>
                    <th className="p-4">Versiya</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--surface-subtle)] transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[var(--foreground)]">{item.title}</p>
                        <p className="text-[11px] text-[var(--muted)]">{item.source || "IELTS Academic"} · {item.license || "CC BY 4.0"}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[var(--surface-subtle)] border border-[var(--border)] font-semibold uppercase">
                          {item.skill}
                        </span>
                      </td>
                      <td className="p-4 font-semibold tabular">{item.estimatedDuration} min</td>
                      <td className="p-4 font-mono text-[var(--muted)]">{item.publishedVersion || "v1"}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Published
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/reading/${item.id}`}
                          className="btn-secondary text-xs !py-1 !px-2.5 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ko‘rish
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Create New Drill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="card p-6 space-y-4 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="text-lg font-bold text-[var(--foreground)]">Yangi IELTS Mashqi Yaratish</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--surface-subtle)] text-[var(--muted)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <label>
                Mashq nomi (Title) *
                <input
                  type="text"
                  required
                  placeholder="masalan, Biodiversity in Coral Reefs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label>
                  Modul
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value as any)}
                    className="w-full mt-1"
                  >
                    <option value="reading">Reading</option>
                    <option value="listening">Listening</option>
                  </select>
                </label>

                <label>
                  Tavsiya etilgan vaqt (daqiqa)
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full mt-1"
                  />
                </label>
              </div>

              <label>
                Matn parchasi (Reading Passage) *
                <textarea
                  required
                  rows={5}
                  placeholder="Akademik matnni shu yerga kiriting..."
                  value={passageText}
                  onChange={(e) => setPassageText(e.target.value)}
                  className="w-full mt-1 resize-y font-normal"
                />
              </label>

              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-3">
                <span className="font-bold text-[var(--primary)] uppercase tracking-wider block">
                  1-Savol parametrlari
                </span>

                <label>
                  Savol turi
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full mt-1"
                  >
                    <option value="trueFalseNotGiven">True / False / Not Given</option>
                    <option value="singleChoice">Single Choice</option>
                    <option value="sentenceCompletion">Sentence Completion</option>
                  </select>
                </label>

                <label>
                  Savol matni (Prompt) *
                  <input
                    type="text"
                    required
                    placeholder="Coral reefs occupy less than 1% of the ocean floor."
                    value={qPrompt}
                    onChange={(e) => setQPrompt(e.target.value)}
                    className="w-full mt-1"
                  />
                </label>

                <label>
                  To‘g‘ri javob(lar) (vergul bilan ajrating) *
                  <input
                    type="text"
                    required
                    placeholder="true, ha"
                    value={qAccepted}
                    onChange={(e) => setQAccepted(e.target.value)}
                    className="w-full mt-1"
                  />
                </label>

                <label>
                  Izoh va dalil (Explanation)
                  <textarea
                    rows={2}
                    placeholder="Matnda aniq keltirilgan dalil va xulosalar."
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    className="w-full mt-1"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary !py-2 !px-4"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 !px-5"
                >
                  Nashr qilish (Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
