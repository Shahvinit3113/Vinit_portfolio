import { db } from "@/server/db";
import ExperienceClient from "./ExperienceClient";

export default async function ExperiencePage() {
  const [experiences]: any = await db.query<any[]>("SELECT * FROM experience ORDER BY created_on DESC");
  const [achievements]: any = await db.query<any[]>("SELECT * FROM experience_achievements");
  const [skills]: any = await db.query<any[]>("SELECT * FROM experience_skills");

  const data = experiences.map((exp: any) => ({
    ...exp,
    achievements: achievements
      .filter((a: any) => a.experience_id === exp.id)
      .map((a: any) => a.achievement),
    skills: skills
      .filter((s: any) => s.experience_id === exp.id)
      .map((s: any) => s.skill)
  }));

  return <ExperienceClient experience={data} />;
}
