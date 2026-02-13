import { useMemo, useState } from "react";
import type { Task, TaskStatus } from "../Interfaces/task";

type Props = {
  onAdd: (task: Omit<Task, "id" | "createdAt">) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const disabled = useMemo(() => title.trim().length < 2, [title]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });

    setTitle("");
    setDescription("");
    setStatus("todo");
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Yeni görev</h3>
        <p className="text-sm text-slate-600">Başlık gir, durum seç, ekle.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Başlık</label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Sunum taslağını bitir"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Açıklama (opsiyonel)
          </label>
          <input
            className={inputClass}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Örn: Hero + pricing..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Durum</label>
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          disabled={disabled}
          className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>
    </div>
  );
}
