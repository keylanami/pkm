export async function getHPP(periode) {
  const res = await fetch(`/api/hpp?periode=${periode}`, {
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Gagal ambil HPP");
  }

  return res.json();
}

export async function createHPP(payload) {
  const res = await fetch("/api/hpp", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal simpan HPP");
  }

  return res.json();
}
