import { useState } from "react";

const API_URL = "http://localhost:5050";

type Props = {
  onLogin: (user: { id: number; email: string }) => void;
};

export default function AuthForm({ onLogin }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Bir hata oluştu");
      return;
    }

    if (mode === "register") {
      setMessage("Kayıt başarılı. Şimdi giriş yapabilirsin.");
      setMode("login");
      return;
    }

    onLogin(data.user);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Smart Planner</h1>
        <p className="mt-2 text-sm text-slate-600">
          {mode === "login"
            ? "Hesabına giriş yap ve görevlerini yönet."
            : "Yeni hesap oluştur."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Şifre</label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="En az 6 karakter"
            />
          </div>

          {message && <p className="text-sm text-red-600">{message}</p>}

          <button className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
            {mode === "login" ? "Giriş yap" : "Kayıt ol"}
          </button>
        </form>

        <button
          className="mt-4 w-full text-sm text-blue-600"
          onClick={() => {
            setMessage("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login"
            ? "Hesabın yok mu? Kayıt ol"
            : "Zaten hesabın var mı? Giriş yap"}
        </button>
      </div>
    </div>
  );
}