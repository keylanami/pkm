import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({
      status: "ok",
      message: "MongoDB connected successfully",
    });
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
