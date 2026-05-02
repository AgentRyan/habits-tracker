"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Habit, HabitLog } from "@/types";
import { useAuth } from "./useAuth";
import { formatDate } from "@/lib/utils/dateUtils";

export function useHabits() {
  const { uid } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "users", uid, "habits"),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setHabits(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Habit, "id">),
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  async function addHabit(data: Omit<Habit, "id" | "createdAt" | "order">) {
    if (!uid) return;
    await addDoc(collection(db, "users", uid, "habits"), {
      ...data,
      order: habits.length,
      isActive: true,
      createdAt: serverTimestamp(),
    });
  }

  async function deleteHabit(habitId: string) {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid, "habits", habitId));
  }

  return { habits, loading, addHabit, deleteHabit };
}

export function useHabitLogs(weekDates: Date[]) {
  const { uid } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const dateStrings = weekDates.map(formatDate);

  useEffect(() => {
    if (!uid || !weekDates.length) return;
    const startDate = dateStrings[0];
    const endDate = dateStrings[6];

    const q = query(
      collection(db, "users", uid, "habitLogs"),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );

    const unsub = onSnapshot(q, (snap) => {
      setLogs(
        snap.docs.map((d) => ({
          ...(d.data() as Omit<HabitLog, "">),
        }))
      );
      setLoading(false);
    });
    return unsub;
  }, [uid, dateStrings[0], dateStrings[6]]);

  async function toggleBoolean(habitId: string, date: string, current: boolean) {
    if (!uid) return;
    const docId = `${date}_${habitId}`;
    await setDoc(
      doc(db, "users", uid, "habitLogs", docId),
      {
        habitId,
        date,
        completed: !current,
        value: null,
        completedAt: !current ? serverTimestamp() : null,
      },
      { merge: true }
    );
  }

  async function setNumericValue(habitId: string, date: string, value: number, dailyGoal: number) {
    if (!uid) return;
    const docId = `${date}_${habitId}`;
    const completed = value >= dailyGoal;
    await setDoc(
      doc(db, "users", uid, "habitLogs", docId),
      {
        habitId,
        date,
        completed,
        value,
        completedAt: completed ? serverTimestamp() : null,
      },
      { merge: true }
    );
  }

  function getLog(habitId: string, date: string): HabitLog | undefined {
    return logs.find((l) => l.habitId === habitId && l.date === date);
  }

  return { logs, loading, toggleBoolean, setNumericValue, getLog };
}

export async function fetchLogsRange(uid: string, startDate: string, endDate: string): Promise<HabitLog[]> {
  const q = query(
    collection(db, "users", uid, "habitLogs"),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as HabitLog);
}
