"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Goal } from "@/types";
import { useAuth } from "./useAuth";

export function useGoals() {
  const { uid } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "users", uid, "goals"),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setGoals(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Goal, "id">),
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  async function addGoal(data: Omit<Goal, "id" | "order">) {
    if (!uid) return;
    await addDoc(collection(db, "users", uid, "goals"), {
      ...data,
      order: goals.length,
      createdAt: serverTimestamp(),
    });
  }

  async function updateGoalProgress(goalId: string, progress: number) {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid, "goals", goalId), {
      progress,
      isCompleted: progress >= 100,
    });
  }

  async function deleteGoal(goalId: string) {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "goals", goalId));
  }

  const byCategory = goals.reduce<Record<string, Goal[]>>((acc, g) => {
    if (!acc[g.category]) acc[g.category] = [];
    acc[g.category].push(g);
    return acc;
  }, {});

  return { goals, byCategory, loading, addGoal, updateGoalProgress, deleteGoal };
}
