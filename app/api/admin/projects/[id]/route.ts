// app/api/admin/projects/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/server/db";

// ✅ PUT - Update Project
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Project ID missing in route" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { title, description, image, stats, featured, tags, github, live } = body;

  try {
    // Update project
    await db.query(
      `UPDATE projects
       SET title=?, description=?, image=?, stats=?, featured=?
       WHERE id=?`,
      [title, description, image, stats, featured ? 1 : 0, id]
    );

    // Replace tags
    await db.query(`DELETE FROM project_tags WHERE project_id = ?`, [id]);

    if (tags && tags.length) {
      for (const t of tags) {
        await db.query(
          `INSERT INTO project_tags (id, project_id, tag) VALUES (UUID(), ?, ?)`,
          [id, t]
        );
      }
    }

    // Replace links
    await db.query(`DELETE FROM project_links WHERE project_id = ?`, [id]);

    await db.query(
      `INSERT INTO project_links (id, project_id, github, live)
       VALUES (UUID(), ?, ?, ?)`,
      [id, github || null, live || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// ✅ DELETE - Delete Project
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Project ID missing in route" },
      { status: 400 }
    );
  }

  try {
    // Delete related tags
    await db.query(`DELETE FROM project_tags WHERE project_id = ?`, [id]);

    // Delete related links
    await db.query(`DELETE FROM project_links WHERE project_id = ?`, [id]);

    // Delete the project itself
    await db.query(`DELETE FROM projects WHERE id = ?`, [id]);

    return NextResponse.json({ 
      success: true, 
      message: "Project deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}