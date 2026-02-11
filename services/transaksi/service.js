
export async function getTransaksi(periode) {
  const url = periode ? `/api/transaksi?periode=${periode}` : `/api/transaksi`;

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Gagal ambil transaksi");
  return res.json();
}

export async function createTransaksi(data) {
  const res = await fetch("/api/transaksi", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal tambah transaksi");
  return res.json();
}

export async function updateTransaksi(id, data) {
  const res = await fetch(`/api/transaksi/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal update transaksi");
  return res.json();
}

export async function deleteTransaksi(id) {
  const res = await fetch(`/api/transaksi/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Gagal hapus transaksi");
  return res.json();
}
