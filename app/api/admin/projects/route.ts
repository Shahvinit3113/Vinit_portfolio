import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const [projects] = await db.query<any[]>(
    "SELECT * FROM projects ORDER BY created_on DESC"
  );

  // Fetch tags
  const [tags] = await db.query<any[]>("SELECT * FROM project_tags");

  // Fetch links
  const [links] = await db.query<any[]>("SELECT * FROM project_links");

  const merged = projects.map((p) => ({
    ...p,
    tags: tags.filter((t) => t.project_id === p.id).map((t) => t.tag),
    links: links.find((l) => l.project_id === p.id) || {
      github: null,
      live: null,
    },
  }));

  return NextResponse.json(merged);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body, "body");

    const { title, description, image, stats, tags, github, live, featured } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description required" },
        { status: 400 }
      );
    }

    // Generate UUID v4 for project
    const projectId = uuidv4();

    // Insert project
    await db.query(
      `
      INSERT INTO projects (id, title, description, image, stats, featured)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [projectId, title, description, image, stats, featured ? 1 : 0]
    );

    // Insert tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await db.query(
          `
          INSERT INTO project_tags (id, project_id, tag)
          VALUES (?, ?, ?)
          `,
          [uuidv4(), projectId, tag]
        );
      }
    }

    // Insert links
    await db.query(
      `
      INSERT INTO project_links (id, project_id, github, live)
      VALUES (?, ?, ?, ?)
      `,
      [uuidv4(), projectId, github || null, live || null]
    );

    return NextResponse.json({ success: true, id: projectId });
  } catch (error) {
    console.error("POST /projects error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
