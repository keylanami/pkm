"use client";

import { useState } from "react";
import { register } from "@/services/auth/service";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    try {
      await register({
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
        username: form.email.split("@")[0],
      });

      router.push("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Register gagal");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email / No. HP"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Kata Sandi"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
      <input
        type="password"
        placeholder="Konfirmasi Kata Sandi"
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
      />
      <input
        placeholder="Nomor HP"
        onChange={(e) => 
            setForm({...form, phone_number: e.target.value})
        }
      />
      <button type="submit">Daftar</button>
    </form>
  );
}
