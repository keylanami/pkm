"use client";

import { useState } from "react";
import { login } from "@/services/auth/service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="Email / No. HP"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Kata Sandi"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Masuk</button>
    </form>
  );
}
