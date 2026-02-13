import { useMemo, useState } from "react";
import type { Task, TaskStatus } from "../Interfaces/task";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
};

function statusBadge(status: TaskStatus) {
  const base = "text-xs rounded-full px-2 py-1 font-medium";
  if (status === "todo") return `${base} bg-slate-100 text-slate-700`;
  if (status === "doing") return `${base} bg-amber-100 text-amber-800`;
  return `${base} bg-emerald-100 text-emerald-800`;
}

export default function TaskItem({ task, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

  const canSave = useMemo(() => title.trim().length >= 2, [title]);

  function cancel() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setEditing(false);
  }

  function save() {
    if (!canSave) return;
    onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });
    setEditing(false);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      {!editing ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-semibold text-slate-900">{task.title}</h4>
              <span className={statusBadge(task.status)}>{task.status}</span>
            </div>

            {task.description ? (
              <p className="mt-1 text-sm text-slate-600 break-words">
                {task.description}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-400 italic">Açıklama yok</p>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setEditing(true)}
              className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-800 hover:bg-slate-200"
            >
              Düzenle
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
            >
              Sil
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900">Görevi düzenle</p>
            <span className={statusBadge(status)}>{status}</span>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Başlık</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div className="flex gap-2 pt-1">
            <button
              onClick={save}
              disabled={!canSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Kaydet
            </button>
            <button
              onClick={cancel}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800 hover:bg-slate-200"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
