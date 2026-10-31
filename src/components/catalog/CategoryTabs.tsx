"use client";

interface CategoryTab {
  id: string;
  label: string;
  count?: number;
}

interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function CategoryTabs({ tabs, activeTab, onChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] overflow-x-auto no-scrollbar scroll-smooth">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              isActive
                ? "bg-[var(--surface)] text-[var(--primary)] shadow-xs border border-[var(--border)] font-bold"
                : "text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold tabular ${
                  isActive
                    ? "bg-orange-100 dark:bg-orange-950/60 text-[var(--primary)]"
                    : "bg-[var(--surface)] text-[var(--muted)]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
