"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Types & Constants ───────────────────────────────────────────────────────

export interface FamilyMember {
  id: string;
  name: string;
  role: "parent" | "child";
  color: string;
  avatar?: string;
  createdAt: string;
}

export const MEMBER_COLORS = [
  "#FF6B6B", // Warm Red
  "#4ECDC4", // Teal
  "#45B7D1", // Sky Blue
  "#96CEB4", // Sage Green
  "#FFEAA7", // Soft Yellow
  "#DDA0DD", // Plum
  "#FF8C42", // Orange
  "#6C5CE7", // Purple
] as const;

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = "family-members";

function generateId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readFromStorage(): FamilyMember[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeToStorage(members: FamilyMember[]): { success: boolean; error?: string } {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    return { success: true };
  } catch (e: unknown) {
    const message =
      e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Der Speicher ist voll. Bitte loesche einige Daten und versuche es erneut."
        : "Fehler beim Speichern. Bitte versuche es erneut.";
    return { success: false, error: message };
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface FamilyMembersContextValue {
  members: FamilyMember[];
  parents: FamilyMember[];
  children: FamilyMember[];
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  addMember: (data: {
    name: string;
    role: "parent" | "child";
    color: string;
    avatar?: string;
  }) => { success: boolean; error?: string; member?: FamilyMember };
  updateMember: (
    id: string,
    data: Partial<{ name: string; role: "parent" | "child"; color: string; avatar?: string }>
  ) => { success: boolean; error?: string };
  deleteMember: (id: string) => { success: boolean; error?: string };
  hasDuplicateName: (name: string, excludeId?: string) => boolean;
  isLastParent: (id: string) => boolean;
}

const FamilyMembersContext = createContext<FamilyMembersContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function FamilyMembersProvider({ children: providerChildren }: { children: ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BUG-5 fix: ref always holds latest members so mutations never close over stale state
  const membersRef = useRef<FamilyMember[]>([]);

  const setMembersAndRef = useCallback((updated: FamilyMember[]) => {
    membersRef.current = updated;
    setMembers(updated);
  }, []);

  // Initial load
  useEffect(() => {
    const loaded = readFromStorage();
    setMembersAndRef(loaded);
    setIsLoading(false);
  }, [setMembersAndRef]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setMembersAndRef(readFromStorage());
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setMembersAndRef]);

  const addMember = useCallback(
    (data: {
      name: string;
      role: "parent" | "child";
      color: string;
      avatar?: string;
    }): { success: boolean; error?: string; member?: FamilyMember } => {
      const newMember: FamilyMember = {
        id: generateId(),
        name: data.name.trim(),
        role: data.role,
        color: data.color,
        avatar: data.avatar,
        createdAt: new Date().toISOString(),
      };

      const updated = [...membersRef.current, newMember];
      const result = writeToStorage(updated);
      if (result.success) {
        setMembersAndRef(updated);
        setError(null);
        return { success: true, member: newMember };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setMembersAndRef]
  );

  const updateMember = useCallback(
    (
      id: string,
      data: Partial<{ name: string; role: "parent" | "child"; color: string; avatar?: string }>
    ): { success: boolean; error?: string } => {
      const current = membersRef.current;

      // BUG-7 fix: block changing last parent's role to child
      if (data.role === "child") {
        const member = current.find((m) => m.id === id);
        if (member?.role === "parent") {
          const parentCount = current.filter((m) => m.role === "parent").length;
          if (parentCount <= 1) {
            return {
              success: false,
              error: "Das letzte Elternteil kann nicht zu einem Kind umgewandelt werden.",
            };
          }
        }
      }

      const updated = current.map((m) =>
        m.id === id ? { ...m, ...data, name: data.name?.trim() ?? m.name } : m
      );
      const result = writeToStorage(updated);
      if (result.success) {
        setMembersAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setMembersAndRef]
  );

  const deleteMember = useCallback(
    (id: string): { success: boolean; error?: string } => {
      const current = membersRef.current;
      const member = current.find((m) => m.id === id);
      if (!member) return { success: false, error: "Mitglied nicht gefunden." };

      // Protect last parent
      if (member.role === "parent") {
        const parentCount = current.filter((m) => m.role === "parent").length;
        if (parentCount <= 1) {
          return {
            success: false,
            error: "Das letzte Elternteil kann nicht geloescht werden.",
          };
        }
      }

      const updated = current.filter((m) => m.id !== id);
      const result = writeToStorage(updated);
      if (result.success) {
        setMembersAndRef(updated);
        setError(null);

        // Cascading delete: clean up related data in other localStorage keys
        try {
          const relatedKeys = ["tasks", "appointments", "notes"];
          for (const key of relatedKeys) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const items = JSON.parse(raw);
              if (Array.isArray(items)) {
                const filtered = items.filter(
                  (item: Record<string, unknown>) => item.memberId !== id
                );
                localStorage.setItem(key, JSON.stringify(filtered));
              }
            }
          }
        } catch {
          // Non-critical: related data cleanup failed silently
        }

        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setMembersAndRef]
  );

  const hasDuplicateName = useCallback((name: string, excludeId?: string): boolean => {
    const trimmed = name.trim().toLowerCase();
    return membersRef.current.some(
      (m) => m.name.toLowerCase() === trimmed && m.id !== excludeId
    );
  }, []);

  const isLastParent = useCallback((id: string): boolean => {
    const current = membersRef.current;
    const member = current.find((m) => m.id === id);
    if (!member || member.role !== "parent") return false;
    return current.filter((m) => m.role === "parent").length <= 1;
  }, []);

  const parents = members.filter((m) => m.role === "parent");
  const children = members.filter((m) => m.role === "child");

  return (
    <FamilyMembersContext.Provider
      value={{
        members,
        parents,
        children,
        isLoading,
        error,
        setError,
        addMember,
        updateMember,
        deleteMember,
        hasDuplicateName,
        isLastParent,
      }}
    >
      {providerChildren}
    </FamilyMembersContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFamilyMembers(): FamilyMembersContextValue {
  const ctx = useContext(FamilyMembersContext);
  if (!ctx) {
    throw new Error("useFamilyMembers must be used within a FamilyMembersProvider");
  }
  return ctx;
}
