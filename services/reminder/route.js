import api from "@/lib/api";

export const getReminders = async () => {
  const res = await fetch("/api/reminder");
  if (!res.ok) throw new Error("Gagal mengambil data reminder");
  return res.json();
};

export const createReminder = async (payload) => {
  const res = await fetch("/api/reminder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal menyimpan reminder");
  return res.json();
};

export const deleteReminder = async (id) => {
  const res = await fetch(`/api/reminder/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal menghapus reminder");
  return res.json();
}; 

export const updateReminder = async (id, payload) => {
  const res = await fetch(`/api/reminder/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Gagal update reminder");
  return res.json();
};