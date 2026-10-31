"use client";

import { useState } from "react";
import { AlertCircle, X, CheckCircle2, Send, Flag } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { submitQualityReport, QualityReportType } from "@/lib/services/quality-reports-service";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContext: {
    skill: "reading" | "listening" | "writing" | "speaking";
    contentVersion?: string;
    itemReference: string;
    itemPrompt: string;
    expectedAnswer?: string;
  } | null;
}

export function ReportIssueModal({ isOpen, onClose, reportContext }: ReportIssueModalProps) {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<QualityReportType>("question_incorrect");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !reportContext) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    await submitQualityReport({
      skill: reportContext.skill,
      contentVersion: reportContext.contentVersion || "v1.0",
      itemReference: reportContext.itemReference,
      itemPrompt: reportContext.itemPrompt,
      expectedAnswer: reportContext.expectedAnswer,
      reporterUid: user?.uid,
      reporterEmail: user?.email || "anonymous",
      reportType,
      reason: reason.trim(),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="card max-w-md w-full p-6 space-y-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--foreground)]">
                Xatolik haqida xabar berish
              </h3>
              <p className="text-[11px] text-[var(--muted)]">Sifat nazorati & Muammo bildirish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[var(--success)] mx-auto" />
            <h4 className="font-bold text-sm text-[var(--foreground)]">
              Xabaringiz qabul qilindi!
            </h4>
            <p className="text-xs text-[var(--muted)]">
              Adminlar va o‘qituvchilar ushbu savolni tekshirib, zarur bo‘lsa tuzatish kiritadilar.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Target Item summary */}
            <div className="p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] space-y-1">
              <span className="text-[10px] font-bold uppercase text-[var(--muted)]">Savol / Material:</span>
              <p className="font-semibold text-[var(--foreground)] line-clamp-2">
                {reportContext.itemPrompt}
              </p>
            </div>

            {/* Issue Category */}
            <div className="space-y-1.5">
              <label className="font-bold text-[var(--foreground)]">Muammo turi:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as QualityReportType)}
                className="w-full text-xs p-2.5 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)]"
              >
                <option value="question_incorrect">Savol yoki to‘g‘ri javob kaliti noto‘g‘ri</option>
                <option value="feedback_incorrect">Baholash yoki berilgan feedback xato</option>
                <option value="audio_mismatch">Audio/matn mos kelmayapti</option>
                <option value="typo">Imlo yoki grammatik xatolik (Typo)</option>
                <option value="other">Boshqa noaniqlik</option>
              </select>
            </div>

            {/* Reason Text */}
            <div className="space-y-1.5">
              <label className="font-bold text-[var(--foreground)]">
                Batafsil tushuntirish:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Qaysi qismida xatolik borligini va sizning fikringizcha qanday bo‘lishi kerakligini yozing..."
                rows={4}
                className="w-full text-xs p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] text-[var(--foreground)] focus:outline-hidden focus:border-[var(--primary)]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary !py-2 !px-4 text-xs cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !reason.trim()}
                className="btn-primary !py-2 !px-5 text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Yuborilmoqda…" : "Yuborish"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
