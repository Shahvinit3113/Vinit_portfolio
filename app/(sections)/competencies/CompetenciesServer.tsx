import { db } from "@/server/db";
import CompetenciesClient from "./CompetenciesClient";

export default async function CompetenciesServer() {
    try {
        const [competencies] = await db.query<any[]>("SELECT * FROM competencies ORDER BY created_on ASC");
        return <CompetenciesClient items={competencies} />;
    } catch (error) {
        console.error("Failed to fetch competencies:", error);
        return null; // Return nothing if fetch fails
    }
}
