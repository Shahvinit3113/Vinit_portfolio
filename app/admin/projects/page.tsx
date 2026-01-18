import { db } from "@/server/db";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const [projects] = await db.query<any[]>("SELECT * FROM projects ORDER BY created_on DESC");

  // fetch tags
  const [tags] = await db.query<any[]>("SELECT * FROM project_tags");

  // fetch links
  const [links] = await db.query<any[]>("SELECT * FROM project_links");

  const merged = projects.map((p) => ({
    ...p,
    tags: tags.filter(t => t.project_id === p.id).map(t => t.tag),
    links: links.find(l => l.project_id === p.id) || { github: null, live: null }
  }));

  return <ProjectsClient projects={merged} />;
}
