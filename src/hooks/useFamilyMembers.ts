// Re-export everything from the shared context so existing imports stay unchanged.
// State lives in FamilyMembersContext — use FamilyMembersProvider to provide it.
export {
  useFamilyMembers,
  FamilyMembersProvider,
  MEMBER_COLORS,
  type FamilyMember,
} from "@/contexts/FamilyMembersContext";
