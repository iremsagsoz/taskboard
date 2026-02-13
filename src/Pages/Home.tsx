import { useEffect, useMemo, useState } from "react";
import type { Task } from "../Interfaces/task";
import { loadTasks, saveTasks } from "../utils/storage";
import TaskForm from "../Components/TaskForm";
import TaskList from "../Components/TaskList";

function uid() {
    console.log("HOME TSX LOADED ✅");

  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
}

export default function Home() {
    console.log("HOME TSX LOADED ✅");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(input: Omit<Task, "id" | "createdAt">) {
    const newTask: Task = { ...input, id: uid(), createdAt: Date.now() };
    setTasks((prev) => [newTask, ...prev]);
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTask(id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
    );
  }, [tasks, query]);

  return (
    <div className="min-h-screen bg-slate-100">

        
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">

        <div className="mx-auto max-w-4xl px-6 py-10 text-center text-white">
          <h1 className="text-4xl font-bold">🚀 TaskBoard</h1>
          <p className="mt-2 text-lg opacity-90">
            Basit, modern ve genişletilebilir CRUD uygulaması
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <div className="rounded-xl bg-white/20 px-6 py-3 backdrop-blur">
              <p className="text-sm">Toplam Görev</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto -mt-10 max-w-4xl px-6 pb-16">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-600">Ara</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Başlık, açıklama veya durum..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <TaskForm onAdd={addTask} />
            <TaskList
              tasks={filtered}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
