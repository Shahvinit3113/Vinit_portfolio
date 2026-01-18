import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function DELETE(request: Request, { params }: any) {
  const { id } = await params;
  // Delete skills first (or rely on cascade)
  await db.query("DELETE FROM skill_items WHERE category_id = ?", [id]);
  await db.query("DELETE FROM skill_categories WHERE id = ?", [id]);
  return NextResponse.json({ success: true });
}
