import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import Transaksi from "@/models/Transaksi";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const periode = searchParams.get("periode");

    if (!periode) return Response.json({ error: "Periode required" }, { status: 400 });

    const transactions = await Transaksi.find({
      id_user: user.id_user,
      periode: periode,
    }).lean(); 

    const totalPenjualan = transactions
      .filter((t) => t.jenis === "pemasukan" && t.kategori === "penjualan")
      .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

    const totalPengeluaran = transactions
      .filter((t) => t.jenis === "pengeluaran")
      .reduce((acc, curr) => acc + (curr.nominal || 0), 0);

    const labaBersih = totalPenjualan - totalPengeluaran;

    const chartDataMap = {};
    
    transactions.forEach((t) => {
      if (t.jenis === "pemasukan" && t.kategori === "penjualan") {
        const dateObj = new Date(t.tanggal);
        const day = dateObj.getDate(); 
        
        if (!chartDataMap[day]) chartDataMap[day] = 0;
        chartDataMap[day] += (t.nominal || 0);
      }
    });

    const chartData = Object.keys(chartDataMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((day) => ({
        tanggal: day,
        total: chartDataMap[day],
      }));

    const expenseMap = {
      bahan_baku: 0,
      tenaga_kerja: 0,
      overhead: 0,
      lainnya: 0
    };

    transactions.forEach((t) => {
      if (t.jenis === "pengeluaran") {
        const cat = expenseMap[t.kategori] !== undefined ? t.kategori : 'lainnya';
        expenseMap[cat] += (t.nominal || 0);
      }
    });

    const expenseChartData = Object.keys(expenseMap)
      .map(key => ({
        name: key.replace("_", " ").toUpperCase(), 
        value: expenseMap[key]
      }))
      .filter(item => item.value > 0)

    const productSalesMap = {}; 

    transactions.forEach((t) => {
      if (t.jenis === "pemasukan" && t.kategori === "penjualan") {
        
        if (Array.isArray(t.detail_items) && t.detail_items.length > 0) {
            t.detail_items.forEach((item) => {
                if (item.nama_produk) {
                    const nama = item.nama_produk;
                    if (!productSalesMap[nama]) {
                        productSalesMap[nama] = { nama: nama, qty: 0, omzet: 0 };
                    }
                    productSalesMap[nama].qty += Number(item.qty || 0);
                    const nilaiJual = item.subtotal || (item.harga_satuan * item.qty) || 0;
                    productSalesMap[nama].omzet += Number(nilaiJual);
                }
            });
        } 

        else if (t.keterangan) {
            const nama = t.keterangan;
            if (!productSalesMap[nama]) {
                productSalesMap[nama] = { nama: nama, qty: 0, omzet: 0 };
            }
            productSalesMap[nama].qty += 1; 
            productSalesMap[nama].omzet += Number(t.nominal || 0);
        }
      }
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.omzet - a.omzet)
      .slice(0, 5);

    const reminders = await Reminder.find({ id_user: user.id_user }).lean();
    
    const todayDate = new Date().getDate(); 
    
    const sortedReminders = reminders.sort((a, b) => {
        const dateA = a.tanggal_jatuh_tempo < todayDate ? a.tanggal_jatuh_tempo + 31 : a.tanggal_jatuh_tempo;
        const dateB = b.tanggal_jatuh_tempo < todayDate ? b.tanggal_jatuh_tempo + 31 : b.tanggal_jatuh_tempo;
        return dateA - dateB;
    });

    return Response.json({
      summary: {
        totalPenjualan,
        totalPengeluaran,
        labaBersih,
      },
      chartData,
      expenseChartData,
      topProducts,
      reminders: sortedReminders
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}