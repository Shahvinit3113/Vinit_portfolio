import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(request: Request) {
  const body = await request.json();
  const id = crypto.randomUUID();

  await db.query(
    "INSERT INTO skill_items (id, category_id, name, level) VALUES (?, ?, ?, ?)",
    [id, body.category_id, body.name, body.level]
  );

  const [rows]: any = await db.query(
    "SELECT * FROM skill_items WHERE id = ?",
    [id]
  );

  return NextResponse.json({ success: true, skill: rows[0] });
}
