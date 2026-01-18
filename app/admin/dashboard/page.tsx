export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome Admin</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio content, projects, skills, experience and more.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up">
          <DashboardCard
            title="Projects"
            description="Manage portfolio projects"
            link="/admin/projects"
          />
          <DashboardCard
            title="Skills"
            description="Manage skill categories and items"
            link="/admin/skills"
          />
          <DashboardCard
            title="Experience"
            description="Update your career timeline"
            link="/admin/experience"
          />
          <DashboardCard
            title="Messages"
            description="View contact form submissions"
            link="/admin/messages"
          />
        </div>

        {/* Future sections (Analytics, Logs, etc.) */}
        <div className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm fade-in-up">
          <h3 className="text-lg font-bold mb-2">Analytics (Coming Soon)</h3>
          <p className="text-sm text-muted-foreground">Traffic, user interactions, performance metrics…</p>
        </div>

      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <a
      href={link}
      className="p-6 border border-border/50 hover:border-primary/40 hover:bg-primary/5 rounded-xl transition-all duration-300 bg-card/40 backdrop-blur-sm group"
    >
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      <span className="text-primary font-semibold text-sm group-hover:underline">
        Go to {title}
      </span>
    </a>
  );
}
