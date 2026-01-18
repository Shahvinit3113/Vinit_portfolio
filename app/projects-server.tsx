import { db } from "@/server/db";

export async function getProjects() {
  const [projects] = await db.query<any[]>("SELECT * FROM projects");
  const [tags] = await db.query<any[]>("SELECT * FROM project_tags");
  const [links] = await db.query<any[]>("SELECT * FROM project_links");

  return projects.map((p) => ({
    ...p,
    tags: tags.filter(t => t.project_id === p.id).map(t => t.tag),
    links: links.find(l => l.project_id === p.id) || {},
  }));
}
