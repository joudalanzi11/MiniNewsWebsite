"use client";

import { useSyncExternalStore } from "react";
import type { Article } from "./types";

// قائمة "للقراءة لاحقًا" — مخزّنة في localStorage ومتزامنة بين كل المكوّنات
const STORAGE_KEY = "reading-list";

let items: Article[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Article[]) : [];
  } catch {
    return [];
  }
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((notify) => notify());
}

function subscribe(callback: () => void) {
  // نأجّل تحميل localStorage لأول اشتراك عشان نتفادى اختلاف الـ hydration
  if (!loaded) {
    loaded = true;
    items = loadFromStorage();
  }
  listeners.add(callback);

  // مزامنة بين تبويبات المتصفح
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      items = loadFromStorage();
      listeners.forEach((notify) => notify());
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: Article[] = [];
function getSnapshot() {
  return items;
}
function getServerSnapshot() {
  return EMPTY;
}

export function isSaved(url: string): boolean {
  return items.some((a) => a.url === url);
}

export function toggleSaved(article: Article) {
  items = isSaved(article.url)
    ? items.filter((a) => a.url !== article.url)
    : [article, ...items];
  persist();
}

export function removeSaved(url: string) {
  items = items.filter((a) => a.url !== url);
  persist();
}

// هوك يرجّع القائمة ويعيد الرسم عند أي تغيير
export function useReadingList(): Article[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
