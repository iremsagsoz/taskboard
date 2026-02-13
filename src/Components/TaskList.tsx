import type { Task } from "../Interfaces/task";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
};

export default function TaskList({ tasks, onDelete, onUpdate }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          ✓
        </div>
        <p className="font-semibold text-slate-900">Henüz görev yok</p>
        <p className="mt-1 text-sm text-slate-600">
          Soldan ilk görevi ekleyerek başlayabilirsin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
