import { useMemo, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../Interfaces/task";



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

function priorityBadge(priority: TaskPriority) {
  const base = "text-xs rounded-full px-2 py-1 font-medium";
  if (priority === "low") return `${base} bg-blue-50 text-blue-700`;
  if (priority === "medium") return `${base} bg-violet-50 text-violet-700`;
  return `${base} bg-red-50 text-red-700`;
}

function formatDate(date?: string) {
  if (!date) return "Deadline yok";
  return new Date(date).toLocaleDateString("tr-TR");
}

export default function TaskItem({ task, onDelete, onUpdate }: Props) {
  const isOverdue =
  task.dueDate && new Date(task.dueDate) < new Date();
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

  const canSave = useMemo(() => title.trim().length >= 2, [title]);

  function cancel() {
    setTitle(task.title);
    setDescription(task.description ?? "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ?? "");
    setEditing(false);
  }

  function save() {
    if (!canSave) return;

    onUpdate(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate || undefined,
    });

    setEditing(false);
  }

  return (
    <div
  className={`rounded-2xl border bg-white p-4 shadow-sm ${
    isOverdue ? "border-red-300" : "border-slate-200"
  }`}
>
      {!editing ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
          <h4 className="truncate font-semibold text-slate-900">
            {task.title}
          </h4>

          {isOverdue && (
            <span className="text-xs text-red-600 font-semibold">
              ⚠️ Gecikti
            </span>
          )}
        </div>
              <span className={statusBadge(task.status)}>{task.status}</span>
              <span className={priorityBadge(task.priority)}>
                {task.priority}
              </span>
            </div>

            {task.description ? (
              <p className="mt-1 break-words text-sm text-slate-600">
                {task.description}
              </p>
            ) : (
              <p className="mt-1 text-sm italic text-slate-400">Açıklama yok</p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Deadline: {formatDate(task.dueDate)}
            </p>
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">Görevi düzenle</p>
            <div className="flex gap-2">
              <span className={statusBadge(status)}>{status}</span>
              <span className={priorityBadge(priority)}>{priority}</span>
            </div>
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

          <div>
            <label className="text-sm font-medium text-slate-700">Öncelik</label>
            <select
              className={inputClass}
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              className={inputClass}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
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