"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KanbanBoard {
  id: string;
  name: string;
  type: "family" | "personal";
  ownerId: string;
  createdAt: string;
}

export interface KanbanList {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: string;
}

export interface KanbanCard {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedMemberId?: string;
  points?: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

// ─── Storage helpers ─────────────────────────────────────────────────────────

const BOARDS_KEY = "kanban_boards";
const LISTS_KEY = "kanban_lists";
const CARDS_KEY = "kanban_cards";

function generateId(): string {
  return `kb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, data: T[]): { success: boolean; error?: string } {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  } catch (e: unknown) {
    const message =
      e instanceof DOMException && e.name === "QuotaExceededError"
        ? "Der Speicher ist voll. Bitte loesche einige Daten und versuche es erneut."
        : "Fehler beim Speichern. Bitte versuche es erneut.";
    return { success: false, error: message };
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useKanban() {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [lists, setLists] = useState<KanbanList[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const boardsRef = useRef<KanbanBoard[]>([]);
  const listsRef = useRef<KanbanList[]>([]);
  const cardsRef = useRef<KanbanCard[]>([]);

  const setBoardsAndRef = useCallback((data: KanbanBoard[]) => {
    boardsRef.current = data;
    setBoards(data);
  }, []);

  const setListsAndRef = useCallback((data: KanbanList[]) => {
    listsRef.current = data;
    setLists(data);
  }, []);

  const setCardsAndRef = useCallback((data: KanbanCard[]) => {
    cardsRef.current = data;
    setCards(data);
  }, []);

  // Initial load
  useEffect(() => {
    setBoardsAndRef(readStorage<KanbanBoard>(BOARDS_KEY));
    setListsAndRef(readStorage<KanbanList>(LISTS_KEY));
    setCardsAndRef(readStorage<KanbanCard>(CARDS_KEY));
    setIsLoading(false);
  }, [setBoardsAndRef, setListsAndRef, setCardsAndRef]);

  // Cross-tab sync
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === BOARDS_KEY) setBoardsAndRef(readStorage<KanbanBoard>(BOARDS_KEY));
      if (e.key === LISTS_KEY) setListsAndRef(readStorage<KanbanList>(LISTS_KEY));
      if (e.key === CARDS_KEY) setCardsAndRef(readStorage<KanbanCard>(CARDS_KEY));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setBoardsAndRef, setListsAndRef, setCardsAndRef]);

  // ─── Board CRUD ──────────────────────────────────────────────────────────

  const createBoard = useCallback(
    (data: { name: string; type: "family" | "personal"; ownerId: string }) => {
      const board: KanbanBoard = {
        id: generateId(),
        name: data.name.trim(),
        type: data.type,
        ownerId: data.ownerId,
        createdAt: new Date().toISOString(),
      };
      const updated = [...boardsRef.current, board];
      const result = writeStorage(BOARDS_KEY, updated);
      if (result.success) {
        setBoardsAndRef(updated);
        setError(null);
        return { success: true, board };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setBoardsAndRef]
  );

  const updateBoard = useCallback(
    (id: string, data: Partial<{ name: string }>) => {
      const updated = boardsRef.current.map((b) =>
        b.id === id ? { ...b, ...data, name: data.name?.trim() ?? b.name } : b
      );
      const result = writeStorage(BOARDS_KEY, updated);
      if (result.success) {
        setBoardsAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setBoardsAndRef]
  );

  const deleteBoard = useCallback(
    (id: string) => {
      const updatedBoards = boardsRef.current.filter((b) => b.id !== id);
      const updatedLists = listsRef.current.filter((l) => l.boardId !== id);
      const updatedCards = cardsRef.current.filter((c) => c.boardId !== id);

      const r1 = writeStorage(BOARDS_KEY, updatedBoards);
      const r2 = writeStorage(LISTS_KEY, updatedLists);
      const r3 = writeStorage(CARDS_KEY, updatedCards);

      if (r1.success && r2.success && r3.success) {
        setBoardsAndRef(updatedBoards);
        setListsAndRef(updatedLists);
        setCardsAndRef(updatedCards);
        setError(null);
        return { success: true };
      }
      const err = r1.error || r2.error || r3.error;
      setError(err ?? null);
      return { success: false, error: err };
    },
    [setBoardsAndRef, setListsAndRef, setCardsAndRef]
  );

  // ─── List CRUD ───────────────────────────────────────────────────────────

  const createList = useCallback(
    (data: { boardId: string; name: string }) => {
      const boardLists = listsRef.current.filter((l) => l.boardId === data.boardId);
      const maxPos = boardLists.length > 0 ? Math.max(...boardLists.map((l) => l.position)) : -1;

      const list: KanbanList = {
        id: generateId(),
        boardId: data.boardId,
        name: data.name.trim(),
        position: maxPos + 1,
        createdAt: new Date().toISOString(),
      };
      const updated = [...listsRef.current, list];
      const result = writeStorage(LISTS_KEY, updated);
      if (result.success) {
        setListsAndRef(updated);
        setError(null);
        return { success: true, list };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setListsAndRef]
  );

  const updateList = useCallback(
    (id: string, data: Partial<{ name: string; position: number }>) => {
      const updated = listsRef.current.map((l) =>
        l.id === id ? { ...l, ...data, name: data.name?.trim() ?? l.name } : l
      );
      const result = writeStorage(LISTS_KEY, updated);
      if (result.success) {
        setListsAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setListsAndRef]
  );

  const deleteList = useCallback(
    (id: string) => {
      const updatedLists = listsRef.current.filter((l) => l.id !== id);
      const updatedCards = cardsRef.current.filter((c) => c.listId !== id);

      const r1 = writeStorage(LISTS_KEY, updatedLists);
      const r2 = writeStorage(CARDS_KEY, updatedCards);

      if (r1.success && r2.success) {
        setListsAndRef(updatedLists);
        setCardsAndRef(updatedCards);
        setError(null);
        return { success: true };
      }
      const err = r1.error || r2.error;
      setError(err ?? null);
      return { success: false, error: err };
    },
    [setListsAndRef, setCardsAndRef]
  );

  // ─── Card CRUD ───────────────────────────────────────────────────────────

  const createCard = useCallback(
    (data: {
      listId: string;
      boardId: string;
      title: string;
      description?: string;
      dueDate?: string;
      assignedMemberId?: string;
      points?: number;
    }) => {
      const card: KanbanCard = {
        id: generateId(),
        listId: data.listId,
        boardId: data.boardId,
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        dueDate: data.dueDate || undefined,
        assignedMemberId: data.assignedMemberId || undefined,
        points: data.points,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [...cardsRef.current, card];
      const result = writeStorage(CARDS_KEY, updated);
      if (result.success) {
        setCardsAndRef(updated);
        setError(null);
        return { success: true, card };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setCardsAndRef]
  );

  const updateCard = useCallback(
    (id: string, data: Partial<Omit<KanbanCard, "id" | "createdAt">>) => {
      const updated = cardsRef.current.map((c) =>
        c.id === id ? { ...c, ...data, title: data.title?.trim() ?? c.title } : c
      );
      const result = writeStorage(CARDS_KEY, updated);
      if (result.success) {
        setCardsAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setCardsAndRef]
  );

  const deleteCard = useCallback(
    (id: string) => {
      const updated = cardsRef.current.filter((c) => c.id !== id);
      const result = writeStorage(CARDS_KEY, updated);
      if (result.success) {
        setCardsAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setCardsAndRef]
  );

  const toggleCardComplete = useCallback(
    (id: string) => {
      const card = cardsRef.current.find((c) => c.id === id);
      if (!card) return { success: false, error: "Karte nicht gefunden." };

      const nowCompleted = !card.completed;
      const updated = cardsRef.current.map((c) =>
        c.id === id
          ? {
              ...c,
              completed: nowCompleted,
              completedAt: nowCompleted ? new Date().toISOString() : undefined,
            }
          : c
      );
      const result = writeStorage(CARDS_KEY, updated);
      if (result.success) {
        setCardsAndRef(updated);
        setError(null);
        return {
          success: true,
          completed: nowCompleted,
          card: { ...card, completed: nowCompleted },
        };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setCardsAndRef]
  );

  const moveCard = useCallback(
    (cardId: string, targetListId: string) => {
      const updated = cardsRef.current.map((c) =>
        c.id === cardId ? { ...c, listId: targetListId } : c
      );
      const result = writeStorage(CARDS_KEY, updated);
      if (result.success) {
        setCardsAndRef(updated);
        setError(null);
        return { success: true };
      }
      setError(result.error ?? null);
      return { success: false, error: result.error };
    },
    [setCardsAndRef]
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const getBoardLists = useCallback(
    (boardId: string) =>
      lists.filter((l) => l.boardId === boardId).sort((a, b) => a.position - b.position),
    [lists]
  );

  const getListCards = useCallback(
    (listId: string) => cards.filter((c) => c.listId === listId),
    [cards]
  );

  const getBoardCards = useCallback(
    (boardId: string) => cards.filter((c) => c.boardId === boardId),
    [cards]
  );

  const getVisibleBoards = useCallback(
    (memberId: string, memberRole: "parent" | "child") => {
      if (memberRole === "parent") return boards;
      return boards.filter((b) => b.type === "family" || b.ownerId === memberId);
    },
    [boards]
  );

  const getCardCountForBoard = useCallback(
    (boardId: string) => cards.filter((c) => c.boardId === boardId).length,
    [cards]
  );

  return {
    boards,
    lists,
    cards,
    isLoading,
    error,
    setError,
    // Board
    createBoard,
    updateBoard,
    deleteBoard,
    // List
    createList,
    updateList,
    deleteList,
    // Card
    createCard,
    updateCard,
    deleteCard,
    toggleCardComplete,
    moveCard,
    // Helpers
    getBoardLists,
    getListCards,
    getBoardCards,
    getVisibleBoards,
    getCardCountForBoard,
  };
}
