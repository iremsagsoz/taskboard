import { useEffect, useMemo, useState } from "react";
import type { Task } from "../Interfaces/task";
import TaskForm from "../Components/TaskForm";
import TaskList from "../Components/TaskList";

const API_URL = "http://localhost:5050";

function mapTaskFromApi(data: any): Task {
  return {
    id: String(data.id),
    title: data.title,
    description: data.description ?? "",
    status: data.status,
    priority: data.priority ?? "medium",
    dueDate: data.due_date ?? undefined,
    createdAt: new Date(data.created_at).getTime(),
  };
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`${API_URL}/tasks`);

        if (!response.ok) {
          throw new Error("Tasklar alınamadı");
        }

        const data = await response.json();
        setTasks(data.map(mapTaskFromApi));
      } catch (error) {
        console.error("Tasklar alınamadı:", error);
      }
    }

    fetchTasks();
  }, []);

  async function addTask(input: Omit<Task, "id" | "createdAt">) {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          due_date: input.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Task eklenemedi");
      }

      const data = await response.json();
      const newTask = mapTaskFromApi(data);

      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("Task ekleme hatası:", error);
    }
  }

  async function deleteTask(id: string) {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Task silinemedi");
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  }

  async function updateTask(
    id: string,
    patch: Partial<Omit<Task, "id" | "createdAt">>
  ) {
    try {
      const currentTask = tasks.find((t) => t.id === id);

      if (!currentTask) return;

      const updatedTaskPayload = {
        title: patch.title ?? currentTask.title,
        description: patch.description ?? currentTask.description,
        status: patch.status ?? currentTask.status,
        priority: patch.priority ?? currentTask.priority,
        due_date: patch.dueDate ?? currentTask.dueDate,
      };

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskPayload),
      });

      if (!response.ok) {
        throw new Error("Task güncellenemedi");
      }

      const data = await response.json();
      const updatedTask = mapTaskFromApi(data);

      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return tasks;

    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q) ||
        (t.dueDate ?? "").toLowerCase().includes(q)
    );
  }, [tasks, query]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center text-white">
          <h1 className="text-4xl font-bold">🚀 Smart Planner</h1>
          <p className="mt-2 text-lg opacity-90">
            Görevlerini öncelik, durum ve deadline ile planla.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <div className="rounded-xl bg-white/20 px-6 py-3 backdrop-blur">
              <p className="text-sm">Toplam Görev</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-4xl px-6 pb-16">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-600">Ara</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Başlık, açıklama, durum, öncelik veya tarih..."
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