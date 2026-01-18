import { db } from "@/server/db";
import ExperienceClient from "./ExperienceClient";

export default async function ExperienceServer() {
  const [experiences] = await db.query<any[]>("SELECT * FROM experience ORDER BY period DESC");
  const [skills] = await db.query<any[]>("SELECT * FROM experience_skills");
  const [achievements] = await db.query<any[]>("SELECT * FROM experience_achievements");

  const merged = experiences.map(exp => ({
    ...exp,
    skills: skills.filter(s => s.experience_id === exp.id).map(s => s.skill),
    achievements: achievements.filter(a => a.experience_id === exp.id).map(a => a.achievement),
  }));

  return <ExperienceClient experiences={merged} />;
}
