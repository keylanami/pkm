import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getUserFromRequest } from "@/lib/getUser";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const reminders = await Reminder.find({ id_user: user.id_user }).sort({ tanggal_jatuh_tempo: 1 });
    return Response.json(reminders);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const reminder = await Reminder.create({ ...body, id_user: user.id_user });
    
    return Response.json(reminder, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}