import connectDB from "@/lib/mongodb";
import Reminder from "@/models/Reminder";
import { getUserFromRequest } from "@/lib/getUser";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await Reminder.findOneAndDelete({ _id: id, id_user: user.id_user });

    return Response.json({ message: "Deleted" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id, id_user: user.id_user },
      { ...body },
      { new: true }
    );

    return Response.json(updatedReminder);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}