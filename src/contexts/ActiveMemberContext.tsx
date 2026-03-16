"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useFamilyMembers, type FamilyMember } from "@/hooks/useFamilyMembers";

// ─── Context ─────────────────────────────────────────────────────────────────

interface ActiveMemberContextValue {
  activeMember: FamilyMember | null;
  setActiveMemberId: (id: string | null) => void;
}

const ActiveMemberContext = createContext<ActiveMemberContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function ActiveMemberProvider({ children }: { children: ReactNode }) {
  const { members, isLoading } = useFamilyMembers();
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  // Auto-select first member when members load and none is active
  useEffect(() => {
    if (!isLoading && members.length > 0 && activeMemberId === null) {
      setActiveMemberId(members[0].id);
    }
  }, [isLoading, members, activeMemberId]);

  // If the active member is deleted, fall back to first member
  useEffect(() => {
    if (
      activeMemberId !== null &&
      members.length > 0 &&
      !members.some((m) => m.id === activeMemberId)
    ) {
      setActiveMemberId(members[0].id);
    }
  }, [members, activeMemberId]);

  const activeMember =
    members.find((m) => m.id === activeMemberId) ?? null;

  const handleSetActiveMemberId = useCallback((id: string | null) => {
    setActiveMemberId(id);
  }, []);

  return (
    <ActiveMemberContext.Provider
      value={{
        activeMember,
        setActiveMemberId: handleSetActiveMemberId,
      }}
    >
      {children}
    </ActiveMemberContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActiveMember(): ActiveMemberContextValue {
  const ctx = useContext(ActiveMemberContext);
  if (!ctx) {
    throw new Error(
      "useActiveMember must be used within an ActiveMemberProvider"
    );
  }
  return ctx;
}
