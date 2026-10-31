"use client";

const BOOKMARKS_STORAGE_KEY = "ielts_focus_bookmarks";

export type BookmarkItem = {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  title: string;
  savedAt: number;
};

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isBookmarked(id: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === id);
}

export function toggleBookmark(item: {
  id: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  title: string;
}): boolean {
  if (typeof window === "undefined") return false;
  try {
    const bookmarks = getBookmarks();
    const existingIndex = bookmarks.findIndex((b) => b.id === item.id);
    let next: BookmarkItem[];
    let nowSaved = false;

    if (existingIndex >= 0) {
      next = bookmarks.filter((b) => b.id !== item.id);
      nowSaved = false;
    } else {
      next = [{ ...item, savedAt: Date.now() }, ...bookmarks];
      nowSaved = true;
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("ielts-bookmarks-updated"));
    return nowSaved;
  } catch {
    return false;
  }
}
